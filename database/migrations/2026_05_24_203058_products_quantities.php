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
        Schema::create('product_quantities', function(Blueprint $table){
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('label')->notNull();
            $table->decimal('price', 8, 2)->check('price > 0');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.array
     */
    public function down(): void
    {
        Schema::dropIfExists('productQuantities');
    }
};
