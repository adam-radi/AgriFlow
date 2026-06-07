<?php

namespace App\Http\Controllers\API\Auth;

use Illuminate\Routing\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\Authservice;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(RegisterRequest $request, Authservice $authservice)
    {
        return $authservice->register($request);
    }

    public function login(LoginRequest $request,Authservice $authservice)
    {
        return $authservice->Login($request);
    }

    public function me(Request $request){
        return response()->json([
            'user'=> $request->user(),
        ]);
    
    }
    public function logout(Request $request,Authservice $authservice){
        return $authservice->logout($request);
    }
}


?>