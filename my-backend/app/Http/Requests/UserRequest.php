<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'email' => 'required|unique:users,email,except,id',
            'phone' => 'required|string',
            'gender' => 'required|string',
            'address' => 'required|string',
            'status' => 'required',
            'image' => 'required',
            'password' => 'required',
            'roles' => 'required|exists:roles,id',


        ];
    }
}
