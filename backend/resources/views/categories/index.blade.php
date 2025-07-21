@extends('layouts.master')
@section('content')
    <div class="container">
        <h1 class="mt-4">Category List</h1>
        @can('categoryCreate')
         <a href="{{ route('categories.create') }}" class="btn btn-outline-success mb-4">+Create</a>
        @endcan

        <a href="{{ route('products.index') }}" class="btn btn-outline-warning mb-4">Product List</a>
        <!-- @foreach ($categories as $category)
    <p>{{ $category['id'] }} : {{ $category['name'] }}</p>
                <a href="{{ route('categories.show', ['id' => $category->id]) }}">Show</a>
                <a href="{{ route('categories.edit', ['id' => $category->id]) }}">Edit</a>

                <form action="{{ route('categories.delete', $category->id) }}" method="POST">
                    @csrf
                     <button>Delete</button>
                </form>
    @endforeach -->

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th class="bg-secondary text-white">ID</th>
                    <th class="bg-secondary text-white">NAME</th>
                    <th class="bg-secondary text-white">IMAGE</th>
                    <th class="bg-secondary text-white">ACTION</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($categories as $category)
                    <tr>
                        <td>{{ $category['id'] }}</td>
                        <td>{{ $category['name'] }}</td>
                        <td>
                            <img src="{{ asset('categoryImages/' . $category->image) }}" alt="{{ $category->image }}"
                                style="width: 50px; height: 50px;" />
                        </td>
                        <td class="d-flex">
                            
                            <a href="{{ route('categories.show', ['id' => $category->id]) }}"
                                class="btn btn-outline-primary me-2">Show</a>
                            @can('categoryUpdate')
                            <a href="{{ route('categories.edit', ['id' => $category->id]) }}"
                                class="btn btn-outline-warning me-2">Edit</a>
                            @endcan
                            @can('categoryDelete')
                            <form action="{{ route('categories.delete', $category->id) }}" method="POST">
                                @csrf
                                <button class="btn btn-outline-danger">Delete</button>
                            </form>
                            @endcan
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
