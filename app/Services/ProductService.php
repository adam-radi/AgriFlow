<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductQuantity;
use Illuminate\Auth\Access\AuthorizationException;

class ProductService
{
    public function createProduct(Request $request): Product
    {
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

        if (!empty($quantities)) {
            foreach ($quantities as $qty) {
                ProductQuantity::create([
                    'product_id' => $product->id,
                    'label' => $qty['label'],
                    'price' => $qty['price'],
                ]);
            }
        }

        return $product->load('productQuantities');
    }

    public function updateProduct(Request $request, Product $product): Product
    {
        $this->authorizeOwnership($request, $product);

        $product->update([
            'name' => $request->name ?? $product->name,
            'description' => $request->description ?? $product->description,
        ]);

        return $product->fresh();
    }

    public function deleteProduct(Request $request, Product $product): void
    {
        $this->authorizeOwnership($request, $product);
        $product->delete();
    }

    public function fetchFarmerProduct(Request $request)
    {
        return Product::where('user_id', $request->user()->id)->get();
    }

    public function manageQuantity(Request $request, Product $product): ProductQuantity
    {
        $this->authorizeOwnership($request, $product);

        $quantity = $product->productQuantities()
            ->where('label', $request->label)
            ->first();

        if (!$quantity) {
            $quantity = ProductQuantity::create([
                'product_id' => $product->id,
                'label' => $request->label,
                'price' => $request->price,
            ]);
        } else {
            $quantity->update([
                'price' => $request->price,
            ]);
        }

        return $quantity->fresh();
    }

    public function showProduct(Request $request, Product $product): Product
    {
        return Product::with('productQuantities')->findOrFail($product->id);
    }

    private function authorizeOwnership(Request $request, Product $product): void
    {
        if ($request->user()->id !== $product->user_id) {
            throw new AuthorizationException('Unauthorized');
        }
    }
}
