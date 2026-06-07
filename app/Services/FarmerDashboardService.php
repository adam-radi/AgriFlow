<?php

namespace App\Services;

use App\Models\Harvest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;

class FarmerDashboardService
{
    public function stats(Request $request): array
    {
        $farmerId   = $request->user()->id;
        $productIds = Product::where('user_id', $farmerId)->pluck('id');
        $harvestIds = Harvest::whereIn('product_id', $productIds)->pluck('id');

        $orderItems = OrderItem::whereIn('harvest_id', $harvestIds);

        return [
            'total_products'       => $productIds->count(),
            'active_harvests'      => Harvest::whereIn('product_id', $productIds)
                                            ->where('status', 'open')->count(),
            'total_orders_received'=> (clone $orderItems)->distinct('order_id')->count(),
            'total_revenue'        => (clone $orderItems)->join('orders', 'order_items.order_id', '=', 'orders.id')
                                            ->where('orders.status', 'delivered')
                                            ->sum('order_items.subtotal'),
        ];
    }

    public function receivedOrders(Request $request)
    {
        $farmerId   = $request->user()->id;
        $productIds = Product::where('user_id', $farmerId)->pluck('id');
        $harvestIds = Harvest::whereIn('product_id', $productIds)->pluck('id');

        $orderIds = OrderItem::whereIn('harvest_id', $harvestIds)
            ->distinct('order_id')
            ->pluck('order_id');

        return Order::whereIn('id', $orderIds)
            ->with('customer', 'items.product', 'items.quantityStandard')
            ->latest()
            ->paginate(15);
    }

    public function popularProducts(Request $request): array
    {
        $farmerId   = $request->user()->id;
        $productIds = Product::where('user_id', $farmerId)->pluck('id');

        return OrderItem::whereIn('product_id', $productIds)
            ->selectRaw('product_id, SUM(quantity) as total_qty, SUM(subtotal) as total_revenue')
            ->groupBy('product_id')
            ->with('product:id,name')
            ->orderByDesc('total_qty')
            ->limit(10)
            ->get()
            ->toArray();
    }
}
