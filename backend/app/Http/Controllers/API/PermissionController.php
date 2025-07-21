<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\PermissionRequest;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\PermissionResource;
use App\Http\Controllers\API\BaseController;
use App\Http\Requests\PermissionUpdateRequest;
use App\Repositories\Permission\permissionRepositoryInterface;


class PermissionController extends BaseController
{
    protected $permissionRepository;

    public function __construct(permissionRepositoryInterface $permissionRepository)
    {
        $this->permissionRepository = $permissionRepository;

        $this->middleware('permission:permissionList', ['only' => ['index']]);
        $this->middleware('permission:permissionCreate', ['only' => ['store']]);
        $this->middleware('permission:permissionUpdate', ['only' => ['update']]);
        $this->middleware('permission:permissionDelete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the permissions.
     */
    public function index()
    {

        $permissions = $this->permissionRepository->index();

        $data = PermissionResource::collection($permissions);

        return $this->success($data, "Permissions retrieved successfully", 200);
    }

    /**
     * Store a newly created permission.
     */
    public function store(PermissionRequest $request)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required',

        ]);

        if ($validation->fails()) {
            $this->error( 'Validation Error', $validation->errors(), 422);
        }

       $permission= $this->permissionRepository->store([
            'name' => $request->name,

        ]);

        return $this->success(new PermissionResource($permission), "Permission created successfully", 200);
    }

    /**
     * Display the specified permission.
     */
    public function show(string $id)
    {
        // $permission = $this->permissionRepository->edit($id);

        // $data = new PermissionResource($permission);

        // return $this->success($data,"Permission Show successfully", 200);
    }

    /**
     * Update the specified permission.
     */
    public function update(PermissionUpdateRequest $request, string $id)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required',

        ]);

        if ($validation->fails()) {
            $this->error( 'Validation Error', $validation->errors(), 422);
        }

        $permission = $this->permissionRepository->edit($id);

        $permission->update($request->all());

        return $this->success($permission,"Permission Updated Successfully",200);
    }

    /**
     * Remove the specified permission.
     */
    public function destroy(string $id)
    {
        $permission = $this->permissionRepository->edit($id);
        $permission->delete();

        return $this->success(null, "Permission deleted successfully", 200);
    }
}
