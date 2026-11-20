<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('harvest_daily_capacities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('harvest_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->decimal('reserved_quantity', 8, 2)->default(0);
            $table->timestamps();

            $table->unique(['harvest_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('harvest_daily_capacities');
    }
};
