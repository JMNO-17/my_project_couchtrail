@extends('layouts.master')
@section('content')
    <div class="container">
        <h1 class="mt-4">Product List</h1>

        <a href="{{ route('products.create') }}" class="btn btn-outline-success mb-4">Create</a>
        <a href="{{ route('categories.index') }}" class="btn btn-outline-warning mb-4">Category List</a>

        <!-- @foreach ($products as $product)
    <p>{{ $product->id }} : {{ $product->name }} : {{ $product->description }} : ${{ $product->price }}</p>
                                        <a href="{{ route('products.show', ['id' => $product->id]) }}">Show</a>
                                        <a href="{{ route('products.edit', ['id' => $product->id]) }}">Edit</a>

                                        <form action="{{ route('products.delete', $product->id) }}" method="POST">
                                            @csrf
                                            <button>Delete</button>
                                        </form>
    @endforeach -->

        <table class="table table-bordered">
            <thead>
                <tr class="text-center">
                    <th class="bg-secondary text-white">ID</th>
                    <th class="bg-secondary text-white">NAME</th>
                    <th class="bg-secondary text-white">Description</th>
                    <th class="bg-secondary text-white">Image</th>
                    <th class="bg-secondary text-white">Price</th>
                    <th class="bg-secondary text-white">CATEGORY</th>
                    <th class="bg-secondary text-white">STATUS</th>
                    <th class="bg-secondary text-white">ACTION</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($products as $product)
                    <tr class="text-center">
                        <td>{{ $product['id'] }}</td>
                        <td>{{ $product['name'] }}</td>
                        <td>{{ $product['description'] }}</td>
                        <td><img src="{{ asset('productImages/' . $product['image']) }}" alt="{{ $product->image }}"
                                style="width: 50px; height: 50px; border-radius: 50%;"></td>
                        {{-- <td><img src="{{asset("categoryImages/")}}" alt=""></td> --}}
                        <td>{{ $product['price'] }}</td>
                        {{-- <td>{{ $product['category']['name'] }}</td> --}}
                        <td>{{ $product->category ? $product->category->name : 'No Category' }}</td>

                        <td class="{{ $product->status == 1 ? 'text-success' : 'text-danger' }}">
                            {{ $product->status == 1 ? 'Active' : 'Suspend' }}
                        </td>

                        <td class="d-flex">
                            <div>
                                <a href="{{ route('products.show', ['id' => $product->id]) }}"
                                    class="btn btn-outline-primary me-2">Show</a>
                                <a href="{{ route('products.edit', ['id' => $product->id]) }}"
                                    class="btn btn-outline-warning me-2">Edit</a>

                            </div>

                            <form action="{{ route('products.delete', $product->id) }}" method="POST">
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
