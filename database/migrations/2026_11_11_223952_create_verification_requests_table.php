
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('verification_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            /*
             * Nullable unique key:
             * Active requests contain the user ID.
             * Finalized requests contain NULL.
             *
             * This enforces one active request per user
             * at database level.
             */
            $table->unsignedBigInteger('active_user_id')
                ->nullable()
                ->unique();

            $table->string('status', 50)
                ->default('pending')
                ->index();

            $table->string('account_type', 50)
                ->index();

            $table->text('admin_notes')
                ->nullable();

            $table->text('rejection_reason')
                ->nullable();

            $table->text('requested_information')
                ->nullable();

            $table->timestamp('submitted_at')
                ->nullable();

            $table->timestamp('reviewed_at')
                ->nullable();

            $table->timestamp('approved_at')
                ->nullable();

            $table->timestamps();

            $table->index(
                ['user_id', 'status'],
                'verification_user_status_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verification_requests');
    }
};
