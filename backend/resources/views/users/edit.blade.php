@extends('layouts.master')
@section('content')

{{-- {{print_r($user->roles)}} --}}


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
            <div class="card-header bg-secondary text-white">
                user Edit
            </div>
            <form action="{{ route('users.update', $user->id) }}" method="POST" enctype="multipart/form-data">

                @csrf

                <div class="card-body">
                    <input type="text" class="form-control mb-2" name="name" value="{{ $user->name }}" />
                    <input type="text" class="form-control mb-2" name="email" value="{{ $user->email }}" />


                    <input type="text" class="form-control mb-2" name="phone" value="{{ $user->phone }}" />

                    <div class="mb-2">
                        <label class="form-label me-2">Gender:</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="gender" id="gender_male" value="Male"
                                {{ $user->gender == 'Male' ? 'checked' : '' }}>
                            <label class="form-check-label" for="gender_male">Male</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="gender" id="gender_female" value="Female"
                                {{ $user->gender == 'Female' ? 'checked' : '' }}>
                            <label class="form-check-label" for="gender_female">Female</label>
                        </div>
                    </div>
                    <label for="address" class="form-label">Address:</label>
                    <input type="text" class="form-control mb-2" name="address" value="{{ $user->address }}" />

                <div class="card-body">
                    <label for="roles">Select Roles</label>
                    <select name="roles" id="" class="form-select select">
                        @foreach ($roles as $role)
                        <option value="{{$role->id}}" @foreach ($user->roles as $userRole)
                            {{$userRole->id === $role->id ? 'selected' : '' }}
                        @endforeach>{{$role->name}}</option>
                        @endforeach
                    </select>
                </div>

                    <label for="image" class="form-label">User Profile Image:</label>
                    <input type="file" class="form-control mb-2" name="image" id="image" />

                    <div class="form-check form-switch mb-3">
                        <input type="hidden" name="status" value="0">
                        <input class="form-check-input" type="checkbox" id="status" name="status" value="1" checked>
                        <label class="form-check-label" for="status">Active</label>
                    </div>

                </div>

                <div class="card-footer">
                    <button class="btn btn-primary me-2" type="submit">
                        Update
                    </button>
                    <a href="{{ route('users.index') }}" class="btn btn-secondary">Back</a>
                </div>
            </form>
        </div>
    </div>

@endsection
