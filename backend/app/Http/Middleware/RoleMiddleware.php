<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     * Role check: /admin -> role:admin
     */
    public function handle(Request $request, Closure $next, $role)
    {
        $user = Auth::user();

        if (! $user || $user->role !== $role) {
            return response()->json(['message' => 'Forbidden. Insufficient permissions.'], 403);
        }

        return $next($request);
    }
}
