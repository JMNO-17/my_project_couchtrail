@extends('layouts.master')
@section('content')
<div class="container">
    {{-- {{ dd($errors) }} --}}
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
            + Create
        </div>
        <form action="{{ route('categories.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="card-body">
                <input type="text" class="form-control" placeholder="Enter Category Name" name="name" />
            </div>
            <div class="card-body">
                <input type="file" class="form-control" name="image" />
            </div>
            <div class="card-footer">
                <button class="btn btn-primary me-2" type="submit">
                    Create
                </button>
                <a href="{{ route('categories.index') }}" class="btn btn-secondary">Back</a>
            </div>
        </form>
    </div>
</div>
@endsection
