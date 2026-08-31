<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\SmtpTestMessage;
use App\Models\AvailabilityOverride;
use App\Models\AvailabilitySchedule;
use App\Models\Booking;
use App\Models\BookingSetting;
use App\Models\EmailSetting;
use App\Services\DynamicMailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class BookingAdminController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $query = Booking::query()->latest('scheduled_at');

        if ($request->filled('status') && $request->string('status')->value() !== 'all') {
            $query->where('status', $request->string('status')->value());
        }

        return response()->json([
            'stats' => [
                'upcoming' => Booking::query()->where('scheduled_at', '>=', now())->where('status', 'confirmed')->count(),
                'this_month' => Booking::query()->whereBetween('scheduled_at', [now()->startOfMonth(), now()->endOfMonth()])->count(),
                'completed' => Booking::query()->where('status', 'completed')->count(),
                'total' => Booking::query()->count(),
                'notification_issues' => Booking::query()->where('notification_status', 'failed')->count(),
            ],
            'bookings' => $query->paginate(30),
            'timezone' => BookingSetting::current()->timezone,
        ]);
    }

    public function settings(): JsonResponse
    {
        $booking = BookingSetting::current();
        $email = EmailSetting::current();

        return response()->json([
            'booking' => $booking,
            'email' => [
                ...$email->only('mailer', 'host', 'port', 'username', 'encryption', 'from_address', 'from_name'),
                'has_password' => filled($email->password),
            ],
            'schedule' => AvailabilitySchedule::query()->orderBy('day_of_week')->get(),
            'overrides' => AvailabilityOverride::query()->whereDate('date', '>=', today())->orderBy('date')->get(),
        ]);
    }

    public function updateBookingSettings(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'timezone' => ['required', 'timezone:all'],
            'slot_duration' => ['required', 'integer', Rule::in([15, 30, 45, 60, 90])],
            'buffer_minutes' => ['required', 'integer', 'min:0', 'max:60'],
            'minimum_notice_hours' => ['required', 'integer', 'min:0', 'max:336'],
            'booking_window_days' => ['required', 'integer', 'min:1', 'max:365'],
            'admin_email' => ['required', 'email:rfc', 'max:190'],
        ]);

        BookingSetting::current()->update($validated);

        return response()->json(['message' => 'Booking settings saved.']);
    }

    public function updateSchedule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'days' => ['required', 'array', 'size:7'],
            'days.*.day_of_week' => ['required', 'integer', 'between:0,6', 'distinct'],
            'days.*.is_available' => ['required', 'boolean'],
            'days.*.start_time' => ['required', 'date_format:H:i'],
            'days.*.end_time' => ['required', 'date_format:H:i', 'after:days.*.start_time'],
        ]);

        foreach ($validated['days'] as $day) {
            AvailabilitySchedule::query()->updateOrCreate(['day_of_week' => $day['day_of_week']], $day);
        }

        return response()->json(['message' => 'Weekly availability saved.']);
    }

    public function storeOverride(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'is_available' => ['required', 'boolean'],
            'start_time' => ['nullable', 'required_if:is_available,true', 'date_format:H:i'],
            'end_time' => ['nullable', 'required_if:is_available,true', 'date_format:H:i', 'after:start_time'],
            'note' => ['nullable', 'string', 'max:190'],
        ]);

        AvailabilityOverride::query()->updateOrCreate(['date' => $validated['date']], $validated);

        return response()->json(['message' => 'Date override saved.']);
    }

    public function destroyOverride(AvailabilityOverride $override): JsonResponse
    {
        $override->delete();

        return response()->json(['message' => 'Date override removed.']);
    }

    public function updateBooking(Request $request, Booking $booking): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['confirmed', 'completed', 'cancelled', 'no_show'])],
        ]);

        $booking->update([
            'status' => $validated['status'],
            'slot_key' => $validated['status'] === 'cancelled' ? null : $booking->scheduled_at->format('Y-m-d H:i:s'),
        ]);

        return response()->json(['message' => 'Booking status updated.']);
    }

    public function updateEmailSettings(Request $request, DynamicMailService $mail): JsonResponse
    {
        $validated = $request->validate([
            'mailer' => ['required', Rule::in(['smtp', 'log'])],
            'host' => ['nullable', 'required_if:mailer,smtp', 'string', 'max:190'],
            'port' => ['nullable', 'required_if:mailer,smtp', 'integer', 'between:1,65535'],
            'username' => ['nullable', 'string', 'max:190'],
            'password' => ['nullable', 'string', 'max:500'],
            'encryption' => ['nullable', Rule::in(['tls', 'ssl'])],
            'from_address' => ['required', 'email:rfc', 'max:190'],
            'from_name' => ['required', 'string', 'max:120'],
        ]);
        $settings = EmailSetting::current();

        if (blank($validated['password'] ?? null)) {
            unset($validated['password']);
        }

        $settings->update($validated);
        $mail->configure();

        return response()->json(['message' => 'Email settings saved securely.']);
    }

    public function testEmail(Request $request, DynamicMailService $mail): JsonResponse
    {
        $mail->configure();
        Mail::to($request->user()->email)->send(new SmtpTestMessage);

        return response()->json(['message' => "Test email sent to {$request->user()->email}."]);
    }
}
