<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use App\Services\User\UserService;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\UserUpdateRequest;
use App\Repositories\Role\RoleRepositoryInterface;
use App\Repositories\User\UserRepositoryInterface;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $userRepository;
    protected $roleRepository;
    protected $userService;

    public function __construct(UserRepositoryInterface $userRepository, UserService $userService)
    {
        $this->middleware('auth');
        $this->userRepository = $userRepository;
        $this->userService = $userService;
    }

    public function index()
    {
        $users = $this->userRepository->index();

        return view('users.index', compact('users'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::get();
        return view('users.create', compact('roles'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {

        $validatedData = $request->validated();

        // echo "<br/><br/>";
        // echo count($validatedData);

        $data = [
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'phone' => $validatedData['phone'],
            'gender' => $validatedData['gender'],
            'address' => $validatedData['address'],
        ];

        $user = $this->userRepository->store($data);
        // // User::create($data);


        $user->roles()->sync($validatedData['roles']);

        return redirect()->route('users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = $this->userRepository->show($id);

        $roles = $this->userRepository->create();

        return view('users.edit', compact('user', 'roles'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, string $id)
    {
        $validatedData = $request->validated();

        $data = [
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'phone' => $validatedData['phone'],
            'address' => $validatedData['address'],
            'gender' => $validatedData['gender'],

        ];

        $user = $this->userRepository->show($id);

        $user->update($data);

        $user->roles()->sync($validatedData["roles"]);

        return redirect()->route('users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(string $id)
    {
        $this->userRepository->delete($id);

        return redirect()->route('users.index');
    }

    public function status($id)
    {
        $this->userService->status($id);

        return redirect()->route('users.index');
    }
}
