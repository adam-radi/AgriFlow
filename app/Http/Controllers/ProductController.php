<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\ProductService;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request, ProductService $productService)
    {
        $products = $productService->fetchFarmerProduct($request);

        return response()->json(['products' => $products]);
    }

    public function store(StoreProductRequest $request, ProductService $productService)
    {
        $product = $productService->createProduct($request);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product,
        ], 201);
    }

    public function show(Request $request, Product $product, ProductService $productService)
    {
        $product = $productService->showProduct($request, $product);

        return response()->json(['product' => $product]);
    }

    public function update(UpdateProductRequest $request, Product $product, ProductService $productService)
    {
        $product = $productService->updateProduct($request, $product);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }

    public function destroy(Request $request, Product $product, ProductService $productService)
    {
        $productService->deleteProduct($request, $product);

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }

    public function manageQuantity(Request $request, Product $product, ProductService $productService)
    {
        $quantity = $productService->manageQuantity($request, $product);

        return response()->json([
            'message' => 'Quantity saved successfully',
            'quantity' => $quantity,
        ]);
    }
}
