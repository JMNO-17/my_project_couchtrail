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
            <div class="card-header bg-secondary text-white">
                + role Create
            </div>
            <form action="{{ route('roles.store') }}" method="POST" enctype="multipart/form-data">
                @csrf

                <div class="card-body">
                    <label for="name" class="form-label">Name :</label>
                    <input type="text" name="name" placeholder="Enter Name" class="form-control mb-2">
                </div>

                <div class="card-body">
                    <label for="" class="d-block mb-5">Choose Permissions</label>
                    @foreach ($permissions as $permission)
                        <div class="input-group mb-3">
                            <label for="">{{ $permission->name }}</label>
                            <input type="checkbox" name="permissions[]" value="{{ $permission->id }}" class="ms-3"/>
                        </div>
                    @endforeach
                </div>



                <div class="card-footer">
                    <button class="btn btn-primary me-2" type="submit">
                        Create
                    </button>
                    <a href="{{ route('roles.index') }}" class="btn btn-secondary">Back</a>
                </div>
            </form>
        </div>
    </div>
@endsection
