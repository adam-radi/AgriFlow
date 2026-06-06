<?php

namespace App\Services;

use App\Enums\FarmerStatus;
use App\Enums\UserRole;
use App\Models\DeliveryGroup;
use App\Models\Harvest;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminService
{
    public function listUsers(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        return $query->latest()->paginate(20);
    }

    public function approveFarmer(User $user): User
    {
        if ($user->role !== UserRole::Farmer) {
            throw ValidationException::withMessages([
                'user' => 'User is not a farmer.',
            ]);
        }

        $user->update(['farmer_status' => FarmerStatus::Approved]);

        return $user->fresh();
    }

    public function rejectFarmer(User $user): User
    {
        if ($user->role !== UserRole::Farmer) {
            throw ValidationException::withMessages([
                'user' => 'User is not a farmer.',
            ]);
        }

        $user->update(['farmer_status' => FarmerStatus::Rejected]);

        return $user->fresh();
    }

    public function createDeliveryUser(Request $request): User
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
            'role'     => UserRole::Livreur,
            'phone'    => $request->input('phone'),
            'zone'     => $request->input('zone'),
        ]);

        return $user;
    }

    public function deleteUser(User $user): void
    {
        $user->delete();
    }

    public function globalStats(): array
    {
        return [
            'total_users'    => User::count(),
            'total_farmers'  => User::where('role', UserRole::Farmer)->count(),
            'total_customers'=> User::where('role', UserRole::Client)->count(),
            'total_orders'   => Order::count(),
            'total_revenue'  => Payment::where('status', 'paid')->sum('amount'),
            'delivered_orders'=> Order::where('status', 'delivered')->count(),
            'active_harvests'=> Harvest::where('status', 'open')->count(),
            'pending_farmers'=> User::where('role', UserRole::Farmer)
                                    ->where('farmer_status', FarmerStatus::Pending)
                                    ->count(),
        ];
    }

    public function listAllOrders(Request $request)
    {
        $query = Order::with('customer', 'items.product', 'payment');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return $query->latest()->paginate(20);
    }

    public function listAllProducts(Request $request)
    {
        return Product::with('user', 'productQuantities')->latest()->paginate(20);
    }

    public function listAllHarvests(Request $request)
    {
        return Harvest::with('product.user')->latest()->paginate(20);
    }

    public function listAllDeliveries(Request $request)
    {
        return DeliveryGroup::with('deliveryUser', 'items')->latest()->paginate(20);
    }
}
