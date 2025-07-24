<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\User\UserRepository;

use App\Repositories\User\UserRepositoryInterface;

use App\Repositories\Permission\permissionRepository;
use App\Repositories\Permission\permissionRepositoryInterface;
use App\Repositories\Role\RoleRepository;
use App\Repositories\Role\RoleRepositoryInterface;

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

    }
}
