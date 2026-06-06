<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\Request;

class CustomerDashboardController extends Controller
{
    public function browse(Request $request)
    {
        $products = Product::with(['productQuantities', 'harvests' => function ($q) {
            $q->where('status', 'open');
        }])
        ->whereHas('harvests', fn($q) => $q->where('status', 'open'))
        ->latest()
        ->paginate(15);

        return response()->json($products);
    }

    public function orderHistory(Request $request)
    {
        $orders = Order::where('customer_id', $request->user()->id)
            ->with('items.product', 'items.quantityStandard', 'payment')
            ->latest()
            ->paginate(15);

        return response()->json($orders);
    }

    public function trackOrder(Order $order, Request $request)
    {
        if ($order->customer_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        return response()->json($order->load(
            'items.product',
            'items.quantityStandard',
            'items.deliveryGroupItem.deliveryGroup',
            'payment'
        ));
    }

    public function paymentHistory(Request $request)
    {
        $payments = Payment::whereHas('order', fn($q) => $q->where('customer_id', $request->user()->id))
            ->with('order')
            ->latest()
            ->paginate(15);

        return response()->json($payments);
    }
}
