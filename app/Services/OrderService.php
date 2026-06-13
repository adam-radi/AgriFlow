<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Models\Harvest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductQuantity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function placeOrder(Request $request): Order
    {
        return DB::transaction(function () use ($request) {
            $items    = $request->input('items', []);
            $total    = 0;
            $prepared = [];

            foreach ($items as $item) {
                $harvest = Harvest::findOrFail($item['harvest_id']);

                if ($harvest->status !== 'open') {
                    throw ValidationException::withMessages([
                        'harvest_id' => "Harvest #{$harvest->id} is not active.",
                    ]);
                }

                $standard = ProductQuantity::findOrFail($item['quantity_standard_id']);

                if ($standard->product_id !== $harvest->product_id) {
                    throw ValidationException::withMessages([
                        'quantity_standard_id' => "Quantity standard does not belong to this product.",
                    ]);
                }

                $qty      = (int) $item['quantity'];
                $subtotal = $standard->price * $qty;
                $total   += $subtotal;

                $prepared[] = [
                    'product_id'           => $harvest->product_id,
                    'harvest_id'           => $harvest->id,
                    'quantity_standard_id' => $standard->id,
                    'quantity'             => $qty,
                    'unit_price'           => $standard->price,
                    'subtotal'             => $subtotal,
                ];
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

        if ($order->status === OrderStatus::Delivered) {
            throw ValidationException::withMessages([
                'status' => 'Cannot cancel a delivered order.',
            ]);
        }

        $order->update(['status' => OrderStatus::Cancelled]);

        return $order->fresh();
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);

        return $order->fresh();
    }
}
