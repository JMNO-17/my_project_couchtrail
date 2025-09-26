<?php

namespace App\Repositories\HostListings;

use App\Models\HostingImage;
use App\Models\HostingListing;


class HostingListingRepository implements HostingListingRepositoryInterface
{
    public function index()
    {
        return HostingListing::with(['homeImages'])->get();
    }

    public function create(array $data, int $userId): HostingListing
{
    // Create hosting listing
    $listing = HostingListing::create([
        'user_id' => $userId,
        'address' => $data['address'],
        'home_description' => $data['home_description'],
        'max_guests' => $data['max_guests'],
        'amenities' => $data['amenities'],
        'additional_details' => $data['additional_details'] ?? null,
        'is_available' => $data['is_available'],
    ]);

    // Save profile (host) image
    if (isset($data['profile_image'])) {
        $path = $data['profile_image']->store('hostImage', 'public'); // no slash needed
        $listing->hostImage()->create([
            'image_path' => $path
        ]);
    }

    // Save multiple home images
    if (isset($data['home_images']) && is_array($data['home_images'])) {
        foreach ($data['home_images'] as $file) {
            $path = $file->store('homeImage', 'public');
            $listing->homeImages()->create([
                'image_path' => $path
            ]);
        }
    }

    return $listing->load(['hostImage', 'homeImages']);
}




    public function update(HostingListing $listing, array $data): HostingListing
    {
        // Update profile image if new one uploaded
        if (isset($data['profileImage'])) {
            $path = $data['profileImage']->store('hosting/profile_images', 'public');
            $listing->profile_image = $path;
        }

        // Update other fields
        $listing->update([
            'address' => $data['address'] ?? $listing->address,
            'home_description' => $data['home_description'] ?? $listing->home_description,
            'max_guests' => $data['max_guests'] ?? $listing->max_guests,
            'amenities' => $data['amenities'] ?? $listing->amenities,
            'additional_details' => $data['additional_details'] ?? $listing->additional_details,
            'is_available' => $data['is_available'] ?? $listing->is_available,
        ]);

        // Add new home images if provided
        if (isset($data['homeImages']) && is_array($data['homeImages'])) {
            foreach ($data['homeImages'] as $file) {
                $path = $file->store('hosting/home_images', 'public');
                $listing->homeImages()->create(['image_path' => $path]);
            }
        }

        return $listing->load('homeImages');
    }

    public function find(int $id): ?HostingListing
    {
        return HostingListing::with('homeImages')->find($id);
    }

    public function allByUser(int $userId)
    {
        return HostingListing::with('homeImages')
            ->where('host_id', $userId)
            ->get();
    }

    public function delete(HostingListing $listing): bool
    {
        // Delete home images from DB (and optionally from storage)
        foreach ($listing->homeImages as $image) {
            $image->delete();
        }

        return $listing->delete();
    }
}
