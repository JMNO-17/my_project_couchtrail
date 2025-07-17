@extends('layouts.app')

@section('content')
    <h1>Welcome, {{ auth()->user()->name }}!</h1>
    <p>Your email: {{ auth()->user()->email }}</p>
    <p>Region: {{ auth()->user()->region ?? 'Not set' }}</p>
@endsection
