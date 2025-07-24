<?php

namespace App\Repositories\Permission;

interface permissionRepositoryInterface
{
    public function index();
    public function edit($id);
    public function store($data);
}
