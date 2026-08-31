<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['date', 'is_available', 'start_time', 'end_time', 'note'])]
class AvailabilityOverride extends Model
{
    protected function casts(): array
    {
        return ['date' => 'date:Y-m-d', 'is_available' => 'boolean'];
    }
}
