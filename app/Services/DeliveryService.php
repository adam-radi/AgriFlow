<?php

namespace App\Services;

use App\Enums\DeliveryStatus;
use App\Models\DeliveryGroup;
use App\Models\DeliveryGroupItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DeliveryService
{
    public function groupOrderItems(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $group = DeliveryGroup::firstOrCreate(
                    [
                        'zone'          => $order->zone,
                        'delivery_date' => $order->delivery_date,
                        'status'        => DeliveryStatus::Planned,
                    ],
                    [
                        'zone'          => $order->zone,
                        'delivery_date' => $order->delivery_date,
                        'status'        => DeliveryStatus::Planned,
                    ]
                );

                DeliveryGroupItem::firstOrCreate([
                    'delivery_group_id' => $group->id,
                    'order_item_id'     => $item->id,
                ]);
            }
        });
    }

    public function listGroups(Request $request)
    {
        $query = DeliveryGroup::with('items.orderItem.order.customer', 'deliveryUser');

        if ($request->has('zone')) {
            $query->where('zone', $request->zone);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return $query->latest()->paginate(15);
    }

    public function assignDeliveryUser(DeliveryGroup $group, int $userId): DeliveryGroup
    {
        $group->update([
            'delivery_user_id' => $userId,
            'status'           => DeliveryStatus::Assigned,
        ]);

        return $group->fresh('deliveryUser');
    }

    public function updateGroupStatus(DeliveryGroup $group, string $status): DeliveryGroup
    {
        $group->update(['status' => $status]);

        return $group->fresh();
    }

    public function listLivreurGroups(Request $request)
    {
        return DeliveryGroup::where('delivery_user_id', $request->user()->id)
            ->with('items.orderItem.order.customer', 'items.orderItem.product')
            ->latest()
            ->paginate(15);
    }

    public function showGroup(DeliveryGroup $group)
    {
        return $group->load('items.orderItem.order.customer', 'items.orderItem.product', 'deliveryUser');
    }
}
