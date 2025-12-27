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
        'address'            => 'sometimes|string|max:255',
        'home_description'   => 'sometimes|string',
        'max_guests'         => 'sometimes|integer|min:1',
        'amenities'          => 'sometimes|string',
        'additional_details' => 'sometimes|nullable|string',
        'is_available'       => 'sometimes|boolean',

        // Profile image: allow single OR array (keep as-is if you want both)
        'profile_image'    => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'profile_images'   => 'sometimes|array',
        'profile_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',

        // Home images: MUST be an array
        'home_images'      => 'sometimes|array|min:1',
        'home_images.*'    => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}
