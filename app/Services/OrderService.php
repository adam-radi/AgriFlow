<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Models\Harvest;
use App\Models\HarvestDailyCapacity;
use App\Models\Order;
use App\Models\ProductQuantity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function placeOrder(Request $request): Order
    {
        return DB::transaction(function () use ($request) {
            $items      = $request->input('items', []);
            $total      = 0;
            $prepared   = [];
            $reservations = []; // track (harvest_id, date) => qty for capacity update

            foreach ($items as $item) {
                $harvest = Harvest::where('id', $item['harvest_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($harvest->status !== 'open') {
                    throw ValidationException::withMessages([
                        'harvest_id' => "Harvest #{$harvest->id} is not active.",
                    ]);
                }

                $standard = ProductQuantity::findOrFail($item['quantity_standard_id']);

                if ($standard->product_id !== $harvest->product_id) {
                    throw ValidationException::withMessages([
                        'quantity_standard_id' => 'Quantity standard does not belong to this product.',
                    ]);
                }

                $scheduledDate = $item['scheduled_harvest_date']
                    ?? $request->input('delivery_date');

                if (!$scheduledDate) {
                    throw ValidationException::withMessages([
                        'scheduled_harvest_date' => 'A scheduled harvest date or delivery date is required.',
                    ]);
                }

                $scheduledDate = \Carbon\Carbon::parse($scheduledDate)->toDateString();

                $startStr = $harvest->start_date->toDateString();
                $endStr = $harvest->end_date? $harvest->end_date->toDateString() : 'open';

                if ($scheduledDate < $startStr
                    || ($harvest->end_date && $scheduledDate > $endStr)) {
                    throw ValidationException::withMessages([
                        'scheduled_harvest_date' => "Date must be within harvest period ({$startStr} - {$endStr}).",
                    ]);
                }

                $qty      = (int) $item['quantity'];
                $subtotal = $standard->price * $qty;
                $total   += $subtotal;

                $key = $harvest->id . '_' . $scheduledDate;
                $reservations[$key] = ($reservations[$key] ?? 0) + $qty;

                $prepared[] = [
                    'product_id'             => $harvest->product_id,
                    'harvest_id'             => $harvest->id,
                    'scheduled_harvest_date' => $scheduledDate,
                    'quantity_standard_id'   => $standard->id,
                    'quantity'               => $qty,
                    'unit_price'             => $standard->price,
                    'subtotal'               => $subtotal,
                ];
            }

            foreach ($reservations as $key => $totalQty) {
                [$harvestId, $date] = explode('_', $key, 2);

                $harvest = Harvest::where('id', $harvestId)->lockForUpdate()->firstOrFail();

                $daily = HarvestDailyCapacity::firstOrCreate([
                    'harvest_id' => $harvestId,
                    'date'       => $date,
                ], [
                    'reserved_quantity' => 0,
                ]);

                $daily = HarvestDailyCapacity::where('id', $daily->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $newTotalReserved  = $harvest->reserved_quantity + $totalQty;
                $newDailyReserved  = $daily->reserved_quantity + $totalQty;

                if ($newTotalReserved > $harvest->estimated_total_qte) {
                    throw ValidationException::withMessages([
                        'quantity' => "Insufficient total harvest capacity. Available: "
                            . ($harvest->estimated_total_qte - $harvest->reserved_quantity)
                            . ", requested: {$totalQty}.",
                    ]);
                }

                if ($newDailyReserved > $harvest->max_daily_qte) {
                    throw ValidationException::withMessages([
                        'quantity' => "Insufficient daily capacity for {$date}. Available: "
                            . ($harvest->max_daily_qte - $daily->reserved_quantity)
                            . ", requested: {$totalQty}.",
                    ]);
                }

                $harvest->increment('reserved_quantity', $totalQty);
                $daily->increment('reserved_quantity', $totalQty);
            }

            $order = Order::create([
                'customer_id'   => $request->user()->id,
                'status'        => OrderStatus::Pending,
                'total_amount'  => $total,
                'zone'          => $request->input('zone'),
                'delivery_date' => $request->input('delivery_date'),
            ]);

            foreach ($prepared as $itemData) {
                $order->items()->create($itemData);
            }

            return $order->load('items.product', 'items.quantityStandard');
        });
    }

    public function listCustomerOrders(Request $request)
    {
        return Order::where('customer_id', $request->user()->id)
            ->with('items.product', 'payment')
            ->latest()
            ->paginate(15);
    }

    public function showOrder(Order $order)
    {
        return $order->load('items.product', 'items.quantityStandard', 'payment', 'customer');
    }

    public function cancelOrder(Order $order, Request $request): Order
    {
        if ($order->customer_id !== $request->user()->id && !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        if (in_array($order->status, [OrderStatus::Delivered, OrderStatus::Cancelled])) {
            throw ValidationException::withMessages([
                'status' => "Cannot cancel an order with status '{$order->status}'.",
            ]);
        }

        return DB::transaction(function () use ($order) {
            $items = $order->items;

            $grouped = $items->groupBy(function ($item) use ($order) {
                return $item->harvest_id . '_' . ($item->scheduled_harvest_date ?? $order->delivery_date);
            });

            foreach ($grouped as $key => $group) {
                [$harvestId, $date] = explode('_', $key, 2);
                $totalQty = $group->sum('quantity');

                $harvest = Harvest::where('id', $harvestId)
                    ->lockForUpdate()
                    ->firstOrFail();

                $daily = HarvestDailyCapacity::where('harvest_id', $harvestId)
                    ->where('date', $date)
                    ->lockForUpdate()
                    ->first();

                $harvest->decrement('reserved_quantity', $totalQty);

                if ($daily) {
                    $daily->decrement('reserved_quantity', $totalQty);
                }
            }

            $order->update(['status' => OrderStatus::Cancelled]);

            return $order->fresh();
        });
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);

        return $order->fresh();
    }
}
