<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\Request;

class CustomerDashboardController extends Controller
{
    public function browse(Request $request)
    {
        if (!$request->user()->isClient()) {
            abort(403, 'Unauthorized');
        }

        $products = Product::with(['productQuantities', 'harvests' => function ($q) {
            $q->where('status', 'open');
        }])
        ->whereHas('harvests', fn($q) => $q->where('status', 'open'))
        ->latest()
        ->paginate(15);

        return $this->success(
            ProductResource::collection($products)->response()->getData(true)
        );
    }

    public function orderHistory(Request $request)
    {
        if (!$request->user()->isClient()) {
            abort(403, 'Unauthorized');
        }

        $orders = Order::where('customer_id', $request->user()->id)
            ->with('items.product', 'items.quantityStandard', 'payment')
            ->latest()
            ->paginate(15);

        return $this->success(
            OrderResource::collection($orders)->response()->getData(true)
        );
    }

    public function trackOrder(Order $order, Request $request)
    {
        if (!$request->user()->isClient() || $order->customer_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $order->load(
            'items.product',
            'items.quantityStandard',
            'items.deliveryGroupItem.deliveryGroup',
            'payment'
        );

        return $this->success(new OrderResource($order));
    }

    public function paymentHistory(Request $request)
    {
        if (!$request->user()->isClient()) {
            abort(403, 'Unauthorized');
        }

        $payments = Payment::whereHas('order', fn($q) => $q->where('customer_id', $request->user()->id))
            ->with('order')
            ->latest()
            ->paginate(15);

        return $this->success(
            PaymentResource::collection($payments)->response()->getData(true)
        );
    }
}
