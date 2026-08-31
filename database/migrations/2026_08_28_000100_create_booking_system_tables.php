<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false)->after('password');
        });

        Schema::create('availability_schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('day_of_week')->unique();
            $table->boolean('is_available')->default(false);
            $table->time('start_time')->default('09:00');
            $table->time('end_time')->default('17:00');
            $table->timestamps();
        });

        Schema::create('availability_overrides', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();
            $table->boolean('is_available')->default(false);
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('note')->nullable();
            $table->timestamps();
        });

        Schema::create('booking_settings', function (Blueprint $table) {
            $table->id();
            $table->string('timezone')->default('Africa/Lagos');
            $table->unsignedSmallInteger('slot_duration')->default(30);
            $table->unsignedSmallInteger('buffer_minutes')->default(0);
            $table->unsignedSmallInteger('minimum_notice_hours')->default(12);
            $table->unsignedSmallInteger('booking_window_days')->default(60);
            $table->string('admin_email')->default('info@vireda.co.uk');
            $table->timestamps();
        });

        Schema::create('email_settings', function (Blueprint $table) {
            $table->id();
            $table->string('mailer')->default('log');
            $table->string('host')->nullable();
            $table->unsignedSmallInteger('port')->nullable();
            $table->string('username')->nullable();
            $table->text('password')->nullable();
            $table->string('encryption')->nullable();
            $table->string('from_address')->nullable();
            $table->string('from_name')->default('Viredá');
            $table->timestamps();
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->uuid('reference')->unique();
            $table->string('slot_key')->nullable()->unique();
            $table->string('name');
            $table->string('email');
            $table->string('phone', 40);
            $table->string('company')->nullable();
            $table->string('service')->nullable();
            $table->text('notes')->nullable();
            $table->dateTime('scheduled_at');
            $table->string('timezone')->default('Africa/Lagos');
            $table->unsignedSmallInteger('duration_minutes')->default(30);
            $table->string('status')->default('confirmed');
            $table->string('notification_status')->default('pending');
            $table->text('notification_error')->nullable();
            $table->timestamps();
            $table->index(['scheduled_at', 'status']);
            $table->index(['email', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('email_settings');
        Schema::dropIfExists('booking_settings');
        Schema::dropIfExists('availability_overrides');
        Schema::dropIfExists('availability_schedules');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_admin');
        });
    }
};
