@extends('layouts.master')
@section('content')
    <div class="container">
        <h1 class="mt-4">Role List</h1>
        {{-- @can('roleCreate') --}}
         <a href="{{ route('roles.create') }}" class="btn btn-outline-success mb-4">+Create</a>
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
                @foreach ($roles as $role)
                    <tr>
                        <td>{{ $role['id'] }}</td>
                        <td>{{ $role['name'] }}</td>
                        <td class="d-flex">

                             <a href="{{ route('roles.show', ['role' => $role->id]) }}"
                                class="btn btn-outline-primary me-2">Show</a>
                            {{-- @can('roleUpdate') --}}
                             <a href="{{ route('roles.edit', ['role' => $role->id]) }}"
                                class="btn btn-outline-warning me-2">Edit</a>
                            {{-- @endcan --}}
                            {{-- @can('roleDelete') --}}
                            <form action="{{ route('roles.destroy', ['role' => $role->id ])}}" method="POST">
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
