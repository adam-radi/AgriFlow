<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\CartItem;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request, CartService $service)
    {
        $cart = $service->getCart($request);

        return $this->success(new CartResource($cart));
    }

    public function store(Request $request, CartService $service)
    {
        $cart = $service->addItem($request);

        return $this->created(new CartResource($cart), 'Item added to cart');
    }

    public function update(Request $request, CartItem $item, CartService $service)
    {
        $cart = $service->updateItem($request, $item);

        return $this->success(new CartResource($cart), 'Cart updated');
    }

    public function destroy(Request $request, CartItem $item, CartService $service)
    {
        $cart = $service->removeItem($request, $item);

        return $this->success(new CartResource($cart), 'Item removed from cart');
    }

    public function clear(Request $request, CartService $service)
    {
        $cart = $service->clearCart($request);

        return $this->success(new CartResource($cart), 'Cart cleared');
    }
}
