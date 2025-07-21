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
                + user Create
            </div>
            <form action="{{ route('users.store') }}" method="POST" enctype="multipart/form-data">
                @csrf

                <div class="card-body">
                    <label for="name" class="form-label">Name :</label>
                    <input type="text" name="name" placeholder="Enter Name" class="form-control mb-2">
                    <label for="email" class="form-label">email :</label>
                    <input type="text" name="email" placeholder="Enter Email" class="form-control mb-2">
                    <label for="phone" class="form-label">Phone:</label>
                    <input type="text" name="phone" placeholder="Enter Phone" class="form-control mb-2">


                    <label for="gender" class="form-label">Gender:</label>
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="gender" id="gender_male" value="Male">
                        <label class="form-check-label" for="gender_male">
                            Male
                        </label>
                    </div>
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="gender" id="gender_female" value="Female">
                        <label class="form-check-label" for="gender_female">
                            Female
                        </label>
                    </div>

                    <label for="address" class="form-label">Address:</label>
                    <input type="text" name="address" placeholder="Enter Address" class="form-control mb-2">

                    <label for="image" class="form-label">User Profile Image:</label>
                    <input type="file" class="form-control mb-2" name="image" id="image" />

                   <div class="card-body">
                    <label for="roles">Select Roles</label>
                    <select name="roles[]" id="" class="form-select select">
                        @foreach ($roles as $role)
                            <option value="{{ $role->id }}">{{ $role->name }}</option>
                        @endforeach
                    </select>
                </div>

                    <label for="password" class="form-label">Password:</label>
                    <input type="password" class="form-control mb-2" name="password" id="password"
                        placeholder="Enter Password" autocomplete="new-password" required>


                    {{-- <div class="form-check form-switch mb-3">
                        <input type="hidden" name="status" value="0">
                        <input class="form-check-input" type="checkbox" id="status" name="status" value="1">
                        <label class="form-check-label" for="status">Active</label>
                    </div> --}}


                    <div class="form-check form-switch mb-3">
                        <input type="hidden" name="status" value="0">
                        <input class="form-check-input" type="checkbox" id="status" name="status" value="1" checked>
                        <label class="form-check-label" for="status">Active</label>
                    </div>




                </div>



                <div class="card-footer">
                    <button class="btn btn-primary me-2" type="submit">
                        Create
                    </button>
                    <a href="{{ route('users.index') }}" class="btn btn-secondary">Back</a>
                </div>
            </form>
        </div>
    </div>
@endsection
