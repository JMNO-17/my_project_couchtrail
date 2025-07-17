@extends('layouts.app')

@section('content')
    <h1>Admin Dashboard</h1>
    <p>Hello, {{ auth()->user()->name }} (Admin)</p>
    <a href="{{ route('admin.users') }}" class="btn btn-primary">View Users</a>
@endsection
