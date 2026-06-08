<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DeliveryGroupResource;
use App\Models\DeliveryGroup;
use App\Services\DeliveryService;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    public function index(Request $request, DeliveryService $deliveryService)
    {
        $this->authorize('viewAny', DeliveryGroup::class);

        if ($request->user()->isAdmin()) {
            $groups = $deliveryService->listGroups($request);
        } else {
            $groups = $deliveryService->listLivreurGroups($request);
        }

        return $this->success($groups);
    }

    public function show(DeliveryGroup $deliveryGroup, DeliveryService $deliveryService)
    {
        $this->authorize('view', $deliveryGroup);

        $group = $deliveryService->showGroup($deliveryGroup);

        return $this->success(new DeliveryGroupResource($group));
    }

    public function assign(DeliveryGroup $deliveryGroup, int $userId, Request $request, DeliveryService $deliveryService)
    {
        $this->authorize('assign', DeliveryGroup::class);

        $group = $deliveryService->assignDeliveryUser($deliveryGroup, $userId);

        return $this->success(new DeliveryGroupResource($group), 'Delivery user assigned');
    }

    public function updateStatus(DeliveryGroup $deliveryGroup, string $status, Request $request, DeliveryService $deliveryService)
    {
        $this->authorize('updateStatus', $deliveryGroup);

        $group = $deliveryService->updateGroupStatus($deliveryGroup, $status);

        return $this->success(new DeliveryGroupResource($group), 'Status updated');
    }
}
