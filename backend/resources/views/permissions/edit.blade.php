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

            <form action="{{ route('permissions.update', ['permission' => $permission->id]) }}" method="POST" enctype="multipart/form-data">

                {{method_field('PUT')}}
                @csrf

                <div class="card-body">
                    <label for="name" class="form-label">Name :</label>
                    <input type="text" name="name" placeholder="Enter Name" class="form-control mb-2" value="{{$permission->name}}">
                </div>





                <div class="card-footer">
                    <button class="btn btn-primary me-2" type="submit">
                        Create
                    </button>
                    <a href="{{ route('permissions.index') }}" class="btn btn-secondary">Back</a>
                </div>
            </form>
        </div>
    </div>
@endsection
