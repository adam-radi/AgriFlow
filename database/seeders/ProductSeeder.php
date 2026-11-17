<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductQuantity;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $farmer1 = User::where('email', 'farmer1@agriflow.com')->first();
        $farmer2 = User::where('email', 'farmer2@agriflow.com')->first();
        $farmer3 = User::where('email', 'farmer3@agriflow.com')->first();
        $farmer4 = User::where('email', 'farmer4@agriflow.com')->first();

        // Farmer 1 — Ahmed (Agadir) — Argan, Saffron, Honey, Olive Oil, Cactus Fruit, Couscous
        $argan = Product::create([
            'user_id'      => $farmer1->id,
            'name'         => 'Argan Oil Premium',
            'description'  => '100% organic extra-virgin culinary argan oil, hand-pressed by cooperatives in the Essaouira region.',
            'base_price'   => 60.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $argan->id, 'label' => '250ml',  'price' => 60.00]);
        ProductQuantity::create(['product_id' => $argan->id, 'label' => '500ml',  'price' => 110.00]);
        ProductQuantity::create(['product_id' => $argan->id, 'label' => '1 Litre', 'price' => 200.00]);

        $saffron = Product::create([
            'user_id'      => $farmer1->id,
            'name'         => 'Saffron Threads',
            'description'  => 'Premium Taliouine saffron, hand-harvested and sun-dried. Known for its intense aroma and deep red color.',
            'base_price'   => 85.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $saffron->id, 'label' => '5g',  'price' => 85.00]);
        ProductQuantity::create(['product_id' => $saffron->id, 'label' => '10g', 'price' => 160.00]);

        $honey = Product::create([
            'user_id'      => $farmer1->id,
            'name'         => 'Organic Honey',
            'description'  => 'Pure mountain honey from the Anti-Atlas region. Rich in antioxidants and naturally antibacterial.',
            'base_price'   => 45.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $honey->id, 'label' => '250g', 'price' => 45.00]);
        ProductQuantity::create(['product_id' => $honey->id, 'label' => '500g', 'price' => 80.00]);

        $olive = Product::create([
            'user_id'      => $farmer1->id,
            'name'         => 'Extra Virgin Olive Oil',
            'description'  => 'Cold-pressed organic olive oil from ancient groves in the Haouz region. Fruity and peppery finish.',
            'base_price'   => 70.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $olive->id, 'label' => '500ml',   'price' => 70.00]);
        ProductQuantity::create(['product_id' => $olive->id, 'label' => '1 Litre',  'price' => 130.00]);
        ProductQuantity::create(['product_id' => $olive->id, 'label' => '3 Litres', 'price' => 350.00]);

        $cactus = Product::create([
            'user_id'      => $farmer1->id,
            'name'         => 'Fresh Cactus Fruit',
            'description'  => 'Sweet and juicy cactus pears (El Hindi) harvested from the Souss-Massa plains. Rich in vitamin C and antioxidants.',
            'base_price'   => 25.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $cactus->id, 'label' => '1kg',  'price' => 25.00]);
        ProductQuantity::create(['product_id' => $cactus->id, 'label' => '3kg',  'price' => 65.00]);
        ProductQuantity::create(['product_id' => $cactus->id, 'label' => '5kg',  'price' => 100.00]);

        // Farmer 2 — Fatima (Marrakech) — Dates, Almonds, Ras el Hanout, Dried Figs, Mint
        $dates = Product::create([
            'user_id'      => $farmer2->id,
            'name'         => 'Majhoul Dates Premium',
            'description'  => 'Large, sweet Majhoul dates from the Errachidia oases. Naturally sun-dried, no preservatives.',
            'base_price'   => 90.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $dates->id, 'label' => '1kg',  'price' => 90.00]);
        ProductQuantity::create(['product_id' => $dates->id, 'label' => '3kg',  'price' => 250.00]);
        ProductQuantity::create(['product_id' => $dates->id, 'label' => '5kg',  'price' => 400.00]);

        $almonds = Product::create([
            'user_id'      => $farmer2->id,
            'name'         => 'Raw Almonds',
            'description'  => 'Organic whole almonds from the Ourika Valley. Unblanched, crunchy, and full of natural flavor.',
            'base_price'   => 55.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $almonds->id, 'label' => '500g', 'price' => 55.00]);
        ProductQuantity::create(['product_id' => $almonds->id, 'label' => '1kg',  'price' => 100.00]);

        $rasHanout = Product::create([
            'user_id'      => $farmer2->id,
            'name'         => 'Ras El Hanout',
            'description'  => 'Traditional Moroccan spice blend with over 20 hand-ground spices. Perfect for tagines and couscous.',
            'base_price'   => 40.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $rasHanout->id, 'label' => '100g', 'price' => 40.00]);
        ProductQuantity::create(['product_id' => $rasHanout->id, 'label' => '250g', 'price' => 85.00]);
        ProductQuantity::create(['product_id' => $rasHanout->id, 'label' => '500g', 'price' => 150.00]);

        $figs = Product::create([
            'user_id'      => $farmer2->id,
            'name'         => 'Dried Figs',
            'description'  => 'Sun-dried organic figs from the Haouz region. Naturally sweet, rich in fiber and minerals.',
            'base_price'   => 45.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $figs->id, 'label' => '500g', 'price' => 45.00]);
        ProductQuantity::create(['product_id' => $figs->id, 'label' => '1kg',  'price' => 80.00]);

        $mint = Product::create([
            'user_id'      => $farmer2->id,
            'name'         => 'Fresh Mint',
            'description'  => 'Aromatic fresh mint from the Ourika Valley. Essential for traditional Moroccan tea.',
            'base_price'   => 10.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $mint->id, 'label' => '250g', 'price' => 10.00]);
        ProductQuantity::create(['product_id' => $mint->id, 'label' => '500g', 'price' => 18.00]);

        // Farmer 3 — Hassan (Meknes, pending) — Olives, Grapes, Pomegranates
        $olives = Product::create([
            'user_id'      => $farmer3->id,
            'name'         => 'Table Olives',
            'description'  => 'Hand-picked green and black olives from Meknes. Cured naturally with traditional methods.',
            'base_price'   => 30.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $olives->id, 'label' => '500g', 'price' => 30.00]);
        ProductQuantity::create(['product_id' => $olives->id, 'label' => '1kg',  'price' => 55.00]);

        $grapes = Product::create([
            'user_id'      => $farmer3->id,
            'name'         => 'Muscat Grapes',
            'description'  => 'Sweet Muscat grapes grown in the fertile Meknes plains. Perfect for fresh consumption.',
            'base_price'   => 22.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $grapes->id, 'label' => '1kg', 'price' => 22.00]);
        ProductQuantity::create(['product_id' => $grapes->id, 'label' => '3kg', 'price' => 55.00]);

        $pomegranate = Product::create([
            'user_id'      => $farmer3->id,
            'name'         => 'Pomegranates',
            'description'  => 'Ruby-red sweet pomegranates from Meknes. Rich in antioxidants and naturally refreshing.',
            'base_price'   => 28.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $pomegranate->id, 'label' => '1kg', 'price' => 28.00]);
        ProductQuantity::create(['product_id' => $pomegranate->id, 'label' => '2kg', 'price' => 50.00]);
        ProductQuantity::create(['product_id' => $pomegranate->id, 'label' => '5kg', 'price' => 110.00]);

        // Farmer 4 — Amina (Fes) — Couscous, Chickpeas, Lentils
        $couscous = Product::create([
            'user_id'      => $farmer4->id,
            'name'         => 'Artisan Couscous',
            'description'  => 'Hand-rolled organic couscous made from durum wheat. A staple of Moroccan cuisine.',
            'base_price'   => 18.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $couscous->id, 'label' => '500g', 'price' => 18.00]);
        ProductQuantity::create(['product_id' => $couscous->id, 'label' => '1kg',  'price' => 32.00]);
        ProductQuantity::create(['product_id' => $couscous->id, 'label' => '3kg',  'price' => 85.00]);

        $chickpeas = Product::create([
            'user_id'      => $farmer4->id,
            'name'         => 'Organic Chickpeas',
            'description'  => 'Premium organic chickpeas from the Fes region. Ideal for hummus, tagines, and soups.',
            'base_price'   => 20.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $chickpeas->id, 'label' => '500g', 'price' => 20.00]);
        ProductQuantity::create(['product_id' => $chickpeas->id, 'label' => '1kg',  'price' => 35.00]);
        ProductQuantity::create(['product_id' => $chickpeas->id, 'label' => '3kg',  'price' => 90.00]);

        $lentils = Product::create([
            'user_id'      => $farmer4->id,
            'name'         => 'Green Lentils',
            'description'  => 'Locally grown green lentils from Fes. Rich in protein and fiber, perfect for hearty soups.',
            'base_price'   => 18.00,
            'is_available' => true,
        ]);
        ProductQuantity::create(['product_id' => $lentils->id, 'label' => '500g', 'price' => 18.00]);
        ProductQuantity::create(['product_id' => $lentils->id, 'label' => '1kg',  'price' => 30.00]);

        // Disabled product — Simulates a product with quality issues
        $spoiled = Product::create([
            'user_id'      => $farmer1->id,
            'name'         => 'Spoiled Argan Oil Batch',
            'description'  => '[DISABLED] This batch was flagged for quality issues — rancid smell detected during inspection.',
            'base_price'   => 30.00,
            'is_available' => false,
        ]);
        ProductQuantity::create(['product_id' => $spoiled->id, 'label' => '250ml', 'price' => 30.00]);
        ProductQuantity::create(['product_id' => $spoiled->id, 'label' => '500ml', 'price' => 55.00]);

        $this->command->info('17 seed products with quantities created');
    }
}
