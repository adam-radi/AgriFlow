<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
  public function authorize()
  {
    return true;
  }

  public function rules(){
    return [
        'name'=>'required|string|max:255',
        'email'=>'required|email|unique:users',
        'password'=>'required|string|min:8|confirmed',
          'phone' => [
                'required',
                'string',
                'max:30',
                'unique:users,phone',
            ],
        'roles.*' => [
                  'required',
                  'string',
                  'distinct',
                  Rule::in([
                      Role::FARMER,
                      Role::PROFESSIONAL_BUYER,
                  ])
      ]
    ];
  }
}
