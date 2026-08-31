<?php

namespace App\Http\Controllers;

use App\Mail\BookingConfirmation;
use App\Mail\NewBookingNotification;
use App\Models\Booking;
use App\Models\BookingSetting;
use App\Services\AvailabilityService;
use App\Services\DynamicMailService;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use DateTimeZone;

class BookingController extends Controller
{
    public function availability(Request $request, AvailabilityService $availability): JsonResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date_format:Y-m-d'],
            'timezone' => ['nullable', 'string', function (string $attribute, mixed $value, \Closure $fail) {
                if (! in_array($value, DateTimeZone::listIdentifiers(), true)) {
                    $fail('Please select a valid timezone.');
                }
            }],
        ]);
        $settings = BookingSetting::current();
        $displayTimezone = $validated['timezone'] ?? $settings->timezone;
        $slots = collect($availability->slotsForDate($validated['date']))->map(function (array $slot) use ($validated, $settings, $displayTimezone) {
            $localTime = CarbonImmutable::createFromFormat(
                'Y-m-d H:i',
                "{$validated['date']} {$slot['time']}",
                $settings->timezone,
            )->setTimezone($displayTimezone);

            return [
                ...$slot,
                'label' => $localTime->format('g:i A'),
                'date_label' => $localTime->format('l, j F Y'),
            ];
        })->values();

        return response()->json([
            'date' => $validated['date'],
            'timezone' => $displayTimezone,
            'duration' => $settings->slot_duration,
            'slots' => $slots,
        ]);
    }

    public function settings(): JsonResponse
    {
        $settings = BookingSetting::current();

        return response()->json([
            'timezone' => $settings->timezone,
            'duration' => $settings->slot_duration,
            'minimum_notice_hours' => $settings->minimum_notice_hours,
            'booking_window_days' => $settings->booking_window_days,
            'timezones' => DateTimeZone::listIdentifiers(),
        ]);
    }

    public function calendar(Request $request, AvailabilityService $availability): JsonResponse
    {
        $validated = $request->validate(['month' => ['required', 'date_format:Y-m']]);
        $settings = BookingSetting::current();
        $start = CarbonImmutable::createFromFormat('Y-m-d', $validated['month'].'-01', $settings->timezone);
        $dates = [];

        for ($day = $start; $day->month === $start->month; $day = $day->addDay()) {
            if ($availability->slotsForDate($day->format('Y-m-d')) !== []) {
                $dates[] = $day->format('Y-m-d');
            }
        }

        return response()->json(['month' => $validated['month'], 'dates' => $dates]);
    }

    public function store(Request $request, AvailabilityService $availability, DynamicMailService $mail): JsonResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date_format:Y-m-d'],
            'time' => ['required', 'date_format:H:i'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:190'],
            'phone' => ['required', 'string', 'max:40'],
            'company' => ['nullable', 'string', 'max:160'],
            'service' => ['nullable', 'string', 'max:160'],
            'notes' => ['nullable', 'string', 'max:3000'],
            'privacy' => ['accepted'],
            'website' => ['nullable', 'size:0'],
            'timezone' => ['nullable', 'string', function (string $attribute, mixed $value, \Closure $fail) {
                if (! in_array($value, DateTimeZone::listIdentifiers(), true)) {
                    $fail('Please select a valid timezone.');
                }
            }],
        ]);
        $settings = BookingSetting::current();
        $bookingTimezone = $validated['timezone'] ?? $settings->timezone;

        if (! $availability->slotIsAvailable($validated['date'], $validated['time'])) {
            return response()->json(['message' => 'That time is no longer available. Please choose another slot.'], 422);
        }

        $scheduledAt = CarbonImmutable::createFromFormat(
            'Y-m-d H:i',
            "{$validated['date']} {$validated['time']}",
            $settings->timezone,
        )->utc();

        try {
            $booking = DB::transaction(fn () => Booking::query()->create([
                'reference' => 'VRD-'.strtoupper(Str::random(8)),
                'slot_key' => $scheduledAt->format('Y-m-d H:i:s'),
                'name' => $validated['name'],
                'email' => strtolower($validated['email']),
                'phone' => $validated['phone'],
                'company' => $validated['company'] ?? null,
                'service' => $validated['service'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'scheduled_at' => $scheduledAt,
                'timezone' => $bookingTimezone,
                'duration_minutes' => $settings->slot_duration,
                'status' => 'confirmed',
            ]));
        } catch (QueryException $exception) {
            if (in_array($exception->getCode(), ['23000', '23505'], true)) {
                return response()->json(['message' => 'That time was just booked. Please choose another slot.'], 422);
            }

            throw $exception;
        }

        try {
            $mail->configure();
            Mail::to($booking->email)->send(new BookingConfirmation($booking));
            Mail::to($settings->admin_email)->send(new NewBookingNotification($booking));
            $booking->update(['notification_status' => 'sent', 'notification_error' => null]);
        } catch (\Throwable $exception) {
            report($exception);
            $booking->update([
                'notification_status' => 'failed',
                'notification_error' => Str::limit($exception->getMessage(), 1000),
            ]);
        }

        return response()->json([
            'message' => 'Your discovery call is confirmed.',
            'booking' => [
                'reference' => $booking->reference,
                'scheduled_at' => $booking->scheduled_at->toIso8601String(),
                'timezone' => $booking->timezone,
                'duration' => $booking->duration_minutes,
            ],
        ], 201);
    }
}
