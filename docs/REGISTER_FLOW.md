# 🌳 Arbre du flux Register — Interface → Base de données

Ce document décrit l'ordre d'exécution complet de l'inscription (register) dans AgriFlow, de l'interface utilisateur jusqu'à l'écriture en base de données.

---

## 1. Vue d'ensemble (ordre d'exécution)

| # | Couche | Fichier | Classe / Fonction | Rôle |
|---|--------|---------|-------------------|------|
| 1 | Interface (UI) | `agriflow-web/src/pages/RegisterPage.jsx` | `RegisterPage()` | Choix du profil (Agriculteur / Acheteur Pro) |
| 2 | Interface (UI) | `agriflow-web/src/pages/RegisterClient.jsx` | `RegisterClientPage()` → `handleSubmit()` | Formulaire acheteur → `dispatch(registerClient(formData))` |
| 3 | Interface (UI) | `agriflow-web/src/pages/RegisterFarmerPage.jsx` | `RegisterFarmerPage()` → `handleSubmit()` | Formulaire agriculteur → `dispatch(registerFarmer(formData))` |
| 4 | Redux Thunk | `agriflow-web/src/features/auth/authThunks.js` | `registerClient` / `registerFarmer` | `axiosClient.post(ENDPOINTS.AUTH.REGISTER, { ...data, role })` |
| 5 | HTTP Client | `agriflow-web/src/api/axiosClient.js` | `axiosClient` | POST `baseURL + /auth/register` (ajoute le Bearer token) |
| 6 | Route API | `agriflow-api/routes/api.php` | `Route::post('/register', [AuthController::class,'register'])` | Point d'entrée Laravel (throttle 5/1) |
| 7 | Validation | `agriflow-api/app/Http/Requests/Auth/RegisterRequest.php` | `RegisterRequest::rules()` / `authorize()` | `name`, `email` (unique), `password` (min:8, confirmed), `role`, `phone`, `zone` |
| 8 | Controller | `agriflow-api/app/Http/Controllers/Api/AuthController.php` | `AuthController::register()` | Appelle `$authService->register($request)`, retourne `UserResource` + token |
| 9 | Service (métier) | `agriflow-api/app/Services/AuthService.php` | `AuthService::register()` | Normalise le rôle, hash le mot de passe, crée l'utilisateur, synchronise `user_roles`, génère le token Sanctum |
| 10 | Modèle Eloquent | `agriflow-api/app/Models/User.php` | `User::create($data)` | INSERT dans la table `users` |
| 11 | Base de données | `agriflow-api/database.sqlite` | Tables : `users`, `user_roles`, `personal_access_tokens` | Écriture réelle en base |
| 12 | Ressponse (Resource) | `agriflow-api/app/Http/Resources/UserResource.php` | `UserResource::toArray()` | Transforme l'utilisateur en JSON (id, name, email, role, phone, zone, farmer_status, created_at) |
## 2. Détail du code par couche

### 2.1 Frontend — formulaire client (Acheteur Pro)

`agriflow-web/src/pages/RegisterClient.jsx` (lignes 52-71)

```js
const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
        setLocalError("Le mot de passe doit contenir au moins 8 caractères.");
        return;
    }
    if (formData.password !== formData.password_confirmation) {
        setLocalError("Les mots de passe ne correspondent pas.");
        return;
    }
    dispatch(registerClient(formData)).unwrap()
        .then(() => navigate("/products"))
        .catch(() => {});
};
```

### 2.2 Frontend — thunk (appel API)

`agriflow-web/src/features/auth/authThunks.js` (lignes 23-61)

```js
export const registerClient = createAsyncThunk(
    "auth/registerClient",
    async (data, { rejectWithValue }) => {
        const response = await axiosClient.post(ENDPOINTS.AUTH.REGISTER, {
            ...data, role: "Client",
        });
        return response.data.data;
    }
);

export const registerFarmer = createAsyncThunk(
    "auth/registerFarmer",
    async (data, { rejectWithValue }) => {
        const response = await axiosClient.post(ENDPOINTS.AUTH.REGISTER, {
            ...data, role: "Farmer",
        });
        return response.data.data;
    }
);
```

Endpoint utilisé : `ENDPOINTS.AUTH.REGISTER` = `/auth/register`  
(`agriflow-web/src/api/endpoints.js`)

### 2.3 Route Laravel

`agriflow-api/routes/api.php` (lignes 26-29)

```php
Route::post('/register', [
    AuthController::class,
    'register',
])->middleware('throttle:5,1');
```

### 2.4 Controller

`agriflow-api/app/Http/Controllers/Api/AuthController.php` (lignes 15-23)

