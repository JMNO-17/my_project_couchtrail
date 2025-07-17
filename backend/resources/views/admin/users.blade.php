@extends('layouts.app')

@section('content')
    <h2>All Users</h2>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Region</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($users as $user)
                <tr>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td>{{ $user->region }}</td>
                    <td>
                        <form action="{{ route('admin.ban', $user->id) }}" method="POST">
                            @csrf
                            <button class="btn btn-danger" onclick="return confirm('Are you sure?')">Ban</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endsection
