@extends('layouts.master')
@section('content')
    <div class="container">
        <h1 class="mt-4">User Details</h1>

        <a href="{{ route('users.create') }}" class="btn btn-outline-success mb-4">Create</a>
        <a href="{{ route('categories.index') }}" class="btn btn-outline-warning mb-4">Category List</a>
        <a href="{{ route('products.index') }}" class="btn btn-outline-warning mb-4">Product List</a>

        <table class="table table-bordered">
            <thead>
                <tr class="text-center">
                    <th class="bg-secondary text-white">ID</th>
                    <th class="bg-secondary text-white">NAME</th>
                    <th class="bg-secondary text-white">Email</th>
                    <th class="bg-secondary text-white">Image</th>
                    <th class="bg-secondary text-white">PHONE</th>
                    <th class="bg-secondary text-white">GENDER</th>
                    <th class="bg-secondary text-white">ADDRESS</th>
                    <th class="bg-secondary text-white">ROLE</th>
                    <th class="bg-secondary text-white">STATUS</th>
                    <th class="bg-secondary text-white">ACTION</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($users as $user)
                    <tr class="text-center">
                        <td>{{ $user['id'] }}</td>
                        <td>{{ $user['name'] }}</td>
                        <td>{{ $user['email'] }}</td>
                        <td><img src="{{ asset('userImages/' . $user['image']) }}" alt="{{ $user->image }}"
                                style="width: 50px; height: 50px; border-radius: 50%;"></td>

                        <td>{{ $user['phone'] }}</td>
                        <td>{{ $user['gender'] }}</td>
                        <td>{{ $user['address'] }}</td>

                        <td>
                            @foreach ($user->roles as $role)
                                <span class="badge badge-info">
                                    {{ $role->name }}
                                </span>
                            @endforeach
                        </td>


                        {{-- @if ($user->status == 1)
                            <td class="text-success">Active</td>
                        @else
                            <td class="text-danger">Suspend</td>
                        @endif --}}

                        <td>
                            <form action="{{ route('users.status', ['id' => $user->id]) }}" method="POST">
                                @csrf
                                <button class="btn btn-sm {{ $user->status === 1 ? 'btn-success' : 'btn-danger' }}"
                                    type="submit">
                                    {{ $user->status === 1 ? 'Active' : 'Inactive' }}
                                </button>
                            </form>
                        </td>

                        <td class="d-flex">
                            <a href="{{ route('users.show', ['id' => $user->id]) }}"
                                class="btn btn-outline-primary me-2">Show</a>
                            <a href="{{ route('users.edit', ['id' => $user->id]) }}"
                                class="btn btn-outline-warning me-2">Edit</a>

                            <form action="{{ route('users.delete', $user->id) }}" method="POST">
                                @csrf
                                
                                <button class="btn btn-outline-danger">Delete</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

    </div>
@endsection
