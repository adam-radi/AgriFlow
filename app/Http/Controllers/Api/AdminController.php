<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateDeliveryUserRequest;
use App\Http\Resources\HarvestResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\DeliveryGroupResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AdminService;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    private function ensureAdmin(Request $request): void
    {
        if (!$request->user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }
    }

    public function stats(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return $this->success($service->globalStats());
    }

    public function listUsers(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return $this->success($service->listUsers($request));
    }

    public function approveFarmer(User $user, Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        $user = $service->approveFarmer($user);

        return $this->success(new UserResource($user), 'Farmer approved');
    }

    public function rejectFarmer(User $user, Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        $user = $service->rejectFarmer($user);

        return $this->success(new UserResource($user), 'Farmer rejected');
    }

    public function createDeliveryUser(CreateDeliveryUserRequest $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        $user = $service->createDeliveryUser($request);

        return $this->created(new UserResource($user), 'Delivery user created');
    }

    public function deleteUser(User $user, Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        $service->deleteUser($user);

        return $this->success(null, 'User deleted');
    }

    public function listOrders(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return $this->success($service->listAllOrders($request));
    }

    public function listProducts(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return $this->success($service->listAllProducts($request));
    }

    public function listHarvests(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return $this->success($service->listAllHarvests($request));
    }

    public function listDeliveries(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return $this->success($service->listAllDeliveries($request));
    }
}
