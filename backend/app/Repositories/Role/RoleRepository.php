<?php
namespace App\Repositories\Role;

use App\Repositories\Role\RoleRepositoryInterface;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleRepository implements RoleRepositoryInterface
{

    public function index() {
        return Role::all();
    }

    public function create() {
        return Permission::all();
    }

    public function show($id) {
        $role = Role::with('permissions')->find($id);
        return $role;
    }

    public function store($data) {
        return Role::create($data);
    }

    public function edit($id) {
        return Role::find($id);
    }
}
