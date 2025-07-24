<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // $admin = User::create([
        //     'name' => 'Admin',
        //     'email' => 'admin@example.com',
        //     'password' => bcrypt('password123'),
        // ])->assignRole('admin');

        // $admin->assignRole('admin');


        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),
        ]);
        $admin->assignRole('admin');

        // $user = User::create([
        //     'name' => 'Test User',
        //     'email' => 'user@example.com',
        //     'password' => bcrypt('password123'),
        // ]);
        // $user->assignRole('client');
    }
}
