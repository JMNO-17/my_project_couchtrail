<?php

namespace App\Repositories\Role;

interface RoleRepositoryInterface
{
    public function index();

    public function create();

    public function store($data);

    public function edit($id);



}
