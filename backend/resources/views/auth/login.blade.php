@extends('layouts.app')

@section('content')
<div class="container" style="max-width: 400px;">
    <h2 class="mb-4">Login</h2>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('login') }}">
        @csrf

        <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input id="email" type="email" class="form-control" name="email" required autofocus value="{{ old('email') }}">
        </div>

        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input id="password" type="password" class="form-control" name="password" required>
        </div>

        <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>

    <p class="mt-3 text-center">
        Don't have an account? <a href="{{ route('register') }}">Register here</a>.
    </p>
</div>
@endsection
