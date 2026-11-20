<?php

namespace Database\Seeders;

use App\Models\DeliveryGroup;
use App\Models\DeliveryGroupItem;
use App\Models\Order;
use App\Models\User;
use App\Enums\DeliveryStatus;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DeliveryGroupSeeder extends Seeder
{
    public function run(): void
    {
        $livreur1 = User::where('email', 'livreur1@agriflow.com')->first();
        $livreur2 = User::where('email', 'livreur2@agriflow.com')->first();

        $now = Carbon::now();

        // Delivery group 1 — Planned, Agadir (Order 2 - confirmed Saffron)
        $confirmedAgadir = Order::where('status', 'confirmed')->where('zone', 'Agadir')->first();
        if ($confirmedAgadir) {
            $group1 = DeliveryGroup::create([
                'delivery_date'    => $now->copy()->addDays(5)->toDateString(),
                'zone'             => 'Agadir',
                'status'           => DeliveryStatus::Planned,
                'delivery_user_id' => $livreur1->id,
            ]);
            foreach ($confirmedAgadir->items as $item) {
                DeliveryGroupItem::create([
                    'delivery_group_id' => $group1->id,
                    'order_item_id'     => $item->id,
                ]);
            }
        }

        // Delivery group 2 — In Transit, Marrakech (Order 5 - Delivered)
        $delivered = Order::where('status', 'delivered')->first();
        if ($delivered) {
            $group2 = DeliveryGroup::create([
                'delivery_date'    => $now->copy()->subDays(3)->toDateString(),
                'zone'             => 'Marrakech',
                'status'           => DeliveryStatus::Delivered,
                'delivery_user_id' => $livreur2->id,
            ]);
            foreach ($delivered->items as $item) {
                DeliveryGroupItem::create([
                    'delivery_group_id' => $group2->id,
                    'order_item_id'     => $item->id,
                ]);
            }
        }

        // Delivery group 3 — Planned, Rabat (Order 6 - confirmed Couscous + Cactus)
        $confirmedRabat = Order::where('status', 'confirmed')->where('zone', 'Rabat')->first();
        if ($confirmedRabat) {
            $group3 = DeliveryGroup::create([
                'delivery_date'    => $now->copy()->addDays(6)->toDateString(),
                'zone'             => 'Rabat',
                'status'           => DeliveryStatus::Planned,
                'delivery_user_id' => $livreur1->id,
            ]);
            foreach ($confirmedRabat->items as $item) {
                DeliveryGroupItem::create([
                    'delivery_group_id' => $group3->id,
                    'order_item_id'     => $item->id,
                ]);
            }
        }

        $this->command->info('3 seed delivery groups with items created');
    }
}
