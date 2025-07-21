<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'category_id' => 1,
                'name' => 'Laptop',
                'description' => 'Latest model laptop',
                'price' => 1000,
                // 'status' => false,
            ],
            [
                'category_id' => 2,
                'name' => 'Smartphone',
                'description' => 'Latest model smartphone',
                'price' => 800,
                // 'status' => false,
            ],
            [
                'category_id' => 3,
                'name' => 'Headphones',
                'description' => 'Latest model headphones',
                'price' => 200,
                // 'status' => false,
            ],
            [
                'category_id' => 4,
                'name' => 'Smartwatch',
                'description' => 'Latest model smartwatch',
                'price' => 400,
                // 'status' => false,
            ],
            [
                'category_id' => 5,
                'name' => 'Tablet',
                'description' => 'Latest model tablet',
                'price' => 600,
                // 'status' => false,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }


    }
}
