<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request, ProductService $productService)
    {
        $this->authorize('viewAny', Product::class);

        $products = $productService->fetchFarmerProduct($request);

        return $this->success(ProductResource::collection($products));
    }

    public function store(StoreProductRequest $request, ProductService $productService)
    {
        $this->authorize('create', Product::class);

        $product = $productService->createProduct($request);

        return $this->created(new ProductResource($product), 'Product created successfully');
    }

    public function show(Request $request, Product $product, ProductService $productService)
    {
        $this->authorize('view', $product);

        $product = $productService->showProduct($request, $product);

        return $this->success(new ProductResource($product));
    }

    public function update(UpdateProductRequest $request, Product $product, ProductService $productService)
    {
        $this->authorize('update', $product);

        $product = $productService->updateProduct($request, $product);

        return $this->success(new ProductResource($product), 'Product updated successfully');
    }

    public function destroy(Request $request, Product $product, ProductService $productService)
    {
        $this->authorize('delete', $product);

        $productService->deleteProduct($request, $product);

        return $this->success(null, 'Product deleted successfully');
    }

    public function manageQuantity(Request $request, Product $product, ProductService $productService)
    {
        $this->authorize('update', $product);

        $quantity = $productService->manageQuantity($request, $product);

        return $this->success($quantity, 'Quantity saved successfully');
    }
}
