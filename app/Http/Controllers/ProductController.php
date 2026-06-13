<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\ProductServices;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\Request;

class ProductController
{
    public function index(Request $request, ProductServices $productServices){
        return $productServices->fetchFarmerProduct($request);
    }

    public function store(StoreProductRequest $request, ProductServices $productServices){
        return $productServices->createProduct($request);
    }

    public function show(Request $request, Product $product, ProductServices $productServices){
        return $productServices->showProduct($request, $product);
    }

    public function update(UpdateProductRequest $request, Product $product, ProductServices $productServices){
        return $productServices->updateProduct($request, $product);
    }

    public function destroy(Request $request, Product $product, ProductServices $productServices){
        return $productServices->deleteProduct($request, $product);
    }

    public function manageQuantity(Request $request, Product $product, ProductServices $productServices){
        return $productServices->manageQuantity($request, $product);
    }
}
