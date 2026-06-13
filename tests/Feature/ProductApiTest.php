<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;
    public function test_farmer_can_create_product()
    {
        $farmer = User::factory()->create([
            'role' => 'farmer'
        ]);

        Sanctum::actingAs($farmer);

        $response = $this->postJson('/api/products', [
            'name' => 'Tomato',
            'description' => 'Fresh tomato',
            'quantities' => [
                [
                    'label' => '1kg',
                    'price' => 20
                ]
            ]
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('products', [
            'name' => 'Tomato',
            'user_id' => $farmer->id
        ]);
    }
    public function test_farmer_can_update_his_product()
    {
        $farmer = User::factory()->create([
            'role' => 'farmer'
        ]);

        Sanctum::actingAs($farmer);

        $product = Product::factory()->create([
            'user_id' => $farmer->id
        ]);

        $response = $this->putJson("/api/products/{$product->id}", [
            'name' => 'Updated Tomato'
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Tomato'
        ]);
    }
    public function test_farmer_can_delete_his_product()
    {
        $farmer = User::factory()->create([
            'role' => 'farmer'
        ]);

        Sanctum::actingAs($farmer);

        $product = Product::factory()->create([
            'user_id' => $farmer->id
        ]);

        $response = $this->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('products', [
            'id' => $product->id
        ]);
    }
    public function test_client_cannot_create_product()
    {
        $client = User::factory()->create([
            'role' => 'client'
        ]);

        Sanctum::actingAs($client);

        $response = $this->postJson('/api/products', [
            'name' => 'Tomato'
        ]);

        $response->assertStatus(403);
    }
    public function test_farmer_cannot_update_other_farmer_product()
    {
        $owner = User::factory()->create([
            'role' => 'farmer'
        ]);

        $attacker = User::factory()->create([
            'role' => 'farmer'
        ]);

        $product = Product::factory()->create([
            'user_id' => $owner->id
        ]);

        Sanctum::actingAs($attacker);

        $response = $this->putJson("/api/products/{$product->id}", [
            'name' => 'Hacked Product'
        ]);

        $response->assertStatus(403);
    }
    public function test_product_creation_requires_name()
{
    $farmer = User::factory()->create([
        'role' => 'farmer'
    ]);

    Sanctum::actingAs($farmer);

    $response = $this->postJson('/api/products', []);

    $response->assertStatus(422);

    $response->assertJsonValidationErrors([
        'name'
    ]);
}
}
