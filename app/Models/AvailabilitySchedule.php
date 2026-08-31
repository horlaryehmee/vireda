<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['day_of_week', 'is_available', 'start_time', 'end_time'])]
class AvailabilitySchedule extends Model
{
    protected function casts(): array
    {
        return ['is_available' => 'boolean'];
    }
}
