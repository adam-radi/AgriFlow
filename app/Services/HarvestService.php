<?php

namespace App\Services;

use App\Enums\HarvestStatus;
use Illuminate\Support\Facades\Auth;
use App\Models\Harvest;
use App\Models\Product;
use Illuminate\Validation\ValidationException;

class HarvestService
{
    public function createHarvest(object $data): Harvest
    {

        $product = Product::findOrFail($data->product_id);
        $this->checkOwnership($product);
        $this->ensureNoActiveHarvest($product->id);

        return Harvest::create([
            'product_id' => $data->product_id,
            'start_date' => $data->start_date,
            'end_date' => $data->end_date,
            'estimated_total_qte' => $data->estimated_total_qte,
            'max_daily_qte' => $data->max_daily_qte,
            'status' => $data->status,
        ]);
    }
    public function updateHarvest(Harvest $harvest, array $data): Harvest
    {
        $this->checkOwnership($harvest->product);
        $harvest->update($data);
        return $harvest->fresh();
    }

    private function checkOwnership(Product $product): void
    {
        if ($product->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action');
        }
    }

    private function ensureNoActiveHarvest(int $productId): void
    {
        $activeHarvestExists = Harvest::where('product_id', $productId)
            ->where('status', HarvestStatus::Open)
            ->exists();

        if ($activeHarvestExists) {
            throw ValidationException::withMessages([
                'product_id' => 'this product already has an active harvest.'
            ]);
        }
    }
    public function openHarvest(Harvest $harvest): Harvest
    {
        $this->checkOwnership($harvest->product);
        if ($harvest->status === HarvestStatus::Open) {
            throw ValidationException::withMessages([
                'harvest' => 'this harvest is already open'
            ]);
        }
        $harvest->update(['status' => HarvestStatus::Open]);
        return $harvest->fresh();
    }
    public function closeHarvest(Harvest $harvest): Harvest
    {
        $this->checkOwnership($harvest->product);
        if ($harvest->status === HarvestStatus::Close) {
            throw ValidationException::withMessages([
                'harvest' => 'this harvest is already closed'
            ]);
        }

        $harvest->update(['status' => HarvestStatus::Close]);
        return $harvest->fresh();
    }

    public function updateHarvestStatus(Harvest $harvest): Harvest
    {
        $this->checkOwnership($harvest->product);
        if ($harvest->status === HarvestStatus::Close) {
            $harvest->update(['status' => HarvestStatus::Open]);
        } elseif ($harvest->status === HarvestStatus::Open) {
            $harvest->update(['status' => HarvestStatus::Close]);
        } else {
            throw ValidationException::withMessages([
                'harvest' => 'invalid harvest status'
            ]);
        }
        return $harvest->fresh();
    }
    public function deleteHarvest(Harvest $harvest): void
    {
        $this->checkOwnership($harvest->product);
        $harvest->delete();
    }
}
