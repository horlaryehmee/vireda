<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('booking:create-admin', function () {
    $name = $this->ask('Administrator name', 'Viredá Admin');
    $email = $this->ask('Administrator email');
    $password = $this->secret('Password (minimum 12 characters)');
    $confirmation = $this->secret('Confirm password');

    $validator = validator(compact('name', 'email', 'password'), [
        'name' => ['required', 'string', 'max:120'],
        'email' => ['required', 'email:rfc', 'max:190'],
        'password' => ['required', 'string', 'min:12'],
    ]);

    if ($validator->fails() || $password !== $confirmation) {
        foreach ($validator->errors()->all() as $error) {
            $this->error($error);
        }
        if ($password !== $confirmation) {
            $this->error('The password confirmation does not match.');
        }

        return 1;
    }

    User::query()->updateOrCreate(['email' => strtolower($email)], [
        'name' => $name,
        'password' => $password,
        'is_admin' => true,
    ]);

    $this->info("Administrator access is ready for {$email}.");

    return 0;
})->purpose('Create or update a booking administrator account');
