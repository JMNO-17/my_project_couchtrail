@extends('layouts.master')
@section('content')
    <div class="container">

        <div class="card mt-4">
            <div class="card-header bg-secondary text-center text-white">
                User Details
            </div>
            <div class="card-body">
                <p>{{ $user['id'] }}</p>
                <p>{{ $user['name'] }}</p>
                <p>{{ $user['email'] }}</p>
                <p>{{ $user['phone'] }}</p>
                <p>{{ $user['gender'] }}</p>
                <p>{{ $user['address'] }}</p>



                <img src="{{ asset('userImages/' . $user->image) }}" alt="{{ $user->image }}"
                    style="width: 50px; height: 50px;" />

                {{-- @if ($user->status == 1)
                    <p class="text-success">Active</p>
                @else
                    <p class="text-danger">Suspend</p>
                @endif --}}

                <form action="{{ route('users.status', ['id' => $user->id]) }}" method="POST">
                    @csrf
                    <button class="btn btn-sm {{ $user->status === 1 ? 'btn-success' : 'btn-danger' }}" type="submit">
                        {{ $user->status === 1 ? 'Active' : 'Inactive' }}
                    </button>
                </form>

            </div>
            <div class="card-footer">
                <a href="{{ route('users.index') }}" class="btn btn-secondary">Back</a>
            </div>

        </div>
    </div>
@endsection
