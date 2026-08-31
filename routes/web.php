<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BookingAdminController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app');
});

Route::get('/services', function () {
    return view('app');
});

Route::get('/about', function () {
    return view('app');
});

Route::get('/contact', function () {
    return view('app');
});

Route::get('/book', function () {
    return view('app');
});

Route::get('/admin/login', function () {
    return view('app');
})->name('login');

Route::get('/admin', function () {
    return view('app');
})->middleware(['auth', 'admin']);

Route::get('/privacy-policy', function () {
    return view('app');
});

Route::get('/contact/challenge', [ContactController::class, 'challenge'])->middleware('throttle:20,1');
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1');

Route::get('/booking/settings', [BookingController::class, 'settings']);
Route::get('/booking/calendar', [BookingController::class, 'calendar']);
Route::get('/booking/availability', [BookingController::class, 'availability']);
Route::post('/bookings', [BookingController::class, 'store'])->middleware('throttle:8,1');

Route::prefix('admin/api')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/dashboard', [BookingAdminController::class, 'dashboard']);
        Route::get('/settings', [BookingAdminController::class, 'settings']);
        Route::put('/booking-settings', [BookingAdminController::class, 'updateBookingSettings']);
        Route::put('/schedule', [BookingAdminController::class, 'updateSchedule']);
        Route::post('/overrides', [BookingAdminController::class, 'storeOverride']);
        Route::delete('/overrides/{override}', [BookingAdminController::class, 'destroyOverride']);
        Route::patch('/bookings/{booking}', [BookingAdminController::class, 'updateBooking']);
        Route::put('/email-settings', [BookingAdminController::class, 'updateEmailSettings']);
        Route::post('/email-settings/test', [BookingAdminController::class, 'testEmail']);
    });
});
