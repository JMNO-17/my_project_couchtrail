<?php

namespace App\Repositories\Product;
use App\Models\Product;
use App\Models\Category;

use App\Repositories\Product\ProductRepositoryInterface;



class ProductRepository implements ProductRepositoryInterface
{

    public function index()
    {
        $products = Product::with('category')->where('status', 1)->get();

        return $products;
    }

    public function store($product) {
        return Product::create($product);
    }

    public function edit($id) {
        $product = Product::find($id);
        return $product;
    }

    public function find($id) {
        return Product::find($id);
    }

}
