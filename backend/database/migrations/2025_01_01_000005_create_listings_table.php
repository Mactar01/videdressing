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
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('category_id')->constrained();
            $table->foreignId('address_id')->nullable()->constrained()->nullOnDelete();
            $table->json('title');
            $table->json('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->char('currency', 3)->default('EUR');
            $table->enum('condition', ['new', 'like_new', 'good', 'fair', 'poor']);
            $table->enum('status', ['draft', 'active', 'sold', 'archived', 'banned'])->default('draft');
            $table->string('city', 100)->nullable();
            $table->string('zip_code', 20)->nullable();
            $table->char('country_code', 2)->default('FR');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('favorites_count')->default(0);
            $table->timestamp('boosted_until')->nullable();
            $table->timestamp('sold_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
            
            $table->index('status');
            $table->index('category_id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
