<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {

        $admin = User::create([
            'name' => 'Bob',
            'email' => 'bob@gmail.com',
            'address' => 'Yangon',
            'phone' => '09199999999',
            'gender' => 'Male',
            'status' => 1,
            'password' => Hash::make('admin'),
        ]);

        $client = User::create([

            'name' => 'Mya Mya',
            'email' => 'mya@gmail.com',
            'address' => 'Yangon',
            'phone' => '09199999999',
            'gender' => 'Male',
            'status' => 1,
            'password' => Hash::make('user'),

        ]);


        $admin->assignRole('admin');
        $client->assignRole('client');
    }
}
