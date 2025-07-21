<?php

namespace App\Repositories\User;

interface UserRepositoryInterface
{
    public function index();

    public function store($validatedData);

    public function show($id);

    public function create();

    public function update($validatedData, $id);

    public function delete($id);

}
