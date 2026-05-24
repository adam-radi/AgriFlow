<?php

namespace App\Services;

use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class Authservice
{
    public function register(Request $request)
    {
        if (!$request->role || $request->role === UserRole::Admin) {
            $request->role  = UserRole::Client;
        };


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);
        $token = $user->createToken('auth_token')->plaintextToken;
        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }
    public function Login(Request $request)
    {

        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message', 'Invalid credentials'], 401);
        };
        $token = $user->createToken('auth_token')->plaintextToken;
        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'massage' => 'logged out succesfull'
        ]);
    }
}
