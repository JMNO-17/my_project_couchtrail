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
            'address' => 'string|max:255',
            'home_description' => 'string',
            'max_guests' => 'integer|min:1',
            'amenities' => 'string',
            'additional_details' => 'nullable|string',
            'is_available' => 'boolean',
            // 'images' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'profile_image'=> 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'home_images'=> 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}
