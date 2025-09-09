<?php
namespace App\Repositories\HostListings;

use App\Models\HostingListing;

class HostingListingRepository implements HostingListingRepositoryInterface
{
    public function index()
    {

    }

    public function create(array $data, int $userId): HostingListing
    {
        $listing = HostingListing::create([
            'host_id' => $userId,
            'user_id' => $userId,
            'address' => $data['address'],
            'home_description' => $data['home_description'],
            'max_guests' => $data['max_guests'],
            'amenities' => $data['amenities'],
            'additional_details' => $data['additional_details'] ?? null,
            'is_available' => $data['is_available'],
        ]);

        return $listing;
    }

    public function update(HostingListing $listing, array $data): HostingListing
    {
        $listing->update($data);

        if (isset($data['images'])) {
            foreach ($data['images'] as $file) {
                $path = $file->store('hosting_images', 'public');
                $listing->images()->create(['image_path' => $path]);
            }
        }

        return $listing->load('images');
    }

    public function find(int $id): ?HostingListing
    {
        return HostingListing::with('images')->find($id);
    }

    public function allByUser(int $userId)
    {
        return HostingListing::with('images')->where('host_id', $userId)->get();
    }

    public function delete(HostingListing $listing): bool
    {
        return $listing->delete();
    }
}
