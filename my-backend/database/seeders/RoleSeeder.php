<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */


    public function run()
    {
        // Role::create(['name' => 'admin']);
        // Role::create(['name' => 'user']);

        // $admin = Role::create(['name' => 'admin']);
        // $client = Role::create(['name' => 'client']);



Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'api']);
Role::firstOrCreate(['name' => 'client', 'guard_name' => 'api']);
Role::firstOrCreate(['name' => 'host', 'guard_name' => 'api']);
Role::firstOrCreate(['name' => 'traveler', 'guard_name' => 'api']);

    }
}
