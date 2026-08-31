<?php

namespace App\Services;

use App\Models\EmailSetting;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;

class DynamicMailService
{
    public function configure(): EmailSetting
    {
        $settings = Schema::hasTable('email_settings')
            ? EmailSetting::current()
            : new EmailSetting([
                'mailer' => config('mail.default', 'log'),
                'host' => config('mail.mailers.smtp.host'),
                'port' => config('mail.mailers.smtp.port'),
                'username' => config('mail.mailers.smtp.username'),
                'from_address' => config('mail.from.address'),
                'from_name' => config('mail.from.name', 'Viredá'),
            ]);

        config([
            'mail.default' => $settings->mailer,
            'mail.from.address' => $settings->from_address ?: config('mail.from.address'),
            'mail.from.name' => $settings->from_name ?: config('mail.from.name'),
        ]);

        if ($settings->mailer === 'smtp') {
            config([
                'mail.mailers.smtp.host' => $settings->host,
                'mail.mailers.smtp.port' => $settings->port,
                'mail.mailers.smtp.username' => $settings->username,
                'mail.mailers.smtp.password' => $settings->password,
                'mail.mailers.smtp.scheme' => match ($settings->encryption) {
                    'ssl' => 'smtps',
                    'tls' => 'smtp',
                    default => null,
                },
            ]);
            Mail::purge('smtp');
        }

        return $settings;
    }
}
