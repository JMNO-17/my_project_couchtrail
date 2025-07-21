<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Article;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user_data = [
            [
               
                'name' => 'John',
                'email'=> 'john@gmail.com'
            ],
            [
               
               'name' => 'thiri',
               'email'=> 'thiri@gmail.com'
            ],
            [
                
                'name' => 'Hein',
                'email'=> 'hein@gmail.com'
            ],
            [

                'name' => 'Paing',
                'email'=> 'paing@gmail.com'
            ],
            [
                
                'name' => 'Moe',
                'email'=> 'moe@gmail.com'
            ],
        ];
        foreach ($user_data as $data) {
            Article::create($data);
        }
    }
}
