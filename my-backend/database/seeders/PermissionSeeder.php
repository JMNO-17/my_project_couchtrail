<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        Permission::firstOrCreate(['name' => 'view_profile']);
        Permission::firstOrCreate(['name' => 'edit_profile']);
        Permission::firstOrCreate(['name' => 'host_travelers']);
        Permission::firstOrCreate(['name' => 'book_travel']);
    }
}
