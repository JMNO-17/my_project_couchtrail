@extends('layouts.master')
@section('content')

    <div class="container">

        <div class="card mt-4">
            <div class="card-header bg-secondary text-center text-white">
                <h1>Category Show</h1>
            </div>
            <div class="card-body">
                <p>{{ $category['id'] }}</p>
                <p>{{ $category['name'] }}</p>
                <img src="{{ asset('categoryImages/' . $category->image) }}" alt="{{ $category->image }}"
                    style="width: 50px; height: 50px;" />
            </div>
            <div class="card-footer">
                <a href="{{ route('categories.index') }}" class="btn btn-secondary">Back</a>
            </div>

        </div>
    </div>

@endsection