```php
public function register(RegisterRequest $request, AuthService $authService): JsonResponse
{
    $result = $authService->register($request);

    return $this->created([
        'user'  => new UserResource($result['user']),
        'token' => $result['token'],
    ], 'Registration successful');
}
```

### 2.5 Validation (FormRequest — s'exécute AVANT le controller)

`agriflow-api/app/Http/Requests/Auth/RegisterRequest.php` (lignes 17-51)

```php
public function rules(): array
{
    return [
        'name'                  => ['required', 'string', 'max:255'],
        'email'                 => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
        'password'              => ['required', 'string', 'min:8', 'confirmed'],
        'phone'                 => ['nullable', 'string', 'max:30', 'unique:users,phone'],
        'zone'                  => ['nullable', 'string', 'max:100'],
        'role'                  => ['sometimes', 'string', Rule::in([...])],
        'roles'                 => ['sometimes', 'array'],
        'roles.*'               => ['string', Rule::in([...])],
    ];
}
```

### 2.6 Service (cœur métier + écriture DB)

`agriflow-api/app/Services/AuthService.php` (lignes 15-58)

```php
public function register(Request $request): array
{
    $roleInput = $request->input('role');
    if (!$roleInput && is_array($request->input('roles')) && count($request->input('roles')) > 0) {
        $roleInput = $request->input('roles')[0];
    }

    $normalizedRole = UserRole::Client;
    if ($roleInput && in_array(strtolower($roleInput), ['farmer', 'agriculteur'])) {
        $normalizedRole = UserRole::Farmer;
    }

    $data = [
        'name'          => $request->name,
        'email'         => $request->email,
        'password'      => bcrypt($request->password),
        'role'          => $normalizedRole,
        'phone'         => $request->phone ?? null,
        'zone'          => $request->zone ?? null,
    ];

    if ($normalizedRole === UserRole::Farmer) {
        $data['farmer_status'] = FarmerStatus::Pending;
    }

    $user = User::create($data);   // ← INSERT dans users

    try {
        $slug = ($normalizedRole === UserRole::Farmer) ? Role::FARMER : Role::PROFESSIONAL_BUYER;
        $dbRole = Role::where('slug', $slug)->first();
        if ($dbRole) {
            $user->roles()->syncWithoutDetaching([$dbRole->id]);  // ← INSERT dans user_roles
        }
    } catch (\Throwable $e) { }

    $token = $user->createToken('auth_token')->plainTextToken;  // ← INSERT dans personal_access_tokens

    return ['user' => $user, 'token' => $token];
}
```

### 2.7 Modèle User

`agriflow-api/app/Models/User.php`

```php
protected $fillable = ['name', 'email', 'password', 'role', 'farmer_status', 'phone', 'zone'];

public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class, 'user_roles')->withTimestamps();
}
```

### 2.8 Ressource de réponse (retour vers le front)

`agriflow-api/app/Http/Resources/UserResource.php`

```php
return [
    'id'            => $this->id,
    'name'          => $this->name,
    'email'         => $this->email,
    'role'          => $this->role,
    'phone'         => $this->phone,
    'zone'          => $this->zone,
    'farmer_status' => $this->farmer_status,
    'created_at'    => $this->created_at,
];
```

---

## 3. Tables de base de données impactées

Dans `agriflow-api/database.sqlite` :

| Table | Colonnes principales concernées |
|-------|---------------------------------|
| `users` | `id, name, email, password, role, farmer_status, phone, zone, created_at, updated_at` |
| `user_roles` (pivot) | `user_id, role_id` |
| `personal_access_tokens` | `tokenable_id, name, token, ...` (Sanctum) |

Migrations concernées :
- `0001_01_01_000000_create_users_table.php`
- `2026_11_06_231358_add_phone_to_users_table.php`
- `2026_11_05_224816_creat-roles-table.php`
- `2026_11_05_225700_create-user-role-table.php`
- `2026_05_22_143848_create_personal_access_tokens_table.php`

---

## 4. Enums utilisées

`agriflow-api/app/Enums/UserRole.php` :

```php
const Admin = 'Admin';
const Farmer = 'Farmer';
const Client = 'Client';
const Livreur = 'Livreur';
```

`agriflow-api/app/Enums/FarmerStatus.php` :

```php
const Pending = 'pending';
const Approved = 'approved';
const Rejected = 'rejected';
```

---

## 5. Résumé du flux (en une phrase)

L'utilisateur remplit le formulaire d'inscription (client ou agriculteur) → le thunk Redux appelle `POST /auth/register` → Laravel valide via `RegisterRequest` → `AuthController` délègue à `AuthService` → `User::create()` écrit dans `users`, puis lie le rôle dans `user_roles` et génère un token Sanctum → la réponse revient via `UserResource` avec `{ user, token }`.

