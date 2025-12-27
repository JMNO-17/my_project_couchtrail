<?php
namespace App\Repositories\HostListings;

use App\Models\HostingListing;

interface HostingListingRepositoryInterface
{
    public function create(array $data, int $userId): HostingListing;
    public function update(HostingListing $listing, array $data): HostingListing;
    public function find(int $id): ?HostingListing;
    public function allByUser(int $userId);
    public function delete(HostingListing $listing): bool;
}
