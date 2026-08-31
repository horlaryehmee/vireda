<?php

namespace Tests\Feature;

use App\Mail\BookingConfirmation;
use App\Mail\NewBookingNotification;
use App\Models\AvailabilitySchedule;
use App\Models\Booking;
use App\Models\BookingSetting;
use App\Models\EmailSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class BookingSystemTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->travelTo(Carbon::parse('2026-09-01 07:00:00', 'UTC'));
        BookingSetting::query()->create([
            'timezone' => 'Africa/Lagos',
            'slot_duration' => 30,
            'buffer_minutes' => 0,
            'minimum_notice_hours' => 0,
            'booking_window_days' => 60,
            'admin_email' => 'bookings@vireda.test',
        ]);
        AvailabilitySchedule::query()->create([
            'day_of_week' => 3,
            'is_available' => true,
            'start_time' => '09:00',
            'end_time' => '11:00',
        ]);
    }

    public function test_booking_page_and_available_slots_are_public(): void
    {
        $this->get('/book')->assertOk();

        $this->getJson('/booking/availability?date=2026-09-02')
            ->assertOk()
            ->assertJsonPath('timezone', 'Africa/Lagos')
            ->assertJsonCount(4, 'slots')
            ->assertJsonPath('slots.0.time', '09:00');
    }

    public function test_customer_can_book_and_both_notifications_are_sent(): void
    {
        Mail::fake();

        $response = $this->postJson('/bookings', $this->validBooking());

        $response->assertCreated()->assertJsonPath('message', 'Your discovery call is confirmed.');
        $this->assertDatabaseHas('bookings', [
            'email' => 'client@example.com',
            'status' => 'confirmed',
            'notification_status' => 'sent',
        ]);
        Mail::assertSent(BookingConfirmation::class, fn ($mail) => $mail->hasTo('client@example.com'));
        Mail::assertSent(NewBookingNotification::class, fn ($mail) => $mail->hasTo('bookings@vireda.test'));
    }

    public function test_a_slot_cannot_be_double_booked(): void
    {
        Mail::fake();
        $this->postJson('/bookings', $this->validBooking())->assertCreated();

        $this->postJson('/bookings', [
            ...$this->validBooking(),
            'email' => 'another@example.com',
        ])->assertUnprocessable()->assertJsonPath('message', 'That time is no longer available. Please choose another slot.');

        $this->assertSame(1, Booking::query()->count());
    }

    public function test_only_administrators_can_access_booking_admin(): void
    {
        $regular = User::factory()->create();
        $admin = User::factory()->create(['is_admin' => true]);

        $this->get('/admin')->assertRedirect('/admin/login');
        $this->actingAs($regular)->get('/admin')->assertForbidden();
        $this->actingAs($admin)->get('/admin')->assertOk();
        $this->actingAs($admin)->getJson('/admin/api/dashboard')->assertOk()->assertJsonStructure(['stats', 'bookings']);
    }

    public function test_admin_can_update_availability_and_encrypted_smtp_settings(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $days = collect(range(0, 6))->map(fn ($day) => [
            'day_of_week' => $day,
            'is_available' => $day >= 1 && $day <= 5,
            'start_time' => '08:30',
            'end_time' => '16:30',
        ])->all();

        $this->actingAs($admin)->putJson('/admin/api/schedule', ['days' => $days])->assertOk();
        $this->assertDatabaseHas('availability_schedules', ['day_of_week' => 1, 'start_time' => '08:30']);

        $this->actingAs($admin)->putJson('/admin/api/email-settings', [
            'mailer' => 'smtp',
            'host' => 'smtp.example.com',
            'port' => 587,
            'username' => 'mailer@example.com',
            'password' => 'super-secret-password',
            'encryption' => 'tls',
            'from_address' => 'hello@example.com',
            'from_name' => 'Viredá',
        ])->assertOk();

        $this->assertSame('super-secret-password', EmailSetting::current()->password);
        $this->assertNotSame('super-secret-password', DB::table('email_settings')->value('password'));
        $this->actingAs($admin)->getJson('/admin/api/settings')
            ->assertOk()
            ->assertJsonMissing(['password' => 'super-secret-password'])
            ->assertJsonPath('email.has_password', true);
    }

    private function validBooking(): array
    {
        return [
            'date' => '2026-09-02',
            'time' => '09:00',
            'name' => 'Ada Client',
            'email' => 'client@example.com',
            'phone' => '+234 801 234 5678',
            'company' => 'Example Limited',
            'service' => 'AI & Automation',
            'notes' => 'We need help improving a manual process across our team.',
            'privacy' => true,
            'website' => '',
        ];
    }
}
