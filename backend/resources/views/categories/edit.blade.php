@extends('layouts.master')
@section('content')
<div class="container">
    <div class="mt-4 text-danger">
        @if ($errors->any())
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        @endif
    </div>
    <div class="card mt-4">
        <div class="card-header">
            Edit Category
        </div>
        <form action="{{ route('categories.update', $category->id) }}" method="POST">
            @csrf
            <div class="card-body">
                <input type="text" class="form-control" name="name" value="{{ $category->name }}" />
            </div>
            <div class="card-body">
                <img src="{{ asset('categoryImages/' . $category->image) }}" alt="{{ $category->image }}"
                    style="width: 50px; height: 50px;" />
            </div>
            <div class="card-footer">
                <button class="btn btn-primary me-2" type="submit">
                    Update
                </button>
                <a href="{{ route('categories.index') }}" class="btn btn-secondary">Back</a>
            </div>
        </form>
    </div>
</div>
@endsection
