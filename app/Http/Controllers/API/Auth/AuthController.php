<?php

namespace App\Http\Controllers\API\Auth;

use Illuminate\Routing\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(RegisterRequest $request, AuthService $authService)
    {
        $result = $authService->register($request);

        return response()->json($result, 201);
    }

    public function login(LoginRequest $request, AuthService $authService)
    {
        $result = $authService->login($request);

        return response()->json($result);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request, AuthService $authService)
    {
        $authService->logout($request);

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}


?>