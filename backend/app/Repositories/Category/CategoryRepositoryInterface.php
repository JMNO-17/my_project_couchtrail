<?php

namespace App\Repositories\Category;

interface CategoryRepositoryInterface
{
    public function index();
    public function store($category);
    public function edit($id);
}
