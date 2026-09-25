<?php

namespace App\Http\Controllers;

use App\Mail\ContactEnquiry;
use App\Services\DynamicMailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request, DynamicMailService $mail): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:190'],
            'country_code' => ['required', 'string', 'max:8', 'regex:/^\+[0-9]{1,4}$/'],
            'phone' => ['required', 'string', 'max:30', 'regex:/^[0-9()\s.\-]{6,30}$/'],
            'service' => ['required', 'string', 'in:Web Development and UX,Branding & Creative,AI & Automation,Software & Digital Products,Data and Analytics,Business Management Consulting,Multiple Services,Not Sure Yet'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'privacy' => ['accepted'],
            'website' => ['nullable', 'size:0'],
        ]);

        $enquiry = collect($validated)->except('website')->all();

        $mail->configure();
        Mail::to(config('mail.contact_to', 'info@vireda.co.uk'))
            ->send(new ContactEnquiry($enquiry));

        return response()->json([
            'message' => "Thanks, {$validated['name']}. We'll get back to you within 24 hours.",
        ]);
    }

}
