<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use App\Services\User\UserService;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\BaseController;
use App\Repositories\User\UserRepositoryInterface;

class UserController extends BaseController
{
    protected $userRepository;
    protected $userService;

    public function __construct(UserRepositoryInterface $userRepository,UserService $userService)
    {
        $this->userRepository = $userRepository;
        $this->userService = $userService;

        $this->middleware('permission:userList', ['only' => ['index']]);
        $this->middleware('permission:userCreate', ['only' => ['store']]);
        $this->middleware('permission:userUpdate', ['only' => ['update']]);
        $this->middleware('permission:userDelete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = $this->userRepository->index();

        $data = UserResource::collection($users);

        return $this->success($data, "Users Retrieved Successfully", 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
        ]);

        if ($validation->fails()) {
            return $this->error('Validation Error', $validation->errors(), 422);
        }

        $user = $this->userRepository->store([
            'name' => $request->name,
            'email' => $request->email,
            'password' =>$request->password,

        ]);


        return $this->success($user, "User Created Successfully", 200);
    }

    /**
     * Display the specified resource.
     */
    // public function show(string $id)
    // {
    //     $user = $this->userRepository->edit($id);

    //     $data = new UserResource($user);

    //     return $this->success($data,"User Show successfully", 200);
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required',
            'password' => 'required',
        ]);

        if ($validation->fails()) {
            return $this->error("Validation Error", $validation->errors(), 422);
        }

        $user = $this->userRepository->show($id);
        $user->update($request->all());

        return $this->success($user,"User Updated Successfully",200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = $this->userRepository->show($id);

        $user->delete();

        return $this->success(null, "User delete successfully", 200);
    }
}
