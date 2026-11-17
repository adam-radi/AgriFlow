<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function products(Request $request)
    {
        $products = Product::with(['productQuantities', 'user', 'harvests' => function ($q) {
            $q->where('status', 'open');
        }])
        ->where('is_available', true)
        ->latest()
        ->paginate(15);

        return $this->success(
            ProductResource::collection($products)->response()->getData(true)
        );
    }

    public function productDetails(string $id)
    {
        $product = Product::with(['productQuantities', 'user', 'harvests' => function ($q) {
            $q->where('status', 'open');
        }])
        ->findOrFail($id);

        return $this->success(new ProductResource($product));
    }
}
