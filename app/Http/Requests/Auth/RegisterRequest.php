<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Role;
use App\Enums\UserRole;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                  => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
            'phone'                 => ['nullable', 'string', 'max:30', 'unique:users,phone'],
            'zone'                  => ['nullable', 'string', 'max:100'],
            'role'                  => [
                'sometimes',
                'string',
                Rule::in([
                    UserRole::Farmer,
                    UserRole::Client,
                    Role::FARMER,
                    Role::PROFESSIONAL_BUYER,
                    'farmer',
                    'client',
                    'professional_buyer',
                ]),
            ],
            'roles'                 => ['sometimes', 'array'],
            'roles.*'               => [
                'string',
                Rule::in([
                    UserRole::Farmer,
                    UserRole::Client,
                    Role::FARMER,
                    Role::PROFESSIONAL_BUYER,
                    'farmer',
                    'client',
                    'professional_buyer',
                ]),
            ],
        ];
    }
}
