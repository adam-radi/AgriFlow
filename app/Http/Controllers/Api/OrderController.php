<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\DeliveryService;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request, OrderService $orderService)
    {
        $this->authorize('viewAny', Order::class);

        $orders = $orderService->listCustomerOrders($request);

        return $this->success(
            OrderResource::collection($orders)->response()->getData(true)
        );
    }

    public function store(StoreOrderRequest $request, OrderService $orderService, DeliveryService $deliveryService)
    {
        $this->authorize('create', Order::class);

        $order = $orderService->placeOrder($request);

        if ($order->zone && $order->delivery_date) {
            $deliveryService->groupOrderItems($order);
        }

        return $this->created(new OrderResource($order), 'Order placed successfully');
    }

    public function show(Order $order, OrderService $orderService)
    {
        $this->authorize('view', $order);

        $order = $orderService->showOrder($order);

        return $this->success(new OrderResource($order));
    }

    public function cancel(Order $order, Request $request, OrderService $orderService)
    {
        $this->authorize('cancel', $order);

        $cancelled = $orderService->cancelOrder($order, $request);

        return $this->success(new OrderResource($cancelled), 'Order cancelled');
    }

    public function updateStatus(Order $order, string $status, Request $request, OrderService $orderService)
    {
        $this->authorize('updateStatus', $order);

        $updated = $orderService->updateStatus($order, $status);

        return $this->success(new OrderResource($updated), 'Status updated');
    }
}
