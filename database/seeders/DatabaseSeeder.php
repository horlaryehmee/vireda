<?php

namespace Database\Seeders;

use App\Models\AvailabilitySchedule;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach (range(0, 6) as $day) {
            AvailabilitySchedule::query()->firstOrCreate(['day_of_week' => $day], [
                'is_available' => $day >= 1 && $day <= 5,
                'start_time' => '09:00',
                'end_time' => '17:00',
            ]);
        }

        if (filled(env('ADMIN_PASSWORD'))) {
            User::query()->updateOrCreate(
                ['email' => env('ADMIN_EMAIL', 'admin@vireda.com')],
                [
                    'name' => env('ADMIN_NAME', 'Viredá Admin'),
                    'password' => env('ADMIN_PASSWORD'),
                    'is_admin' => true,
                ],
            );
        }
    }
}
