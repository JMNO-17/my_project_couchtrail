<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\PermissionRequest;
use App\Http\Requests\PermissionUpdateRequest;
use App\Repositories\Permission\permissionRepositoryInterface;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    protected $permissionRepository;
    public function __construct(permissionRepositoryInterface $permissionRepository)
    {
        $this->permissionRepository = $permissionRepository;


    }
    public function index()
    {
        $permissions = $this->permissionRepository->index();

        return view('permissions.index',compact('permissions'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('permissions.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PermissionRequest $request)
    {
        $validated = $request->validated();

        $data = [
            'name' => $validated['name'],
        ];

        $this->permissionRepository->store($data);

        return redirect()->route('permissions.index');
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
        $permission = $this->permissionRepository->edit($id);
        return view('permissions.edit',compact('permission'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PermissionUpdateRequest $request, string $id)

    {
        $validated = $request->validated();

        $data = [
            'name' => $validated['name'],
        ];


        $permission = $this->permissionRepository->edit($id);

        $permission->update($data);

        return redirect()->route('permissions.index');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $permission = $this->permissionRepository->edit($id);

        $permission->delete();

         return redirect()->route('permissions.index');


    }
}
