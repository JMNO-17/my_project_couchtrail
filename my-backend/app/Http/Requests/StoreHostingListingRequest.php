<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHostingListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // change to auth check if needed
    }

    public function rules(): array
    {
        return [
            'address' => 'required|string|max:255',
            'home_description' => 'required|string',
            'max_guests' => 'required|integer|min:1',
            'amenities' => 'required|string',
            'additional_details' => 'nullable|string',
            'is_available' => 'required|boolean',
            'images' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}
