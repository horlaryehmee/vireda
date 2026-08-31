<?php

namespace App\Services;

use App\Models\AvailabilityOverride;
use App\Models\AvailabilitySchedule;
use App\Models\Booking;
use App\Models\BookingSetting;
use Carbon\CarbonImmutable;

class AvailabilityService
{
    public function slotsForDate(string $date): array
    {
        $settings = BookingSetting::current();
        $timezone = $settings->timezone;
        $day = CarbonImmutable::createFromFormat('Y-m-d', $date, $timezone)->startOfDay();
        $earliest = CarbonImmutable::now($timezone)->addHours($settings->minimum_notice_hours);
        $latest = CarbonImmutable::now($timezone)->addDays($settings->booking_window_days)->endOfDay();

        if ($day->endOfDay()->lt($earliest) || $day->gt($latest)) {
            return [];
        }

        $override = AvailabilityOverride::query()->whereDate('date', $date)->first();
        $schedule = AvailabilitySchedule::query()->where('day_of_week', $day->dayOfWeek)->first();

        if ($override) {
            if (! $override->is_available || ! $override->start_time || ! $override->end_time) {
                return [];
            }
            [$startTime, $endTime] = [$override->start_time, $override->end_time];
        } elseif ($schedule?->is_available) {
            [$startTime, $endTime] = [$schedule->start_time, $schedule->end_time];
        } else {
            return [];
        }

        $cursor = CarbonImmutable::parse("{$date} {$startTime}", $timezone);
        $end = CarbonImmutable::parse("{$date} {$endTime}", $timezone);
        $step = $settings->slot_duration + $settings->buffer_minutes;
        $bookings = Booking::query()
            ->whereIn('status', ['confirmed', 'pending'])
            ->whereBetween('scheduled_at', [$day->utc(), $day->endOfDay()->utc()])
            ->get();
        $slots = [];

        while ($cursor->addMinutes($settings->slot_duration)->lte($end)) {
            $slotEnd = $cursor->addMinutes($settings->slot_duration);
            $hasConflict = $bookings->contains(function (Booking $booking) use ($cursor, $slotEnd, $settings) {
                $bookedStart = CarbonImmutable::instance($booking->scheduled_at)->setTimezone('UTC');
                $bookedEnd = $bookedStart->addMinutes($booking->duration_minutes + $settings->buffer_minutes);

                return $cursor->utc()->lt($bookedEnd) && $slotEnd->utc()->gt($bookedStart);
            });

            if ($cursor->gte($earliest) && ! $hasConflict) {
                $slots[] = [
                    'time' => $cursor->format('H:i'),
                    'label' => $cursor->format('g:i A'),
                ];
            }

            $cursor = $cursor->addMinutes($step);
        }

        return $slots;
    }

    public function slotIsAvailable(string $date, string $time): bool
    {
        return collect($this->slotsForDate($date))->contains('time', $time);
    }
}
