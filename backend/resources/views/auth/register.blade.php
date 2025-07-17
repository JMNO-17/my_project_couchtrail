@extends('layouts.app')

@section('content')
<div class="container" style="max-width: 400px;">
    <h2 class="mb-4">Register</h2>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('register') }}">
        @csrf

        <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input id="name" type="text" class="form-control" name="name" required value="{{ old('name') }}">
        </div>

        <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input id="email" type="email" class="form-control" name="email" required value="{{ old('email') }}">
        </div>

        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input id="password" type="password" class="form-control" name="password" required>
        </div>

        <div class="mb-3">
            <label for="password_confirmation" class="form-label">Confirm Password</label>
            <input id="password_confirmation" type="password" class="form-control" name="password_confirmation" required>
        </div>

        <button type="submit" class="btn btn-primary w-100">Register</button>
    </form>

    <p class="mt-3 text-center">
        Already have an account? <a href="{{ route('login') }}">Login here</a>.
    </p>
</div>
@endsection
