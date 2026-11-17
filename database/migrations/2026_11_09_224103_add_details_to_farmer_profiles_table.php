<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
           Schema::table('farmer_profiles', function (Blueprint $table) {
            $table->string('farm_name')->nullable();
            $table->text('description')->nullable();

            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farmer_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'farm_name',
                'description',
                'address',
                'city',
                'region',
            ]);
        });
    }
};
