<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['timezone', 'slot_duration', 'buffer_minutes', 'minimum_notice_hours', 'booking_window_days', 'admin_email'])]
class BookingSetting extends Model
{
    public static function current(): self
    {
        return static::query()->firstOrCreate([], [
            'timezone' => config('booking.default_timezone', 'Africa/Lagos'),
            'admin_email' => config('mail.contact_to', 'info@vireda.co.uk'),
        ]);
    }
}
