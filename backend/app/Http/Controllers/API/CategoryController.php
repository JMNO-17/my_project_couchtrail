<?php

namespace App\Http\Controllers\API;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;
use App\Repositories\Category\CategoryRepositoryInterface;

class CategoryController extends BaseController
{
    /**
     * Display a listing of the resource.
     */

    protected $categoryRepository;
    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
        $this->middleware('permission:categoryList', ['only' => ['index']]);
        $this->middleware('permission:categoryCreate', ['only' => ['store']]);
        $this->middleware('permission:categoryUpdate', ['only' => ['update']]);
    }
    public function index()
    {
        // dd('here');
        // $categories = Category::get();
        $categories = $this->categoryRepository->index();

        $data = CategoryResource::collection($categories);

        return $this->success($data,"Categories Retrieved Successfully",200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required|string',
            'image' => 'required',
        ]);

        if ($validation->fails()) {
            $this->error( 'Validation Error', $validation->errors(), 422);
        }

        if($request->hasFile('image')) {
            $imageName = time() . $request->image->extension();

            $request->image->move(public_path('categoryImages'), $imageName);
        }
        // $category = Category::create([

        //     'name' => $request->name,
        //     'image' => $imageName,

        // ]);
        $category = $this->categoryRepository->store([
            'name' => $request->name,
            'image' => $imageName,
        ]);


        return $this->success($category, "Category Created Successfully", 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // $category = Category::find($id);
        $category = $this->categoryRepository->edit($id);

        $data = new CategoryResource($category);

        return $this->success($data,"Category Show successfully", 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $validation = Validator::make($request->all(),[
            'name' => 'required|string'
        ]);

        if($validation->fails()){
            $this->error("Validation Error",$validation->errors(), 422);
        }

        // $category = Category::find($id);

        $category = $this->categoryRepository->edit($id);

        $category->update($request->all());

        return $this->success($category,"Category Updated Successfully",200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // $category = Category::find($id);
        $category = $this->categoryRepository->edit($id);

        $category->delete();

        return $this->success(null, "Category delete successfully", 200);
    }
}
