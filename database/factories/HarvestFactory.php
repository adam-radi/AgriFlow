<?php

namespace Database\Factories;

use App\Models\Harvest;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class HarvestFactory extends Factory
{
    protected $model = Harvest::class;

    public function definition(): array
    {
        return [
            'product_id'          => Product::factory(),
            'start_date'          => now()->subDays(5)->toDateString(),
            'end_date'            => now()->addDays(30)->toDateString(),
            'estimated_total_qte' => 1000,
            'max_daily_qte'       => 100,
            'status'              => 'open',
            'reserved_quantity'   => 0,
        ];
    }

    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'close',
        ]);
    }

    public function withCapacity(int $total, int $daily): static
    {
        return $this->state(fn (array $attributes) => [
            'estimated_total_qte' => $total,
            'max_daily_qte'       => $daily,
        ]);
    }
}
