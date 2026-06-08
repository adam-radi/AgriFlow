<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\ProductQuantity;
use App\Models\Harvest;
use App\Enums\OrderStatus;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderCapacityTest extends TestCase
{
    use RefreshDatabase;

    private User $customer;
    private User $farmer;
    private Product $product;
    private ProductQuantity $standard;
    private Harvest $harvest;

    protected function setUp(): void
    {
        parent::setUp();

        $this->farmer = User::factory()->create(['role' => 'Farmer']);
        $this->customer = User::factory()->create(['role' => 'Client']);

        $this->product = Product::factory()->create([
            'user_id' => $this->farmer->id,
        ]);

        $this->standard = ProductQuantity::create([
            'product_id' => $this->product->id,
            'label'      => '1kg',
            'price'      => 10,
        ]);

        $this->harvest = Harvest::factory()->withCapacity(100, 50)->create([
            'product_id' => $this->product->id,
        ]);
    }

    public function test_order_reserves_capacity(): void
    {
        Sanctum::actingAs($this->customer);

        $response = $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $this->harvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 30,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(5)->toDateString(),
        ]);

        $response->assertStatus(201);

        $this->harvest->refresh();
        $this->assertEquals(30, $this->harvest->reserved_quantity);
    }

    public function test_rejects_order_exceeding_total_capacity(): void
    {
        Sanctum::actingAs($this->customer);

        $response = $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $this->harvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 150,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(5)->toDateString(),
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['quantity']);

        $this->harvest->refresh();
        $this->assertEquals(0, $this->harvest->reserved_quantity);
    }

    public function test_rejects_order_exceeding_daily_capacity(): void
    {
        Sanctum::actingAs($this->customer);

        $response = $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $this->harvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 60,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(5)->toDateString(),
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['quantity']);

        $this->harvest->refresh();
        $this->assertEquals(0, $this->harvest->reserved_quantity);
    }

    public function test_multiple_orders_cumulate_capacity(): void
    {
        Sanctum::actingAs($this->customer);

        $first = $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $this->harvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 20,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(1)->toDateString(),
        ]);
        $first->assertStatus(201);

        $second = $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $this->harvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 20,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(1)->toDateString(),
        ]);
        $second->assertStatus(201);

        $this->harvest->refresh();
        $this->assertEquals(40, $this->harvest->reserved_quantity);
    }

    public function test_third_order_exceeds_daily_cap_after_two_fit(): void
    {
        Sanctum::actingAs($this->customer);

        $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $this->harvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 20,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(1)->toDateString(),
        ])->assertStatus(201);

        $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $this->harvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 20,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(1)->toDateString(),
        ])->assertStatus(201);

        $response = $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $this->harvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 20,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(1)->toDateString(),
        ]);

        $response->assertStatus(422);
    }

    public function test_cancel_order_releases_capacity(): void
    {
        Sanctum::actingAs($this->customer);

        $response = $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $this->harvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 30,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(5)->toDateString(),
        ]);
        $response->assertStatus(201);

        $orderId = $response->json('data.id');

        $cancel = $this->postJson("/api/orders/{$orderId}/cancel");
        $cancel->assertStatus(200);

        $this->harvest->refresh();
        $this->assertEquals(0, $this->harvest->reserved_quantity);
    }

    public function test_cancelled_capacity_can_be_reordered(): void
    {
        Sanctum::actingAs($this->customer);

        $response = $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $this->harvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 50,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(10)->toDateString(),
        ]);
        $response->assertStatus(201);

        $orderId = $response->json('data.id');

        $this->postJson("/api/orders/{$orderId}/cancel")->assertStatus(200);

        $response = $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $this->harvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 50,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(10)->toDateString(),
        ]);

        $response->assertStatus(201);
    }

    public function test_rejects_order_for_closed_harvest(): void
    {
        $closedHarvest = Harvest::factory()->closed()->create([
            'product_id' => $this->product->id,
        ]);

        Sanctum::actingAs($this->customer);

        $response = $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $closedHarvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 10,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(5)->toDateString(),
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['harvest_id']);
    }

    public function test_different_dates_use_separate_daily_capacity(): void
    {
        Sanctum::actingAs($this->customer);

        $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $this->harvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 50,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(1)->toDateString(),
        ])->assertStatus(201);

        $this->postJson('/api/orders', [
            'items' => [
                [
                    'harvest_id'           => $this->harvest->id,
                    'quantity_standard_id' => $this->standard->id,
                    'quantity'             => 50,
                ],
            ],
            'zone'          => 'Zone A',
            'delivery_date' => now()->addDays(2)->toDateString(),
        ])->assertStatus(201);

        $this->harvest->refresh();
        $this->assertEquals(100, $this->harvest->reserved_quantity);
    }
}
