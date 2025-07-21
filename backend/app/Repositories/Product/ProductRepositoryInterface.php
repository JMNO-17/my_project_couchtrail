<?php

namespace App\Repositories\Product;

interface ProductRepositoryInterface
{
    public function index();
    public function store($product);
    public function edit($id);
    public function find($id);
}
