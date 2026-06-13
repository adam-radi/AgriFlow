<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Services\DeliveryService;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request, OrderService $orderService)
    {
        return response()->json($orderService->listCustomerOrders($request));
    }

    public function store(StoreOrderRequest $request, OrderService $orderService, DeliveryService $deliveryService)
    {
        $order = $orderService->placeOrder($request);

        if ($order->zone && $order->delivery_date) {
            $deliveryService->groupOrderItems($order);
        }

        return response()->json([
            'message' => 'Order placed successfully',
            'order'   => $order,
        ], 201);
    }

    public function show(Order $order, OrderService $orderService)
    {
        $this->authorizeOrderAccess($order, request());

        return response()->json($orderService->showOrder($order));
    }

    public function cancel(Order $order, Request $request, OrderService $orderService)
    {
        $cancelled = $orderService->cancelOrder($order, $request);

        return response()->json([
            'message' => 'Order cancelled',
            'order'   => $cancelled,
        ]);
    }

    public function updateStatus(Order $order, string $status, Request $request, OrderService $orderService)
    {
        if (!$request->user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $updated = $orderService->updateStatus($order, $status);

        return response()->json([
            'message' => 'Status updated',
            'order'   => $updated,
        ]);
    }

    private function authorizeOrderAccess(Order $order, Request $request): void
    {
        if ($order->customer_id !== $request->user()->id && !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }
    }
}
