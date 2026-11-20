<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductQuantity;
use App\Models\Harvest;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CartService
{
    public function getCart(Request $request): Cart
    {
        return Cart::firstOrCreate(['user_id' => $request->user()->id])
            ->load('items.harvest.product', 'items.quantityStandard');
    }

    public function addItem(Request $request): Cart
    {
        $validated = $request->validate([
            'harvest_id'         => 'required|integer|exists:harvests,id',
            'quantity_standard_id' => 'required|integer|exists:product_quantities,id',
            'quantity'           => 'required|integer|min:1',
        ]);

        $harvest = Harvest::findOrFail($validated['harvest_id']);
        $standard = ProductQuantity::findOrFail($validated['quantity_standard_id']);

        if ($standard->product_id !== $harvest->product_id) {
            throw ValidationException::withMessages([
                'quantity_standard_id' => 'Quantity standard does not belong to this harvest\'s product.',
            ]);
        }

        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);

        $existing = $cart->items()
            ->where('harvest_id', $validated['harvest_id'])
            ->where('quantity_standard_id', $validated['quantity_standard_id'])
            ->first();

        if ($existing) {
            $existing->update([
                'quantity' => $existing->quantity + $validated['quantity'],
            ]);
        } else {
            $cart->items()->create([
                'harvest_id'         => $validated['harvest_id'],
                'quantity_standard_id' => $validated['quantity_standard_id'],
                'quantity'           => $validated['quantity'],
                'unit_price'         => $standard->price,
            ]);
        }

        return $cart->load('items.harvest.product', 'items.quantityStandard');
    }

    public function updateItem(Request $request, CartItem $item): Cart
    {
        if ($item->cart->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $item->update(['quantity' => $validated['quantity']]);

        return $item->cart->load('items.harvest.product', 'items.quantityStandard');
    }

    public function removeItem(Request $request, CartItem $item): Cart
    {
        if ($item->cart->user_id !== $request->user()->id) {
            abort(403);
        }

        $cart = $item->cart;
        $item->delete();

        return $cart->load('items.harvest.product', 'items.quantityStandard');
    }

    public function clearCart(Request $request): Cart
    {
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $cart->items()->delete();

        return $cart->load('items.harvest.product', 'items.quantityStandard');
    }
}
