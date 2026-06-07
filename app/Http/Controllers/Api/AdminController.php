<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateDeliveryUserRequest;
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

        return response()->json($service->globalStats());
    }

    public function listUsers(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return response()->json($service->listUsers($request));
    }

    public function approveFarmer(User $user, Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return response()->json([
            'message' => 'Farmer approved',
            'user'    => $service->approveFarmer($user),
        ]);
    }

    public function rejectFarmer(User $user, Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return response()->json([
            'message' => 'Farmer rejected',
            'user'    => $service->rejectFarmer($user),
        ]);
    }

    public function createDeliveryUser(CreateDeliveryUserRequest $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return response()->json([
            'message' => 'Delivery user created',
            'user'    => $service->createDeliveryUser($request),
        ], 201);
    }

    public function deleteUser(User $user, Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);
        $service->deleteUser($user);

        return response()->json(['message' => 'User deleted']);
    }

    public function listOrders(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return response()->json($service->listAllOrders($request));
    }

    public function listProducts(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return response()->json($service->listAllProducts($request));
    }

    public function listHarvests(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return response()->json($service->listAllHarvests($request));
    }

    public function listDeliveries(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return response()->json($service->listAllDeliveries($request));
    }
}
