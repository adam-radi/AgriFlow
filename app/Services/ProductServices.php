<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductQuantity;

class ProductServices
{
    public function createProduct(Request $request)
    {
        // Get the minimum price from quantities or use a default
        $quantities = $request->input('quantities', []);
        $basePrice = 0;

        if (!empty($quantities)) {
            $prices = array_column($quantities, 'price');
            $basePrice = min($prices) ?? 0;
        }

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => $request->user()->id,
            'base_price' => $basePrice,
        ]);

        // Create quantities if provided
        if (!empty($quantities)) {
            foreach ($quantities as $qty) {
                ProductQuantity::create([
                    'product_id' => $product->id,
                    'label' => $qty['label'],
                    'price' => $qty['price'],
                ]);
            }
        }

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product->load('productQuantities'),
        ], 201);
    }

    public function updateProduct(Request $request, Product $product)
    {
        if ($request->user()->id !== $product->user_id && $request->user()->role !== 'farmer') {
            return response()->json([
                'message' => 'unauthorized',
            ], 403);
        }

        $product->update([
            'name' => $request->name ?? $product->name,
            'description' => $request->description ?? $product->description,
        ]);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ], 200);
    }

    public function deleteProduct(Request $request, Product $product)
    {
        if ($request->user()->id !== $product->user_id && $request->user()->role !== 'farmer') {
            return response()->json([
                'message' => 'unauthorized',
            ], 403);
        }

        $product->delete();
        return response()->json([
            'message' => 'Product deleted successfully',
        ], 200);
    }

    public function fetchFarmerProduct(Request $request)
    {
        $products = Product::where('user_id', $request->user()->id)->get();
        return response()->json([
            'products' => $products,
        ]);
    }

    public function manageQuantity(Request $request, Product $product)
    {
        if ($request->user()->id !== $product->user_id && $request->user()->role !== 'farmer') {
            return response()->json([
                'message' => 'unauthorized',
            ], 403);
        }

        $quantity = $product->productQuantities()->where('label', $request->label)->first();

        if (!$quantity) {
            $quantity = ProductQuantity::create([
                'product_id' => $product->id,
                'label' => $request->label,
                'price' => $request->price,
            ]);

            return response()->json([
                'message' => 'Quantity created successfully',
                'quantity' => $quantity,
            ], 201);
        }

        $quantity->update([
            'price' => $request->price,
        ]);

        return response()->json([
            'message' => 'Quantity updated successfully',
            'quantity' => $quantity,
        ], 200);
    }

    public function showProduct(Request $request, Product $product)
    {
        $product = Product::with('productQuantities')->find($product->id);
        return response()->json([
            'product' => $product,
        ]);
    }
}
