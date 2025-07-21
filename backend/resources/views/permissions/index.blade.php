@extends('layouts.master')
@section('content')
    <div class="container">
        <h1 class="mt-4">permission List</h1>
        {{-- @can('permissionCreate') --}}
         <a href="{{ route('permissions.create') }}" class="btn btn-outline-success mb-4">+Create</a>
        {{-- @endcan --}}

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th class="bg-secondary text-white">ID</th>
                    <th class="bg-secondary text-white">NAME</th>
                    <th class="bg-secondary text-white">ACTION</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($permissions as $permission)
                    <tr>
                        <td>{{ $permission['id'] }}</td>
                        <td>{{ $permission['name'] }}</td>
                        <td class="d-flex">
{{--
                             <a href="{{ route('permissions.show', ['permission' => $permission->id]) }}"
                                class="btn btn-outline-primary me-2">Show</a> --}}
                            {{-- @can('permissionUpdate') --}}
                             <a href="{{ route('permissions.edit', ['permission' => $permission->id]) }}"
                                class="btn btn-outline-warning me-2">Edit</a>
                            {{-- @endcan --}}
                            {{-- @can('permissionDelete') --}}
                            <form action="{{ route('permissions.destroy', ['permission' => $permission->id ])}}" method="POST">
                                @csrf
                                  {{ method_field('DELETE') }}
                                <button class="btn btn-outline-danger">Delete</button>
                            </form>
                            {{-- @endcan --}}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
