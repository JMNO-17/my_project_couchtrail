<?php

namespace App\Services\User;

use App\Models\User;
use App\Repositories\User\UserRepositoryInterface;

class UserService
{

    protected $userRepository;
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function status($id)
    {
        $user = $this->userRepository->show($id);

        $user->status = $user->status === 1 ? 0 : 1;

        $user->save();
    }
}
