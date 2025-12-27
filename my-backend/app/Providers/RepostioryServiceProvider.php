<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Role\RoleRepository;

use App\Repositories\User\UserRepository;

use App\Repositories\HostingListingRepository;
use App\Repositories\Role\RoleRepositoryInterface;
use App\Repositories\User\UserRepositoryInterface;
use App\Repositories\Permission\permissionRepository;
use App\Repositories\HostingListingRepositoryInterface;
use App\Repositories\Permission\permissionRepositoryInterface;


class RepostioryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->app->singleton(RoleRepositoryInterface::class,RoleRepository::class);
        // $this->app->singleton(UserRepositoryInterface::class, UserRepository::class);
        $this->app->singleton(permissionRepositoryInterface::class,permissionRepository::class);

        $this->app->singleton(HostingListingRepositoryInterface::class,HostingListingRepository::class);

    }
}
