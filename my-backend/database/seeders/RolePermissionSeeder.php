<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Role::findByName('admin');
        $client = Role::findByName('client');

        // $permissions = Permission::all();

        // $admin->syncPermissions($permissions);
        // $client->syncPermissions(['view_profile', 'edit_profile', 'host_travelers', 'book_travel']);

        $admin->syncPermissions(['admin_panel']);
        $client->syncPermissions(['view_profile', 'edit_profile', 'host_travelers', 'book_travel']);
    }
}
