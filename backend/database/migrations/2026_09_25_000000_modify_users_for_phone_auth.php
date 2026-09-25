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
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
            // In a real scenario, we might want to change unique constraints, but we can't easily alter unique index without its name.
            // Let's assume phone isn't unique yet or we make it unique
            $table->string('phone')->unique()->change();
            $table->string('password')->nullable()->change();
            
            $table->string('otp_code')->nullable();
            $table->timestamp('otp_expires_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
            $table->dropUnique(['phone']);
            $table->string('password')->nullable(false)->change();
            $table->dropColumn(['otp_code', 'otp_expires_at']);
        });
    }
};
