<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Requests\CategoryUpdateRequest;
use App\Repositories\Category\CategoryRepository;


class CategoryController extends Controller
{
    protected $categoryRepository;
    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
        $this->middleware('auth');
    }
    public function index()
    {

        // $categories = Category::all();

        $categories = $this->categoryRepository->index();

        return view('categories.index', compact('categories'));

    }

    public function show($id)
    {

        // dd('here');
        // dd($id);
        $category = Category::find($id);
        // dd($category);
        return view('categories.show', compact('category'));
    }

    public function create()
    {
        return view('categories.create');
    }

    public function store(Request $request)
    {
        $category = $request->validate([
            'name' => 'required|string',
            'image'=> 'required',

        ]);
        if($request->hasFile('image')){
            $imageName = time() . '.' . $request->image->extension();

            // dd($imageName);

            $request->image->move(public_path('categoryImages'),$imageName);

            $category = array_merge($category,['image' => $imageName]);
        }
        // Category::create($category);
        $this->categoryRepository->store($category);

        return redirect()->route('categories.index');
    }

    public function edit($id)
    {
        // $category = Category::find($id);
        $category = $this->categoryRepository->edit($id);

        return view('categories.edit', compact('category'));
    }

    public function update(CategoryUpdateRequest $request)
    {
        // $category = Category::find($request->id);
        $category = $this->categoryRepository->edit($request->id);

        $category->update([
            'name' => $request->name,
        ]);

        return redirect()->route('categories.index');
    }


    public function delete($id)
    {
        // $category = Category::find($id);
        $category = $this->categoryRepository->edit($id);

        $category->delete();

        return redirect()->route('categories.index');
    }

    public function categoriesCount()
    {
        $categories = Category::all();

        // dd($categories);
        $totalCategories = count($categories);
        // dd($totalCategories);
        return view('index', compact('totalCategories'));
    }





}
