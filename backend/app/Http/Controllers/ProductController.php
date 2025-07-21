<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Repositories\Product\ProductRepository;
use App\Http\Requests\EditUpdateRequest;
use App\Repositories\Category\CategoryRepositoryInterface;

class ProductController extends Controller
{
    protected $productRepository;
    protected $categoryRepository;

    public function __construct(ProductRepository $productRepository, CategoryRepositoryInterface $categoryRepository)
{
    $this->productRepository = $productRepository;
    $this->categoryRepository = $categoryRepository;
    $this->middleware('auth');
}


    public function index()
    {
        $products = $this->productRepository->index();

        return view('products.index', compact('products'));
    }

    public function show($id)
    {
        $product = Product::find($id);
        return view("products.show", compact('product'));

    }


    public function create()
    {
        $categories = $this->categoryRepository->index();
        return view("products.create", compact("categories"));
    }

    public function store(Request $request)
    {
        $product = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|integer',
            'image' => 'required',
            'category_id' => 'required',
            'status' => 'required',

        ]);

        if($request->hasFIle("image")){

        //    dd($request->image);
        // $productImages = $request->image->filename . ".jpg";
        $productImages  = time() . '.jpg';
        $request->image->move(public_path('productImages'),$productImages);

        $product = array_merge($product,['image'=>$productImages]);
        // $product['image'] = $productImages;

        }

        // Product::create($product);
        $this->productRepository->store($product);

        return redirect()->route('products.index');
    }

    public function edit($id)
    {
    //    $product = Product::find($id);
    //    $categories = Category::all();
    $categories = $this->categoryRepository->index();
    $product = $this->productRepository->find($id);
    return view("products.edit", compact('product', 'categories'));

    }


    public function update(EditUpdateRequest $request){

    //    $product = Product::find($request->id);
        $product = $this->productRepository->edit($request->id);

       $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'category_id' => $request->category_id,
            "status" => $request->status ? 1 : 0,

        ]);




        return redirect()->route('products.index');
    }


    public function delete($id)
    {
        // $product = Product::find($id);
         $product = $this->productRepository->edit($id);

        $product->delete();

        return redirect()->route('products.index');
    }

   
}
