<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHostingListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'address' => 'sometimes|string|max:255',
            'home_description' => 'sometimes|string',
            'max_guests' => 'sometimes|integer|min:1',
            'amenities' => 'sometimes|string',
            'additional_details' => 'nullable|string',
            'is_available' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}
