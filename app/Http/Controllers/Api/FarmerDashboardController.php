<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FarmerDashboardService;
use Illuminate\Http\Request;

class FarmerDashboardController extends Controller
{
    public function stats(Request $request, FarmerDashboardService $service)
    {
        if (!$request->user()->isFarmer()) {
            abort(403, 'Unauthorized');
        }

        return response()->json($service->stats($request));
    }

    public function receivedOrders(Request $request, FarmerDashboardService $service)
    {
        if (!$request->user()->isFarmer()) {
            abort(403, 'Unauthorized');
        }

        return response()->json($service->receivedOrders($request));
    }

    public function popularProducts(Request $request, FarmerDashboardService $service)
    {
        if (!$request->user()->isFarmer()) {
            abort(403, 'Unauthorized');
        }

        return response()->json(['data' => $service->popularProducts($request)]);
    }
}
