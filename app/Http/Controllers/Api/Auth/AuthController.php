<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;


class AuthController extends Controller
{
    public function register(RegisterRequest $request, AuthService $authService) : JsonResponse 
    {
        $result = $authService->register($request);

        return $this->created([
            'user'  => new UserResource($result['user']),
            'token' => $result['token'],
        ], 'Registration successful');
    }

    public function login(LoginRequest $request, AuthService $authService)
    {
        $result = $authService->login($request);

        return $this->success([
            'user'  => new UserResource($result['user']),
            'token' => $result['token'],
        ], 'Login successful');
    }

    public function me(Request $request)
    {
        return $this->success(new UserResource($request->user()));
    }

    public function logout(Request $request, AuthService $authService)
    {
        $authService->logout($request);

        return $this->success(null, 'Logged out successfully');
    }
}
