<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreHarvestRequest;
use App\Http\Requests\UpdateHarvestRequest;
use App\Services\HarvestService;
use App\Models\Harvest;
class HarvestController
{
    /**
     * Display a listing of the resource.
     */
    public function index(){
        $harvest=Harvest::paginate(30);
        return($harvest);
    }
    
      public function show(string $id){
        $product=Harvest::FindOrFail($id);
        return $product;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHarvestRequest $request ,HarvestService $harvestService)
    {
        return $harvestService->createHarvest($request);
    }

    /**
     * Display the specified resource.
     */
    

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHarvestRequest $data,string $id, HarvestService $harvestService)
    {
                $harvest = Harvest::findOrFail($id);

        return $harvestService->updateHarvest( $data , $harvest);
    }
    public function updateHarvestStatus(string $id, string $status, HarvestService $harvestService)
    {
        $harvest = Harvest::findOrFail($id);
        return $harvestService->updateHarvestStatus($harvest, $status);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $harvest=Harvest::where('id',$id);
        
        return $harvest->delete();
    }
}
