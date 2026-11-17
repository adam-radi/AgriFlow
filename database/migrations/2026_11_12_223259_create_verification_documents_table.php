
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('verification_documents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('verification_request_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('uploaded_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('document_type', 100);

            $table->string('original_name');

            $table->string('disk', 50)
                ->default('private');

            $table->string('file_path');

            $table->string('mime_type', 100);

            $table->unsignedBigInteger('file_size');

            $table->string('checksum', 64)
                ->nullable();

            $table->timestamps();

            $table->index(
                'verification_request_id',
                'verification_documents_request_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verification_documents');
    }
};
