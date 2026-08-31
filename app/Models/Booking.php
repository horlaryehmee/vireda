<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'reference', 'slot_key', 'name', 'email', 'phone', 'company', 'service', 'notes', 'scheduled_at',
    'timezone', 'duration_minutes', 'status', 'notification_status', 'notification_error',
])]
class Booking extends Model
{
    protected function casts(): array
    {
        return ['scheduled_at' => 'datetime'];
    }
}
