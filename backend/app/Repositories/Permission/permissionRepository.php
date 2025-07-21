<?php

namespace App\Repositories\Permission;

use Spatie\Permission\Models\Permission;
use App\Repositories\Permission\permissionRepositoryInterface;

class permissionRepository implements permissionRepositoryInterface {
    public function index() {
        return Permission::all();
    }
    public function edit($id) {
        return Permission::find($id);
    }
    public function store($data) {

        return Permission::create($data);
    }
}
