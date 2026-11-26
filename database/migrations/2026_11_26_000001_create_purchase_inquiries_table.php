<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('farmer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('harvest_id')->nullable()->constrained('harvests')->nullOnDelete();
            $table->foreignId('quantity_standard_id')->nullable()->constrained('product_quantities')->nullOnDelete();
            
            $table->string('status')->default('pending')->index();
            $table->decimal('initial_quantity', 12, 2);
            $table->decimal('initial_price', 12, 2);
            $table->decimal('current_quantity', 12, 2);
            $table->decimal('current_price', 12, 2);
            
            $table->string('delivery_zone')->nullable();
            $table->date('desired_delivery_date')->nullable();
            $table->text('notes')->nullable();
            
            $table->timestamps();
        });

        Schema::create('inquiry_negotiations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_inquiry_id')->constrained('purchase_inquiries')->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->string('sender_role')->default('buyer');
            $table->decimal('proposed_price', 12, 2);
            $table->decimal('proposed_quantity', 12, 2);
            $table->date('proposed_delivery_date')->nullable();
            $table->text('message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiry_negotiations');
        Schema::dropIfExists('purchase_inquiries');
    }
};
