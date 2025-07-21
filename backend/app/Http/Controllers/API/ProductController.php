<?php

namespace App\Http\Controllers\API;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;
use App\Repositories\Product\ProductRepositoryInterface;
use App\Repositories\Category\CategoryRepositoryInterface;

class ProductController extends BaseController
{
    /**
     * Display a listing of the resource.
     */

    protected $productRepository;
    protected $categoryRepository;
    public function __construct(ProductRepositoryInterface $productRepository,CategoryRepositoryInterface $categoryRepository)
    {
        $this->productRepository = $productRepository;
        $this->categoryRepository = $categoryRepository;
        $this->middleware('permission:productList', ['only' => ['index']]);
        $this->middleware('permission:productCreate', ['only' => ['store']]);
        $this->middleware('permission:productUpdate', ['only' => ['update']]);
    }

    public function index()
    {
        // dd('here');
        // $products = Product::get();
        $products = $this->productRepository->index();

        $data = ProductResource::collection($products);

        return $this->success($data, "Products Retrieved Successfully", 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [

            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|integer',
            'image' => 'required',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required',

        ]);

        if ($validation->fails()) {
            $this->error( 'Validation Error', $validation->errors(), 422);
        }

        if($request->hasFile('image')) {
            $imageName = time() . $request->image->extension();

            $request->image->move(public_path('productImages'), $imageName);
        }
        // $product = Product::create([

        //     'name' => $request->name,
        //     'description' => $request->description,
        //     'price'=> $request->price,
        //     'image' => $imageName,

        // ]);
        $product = $this->productRepository->store([
            'name' => $request->name,
            'description' => $request->description,
            'price'=> $request->price,
            'image' => $imageName,
            'category_id' => $request->category_id,
            'status' => $request->status ? 1 : 0,
        ]);



        return $this->success($product, "Product Created Successfully", 200);


    }

//     /**
//      * Display the specified resource.
//      */
    public function show(string $id)
    {
        // $product = Product::find($id);
        $product = $this->productRepository->edit($id);

        $data = new ProductResource($product);

        return $this->success($data,"Product Show successfully", 200);
    }

//     /**
//      * Update the specified resource in storage.
//      */
    public function update(Request $request, string $id)
    {
        $validation = Validator::make($request->all(),[
            'name' => 'required|string',
            'description' => 'required',
            'price' => 'required'
        ]);

        if($validation->fails()){
            $this->error("Validation Error",$validation->errors(), 422);
        }

        // $product = Product::find($id);

        $product = $this->productRepository->edit($id);

        $product->update($request->all());

        return $this->success($product,"Product Updated Successfully",200);
    }

//     /**
//      * Remove the specified resource from storage.
//      */
    public function destroy(string $id)
    {
        //  $product = Product::find($id);
        $product= $this->productRepository->edit($id);

        $product->delete();

        return $this->success(null, "Product delete successfully", 200);
    }
}
