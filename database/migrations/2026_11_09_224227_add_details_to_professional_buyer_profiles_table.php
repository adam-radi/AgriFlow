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
        Schema::table(
            'professional_buyer_profiles',
            function (Blueprint $table) {
                $table->string('business_name')->nullable();

                $table->string('business_type')->nullable();

                $table->string('ice', 30)
                    ->nullable()
                    ->unique();

                $table->string('address')->nullable();

                $table->string('city')->nullable();

                $table->string('region')->nullable();
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('professional_buyer_profiles', function (Blueprint $table) {
                $table->dropUnique(['ice']);

                $table->dropColumn([
                    'business_name',
                    'business_type',
                    'ice',
                    'address',
                    'city',
                    'region',
                ]);
        });
    }
};
