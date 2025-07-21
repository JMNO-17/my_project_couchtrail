<?php

namespace App\Repositories\User;

use App\Models\User;
use App\Repositories\User\UserRepositoryInterface;
use Spatie\Permission\Models\Role;

class UserRepository implements UserRepositoryInterface
{
    public function index()
    {
        $users = User::with('roles')->get();
        // dd($users);
        return $users;
    }

    public function store($validatedData)
    {
        return User::create($validatedData);
    }

    public function create() {
        return Role::all();
    }

    public function show($id)
    {
        return User::where('id', $id)->first();
    }

    

    public function update($validatedData, $id)
    {
        $user = User::where('id', $id)->first();

        return $user->update($validatedData);
    }

    public function delete($id)
    {
        $user = User::find($id);

        return $user->delete();
    }

}
