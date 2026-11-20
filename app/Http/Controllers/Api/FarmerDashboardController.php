<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Services\FarmerDashboardService;
use Illuminate\Http\Request;

class FarmerDashboardController extends Controller
{
    public function stats(Request $request, FarmerDashboardService $service)
    {
        if (!$request->user()->isFarmer()) {
            abort(403, 'Unauthorized');
        }

        return $this->success($service->stats($request));
    }

    public function receivedOrders(Request $request, FarmerDashboardService $service)
    {
        if (!$request->user()->isFarmer()) {
            abort(403, 'Unauthorized');
        }

        $orders = $service->receivedOrders($request);

        return $this->success(
            OrderResource::collection($orders)->response()->getData(true)
        );
    }

    public function popularProducts(Request $request, FarmerDashboardService $service)
    {
        if (!$request->user()->isFarmer()) {
            abort(403, 'Unauthorized');
        }

        return $this->success($service->popularProducts($request));
    }
}
