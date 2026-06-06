<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeliveryGroup;
use App\Services\DeliveryService;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    public function index(Request $request, DeliveryService $deliveryService)
    {
        if ($request->user()->isAdmin()) {
            return response()->json($deliveryService->listGroups($request));
        }

        if ($request->user()->isLivreur()) {
            return response()->json($deliveryService->listLivreurGroups($request));
        }

        abort(403, 'Unauthorized');
    }

    public function show(DeliveryGroup $deliveryGroup, DeliveryService $deliveryService)
    {
        return response()->json($deliveryService->showGroup($deliveryGroup));
    }

    public function assign(DeliveryGroup $deliveryGroup, int $userId, Request $request, DeliveryService $deliveryService)
    {
        if (!$request->user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $group = $deliveryService->assignDeliveryUser($deliveryGroup, $userId);

        return response()->json([
            'message'        => 'Delivery user assigned',
            'delivery_group' => $group,
        ]);
    }

    public function updateStatus(DeliveryGroup $deliveryGroup, string $status, Request $request, DeliveryService $deliveryService)
    {
        $user = $request->user();

        if (!$user->isAdmin() && !($user->isLivreur() && $deliveryGroup->delivery_user_id === $user->id)) {
            abort(403, 'Unauthorized');
        }

        $group = $deliveryService->updateGroupStatus($deliveryGroup, $status);

        return response()->json([
            'message'        => 'Status updated',
            'delivery_group' => $group,
        ]);
    }
}
