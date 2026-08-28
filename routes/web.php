<?php

use App\Mail\ContactEnquiry;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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

Route::get('/privacy-policy', function () {
    return view('app');
});

Route::post('/contact', function (Request $request) {
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:120'],
        'email' => ['required', 'email:rfc', 'max:190'],
        'country_code' => ['required', 'string', 'max:8', 'regex:/^\+[0-9]{1,4}$/'],
        'phone' => ['required', 'string', 'max:30', 'regex:/^[0-9()\s.\-]{6,30}$/'],
        'service' => ['required', 'string', 'in:Web Development and UX,Branding & Creative,AI & Automation,Software & Digital Products,Data and Analytics,Business Management Consulting,Multiple Services,Not Sure Yet'],
        'message' => ['required', 'string', 'min:10', 'max:5000'],
        'privacy' => ['accepted'],
        'human_answer' => ['required', 'integer', 'in:5'],
        'website' => ['nullable', 'size:0'],
    ]);

    Mail::to(config('mail.contact_to', 'hello@vireda.com'))
        ->send(new ContactEnquiry($validated));

    return response()->json([
        'message' => "Thanks, {$validated['name']}. We'll get back to you within 24 hours.",
    ]);
})->middleware('throttle:5,1');
