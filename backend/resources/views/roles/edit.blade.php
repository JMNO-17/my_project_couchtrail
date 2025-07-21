@extends('layouts.master')
@section('content')
<div class="container">

    <div class="card mt-4">
        <div class="card-header">
            Edit role
        </div>
        <form action="{{ route('roles.update', ["role" => $role->id]) }}" method="POST">
            @csrf
             {{method_field('PUT')}}

            <div class="card-body">
                <input type="text" class="form-control" name="name" value="{{ $role->name }}" />
            </div>

            <div class="card-body">
                @foreach ($permissions as $permission)
                    <div class="my-4">
                        <div class="form-check">
                            <input type="checkbox" name="permissions[]" class="form-check-input" value="{{$permission->id}}"
                            id="permission{{$permission->id}}" @if(in_array($permission->id, $rolePermissions)) checked @endif/>
                        <label for="permission{{$permission->id}}" class="form-checklabel">
                            {{$permission->name}}
                        </label>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="card-footer">
                <button class="btn btn-primary me-2" type="submit">
                    Update
                </button>
                <a href="{{ route('roles.index') }}" class="btn btn-secondary">Back</a>
            </div>
        </form>
    </div>
</div>
@endsection
