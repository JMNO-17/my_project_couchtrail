<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::all();
        return view("articles.index", ["articles" => $articles]);
    }

    public function show($id)
    {
        $article = article::find($id);
        return view("articles.show", compact('article'));
    }
}
