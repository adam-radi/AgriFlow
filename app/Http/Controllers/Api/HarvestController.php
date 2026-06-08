<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreHarvestRequest;
use App\Http\Requests\UpdateHarvestRequest;
use App\Http\Resources\HarvestResource;
use App\Services\HarvestService;
use App\Models\Harvest;
use App\Http\Controllers\Controller;

class HarvestController extends Controller
{
    public function index()
    {
        $harvests = Harvest::with('product')->latest()->paginate(30);

        return $this->success(
            HarvestResource::collection($harvests)->response()->getData(true)
        );
    }

    public function show(string $id)
    {
        $harvest = Harvest::with('product')->findOrFail($id);

        return $this->success(new HarvestResource($harvest));
    }

    public function store(StoreHarvestRequest $request, HarvestService $harvestService)
    {
        $this->authorize('create', Harvest::class);

        $harvest = $harvestService->createHarvest($request);

        return $this->created(new HarvestResource($harvest), 'Harvest created successfully');
    }

    public function update(UpdateHarvestRequest $request, string $id, HarvestService $harvestService)
    {
        $harvest = Harvest::findOrFail($id);
        $this->authorize('update', $harvest);

        $harvest = $harvestService->updateHarvest($harvest, $request->validated());

        return $this->success(new HarvestResource($harvest), 'Harvest updated successfully');
    }

    public function updateHarvestStatus(string $id, string $status, HarvestService $harvestService)
    {
        $harvest = Harvest::findOrFail($id);
        $this->authorize('update', $harvest);

        $harvest = $harvestService->updateHarvestStatus($harvest);

        return $this->success(new HarvestResource($harvest), 'Harvest status updated');
    }

    public function destroy(string $id)
    {
        $harvest = Harvest::findOrFail($id);
        $this->authorize('delete', $harvest);

        $harvest->delete();

        return $this->success(null, 'Harvest deleted successfully');
    }
}
