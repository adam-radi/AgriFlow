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
use App\Models\Product;
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

        $orders = $service->listAllOrders($request);

        return $this->success(OrderResource::collection($orders));
    }

    public function listProducts(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        $products = $service->listAllProducts($request);

        return $this->success(ProductResource::collection($products));
    }

    public function listHarvests(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        $harvests = $service->listAllHarvests($request);

        return $this->success(HarvestResource::collection($harvests));
    }

    public function listDeliveries(Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        return $this->success($service->listAllDeliveries($request));
    }

    public function disableProduct(Product $product, Request $request)
    {
        $this->ensureAdmin($request);

        $product->update(['is_available' => false]);

        return $this->success(new ProductResource($product->fresh()), 'Product disabled');
    }

    public function enableProduct(Product $product, Request $request)
    {
        $this->ensureAdmin($request);

        $product->update(['is_available' => true]);

        return $this->success(new ProductResource($product->fresh()), 'Product enabled');
    }

    public function updateProduct(Product $product, Request $request, AdminService $service)
    {
        $this->ensureAdmin($request);

        $validated = $request->validate([
            'name'        => 'sometimes|string',
            'description' => 'sometimes|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = [];
        if (isset($validated['name'])) $data['name'] = $validated['name'];
        if (isset($validated['description'])) $data['description'] = $validated['description'];

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($product->image_path);
            }
            $data['image_path'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return $this->success(new ProductResource($product->fresh(['user', 'productQuantities'])), 'Product updated');
    }

    public function deleteProduct(Product $product, Request $request)
    {
        $this->ensureAdmin($request);

        if ($product->image_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        return $this->success(null, 'Product deleted');
    }
}
