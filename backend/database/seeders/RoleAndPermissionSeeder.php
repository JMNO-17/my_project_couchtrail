<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = Role::create(['name' => 'admin']);
        $client = Role::create(['name' => 'client']);

        $categoryList = Permission::create(['name' => 'categoryList']);
        $categoryCreate = Permission::create(['name' => 'categoryCreate']);
        $categoryUpdate = Permission::create(['name' => 'categoryUpdate']);
        $categoryDelete = Permission::create(['name' => 'categoryDelete']);

        $productList = Permission::create(['name' => 'productList']);
        $productCreate = Permission::create(['name' => 'productCreate']);
        $productUpdate = Permission::create(['name' => 'productUpdate']);
        $productDelete = Permission::create(['name' => 'productDelete']);

        $userList = Permission::create(['name' => 'userList']);
        $userCreate = Permission::create(['name' => 'userCreate']);
        $userUpdate = Permission::create(['name' => 'userUpdate']);
        $userDelete = Permission::create(['name' => 'userDelete']);

        $roleList = Permission::create(['name' => 'roleList']);
        $roleCreate = Permission::create(['name' => 'roleCreate']);
        $roleUpdate = Permission::create(['name' => 'roleUpdate']);
        $roleDelete = Permission::create(['name' => 'roleDelete']);

        $permissionList = Permission::create(['name' => 'permissionList']);
        $permissionCreate = Permission::create(['name' => 'permissionCreate']);
        $permissionUpdate = Permission::create(['name' => 'permissionUpdate']);
        $permissionDelete = Permission::create(['name' => 'permissionDelete']);

        $admin->givePermissionTo([
            $categoryList,
            $categoryCreate,
            $categoryUpdate,
            $categoryDelete,
            $productList,
            $productCreate,
            $productUpdate,
            $productDelete,
            $userList,
            $userCreate,
            $userUpdate,
            $userDelete,
            $roleList,
            $roleCreate,
            $roleUpdate,
            $roleDelete,
            $permissionList,
            $permissionCreate,
            $permissionUpdate,
            $permissionDelete,

        ]);
        $client->givePermissionTo([
            $categoryList,
            $productList,

        ]);
    }
}
