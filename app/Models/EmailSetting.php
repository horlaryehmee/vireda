<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['mailer', 'host', 'port', 'username', 'password', 'encryption', 'from_address', 'from_name'])]
class EmailSetting extends Model
{
    protected function casts(): array
    {
        return ['password' => 'encrypted'];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate([], [
            'mailer' => config('mail.default', 'log'),
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'username' => config('mail.mailers.smtp.username'),
            'from_address' => config('mail.from.address'),
            'from_name' => config('mail.from.name', 'Viredá'),
        ]);
    }
}
