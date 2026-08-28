<?php

namespace Tests\Feature;

use App\Mail\ContactEnquiry;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactPageTest extends TestCase
{
    public function test_contact_and_privacy_pages_are_available(): void
    {
        $this->get('/contact')->assertOk();
        $this->get('/privacy-policy')->assertOk();
    }

    public function test_a_valid_contact_enquiry_is_sent(): void
    {
        Mail::fake();

        $this->postJson('/contact', [
            'name' => 'Ada Example',
            'email' => 'ada@example.com',
            'country_code' => '+234',
            'phone' => '803 555 0199',
            'service' => 'AI & Automation',
            'message' => 'We would like to discuss automating our customer onboarding process.',
            'privacy' => true,
            'human_answer' => 5,
            'website' => '',
        ])->assertOk()
            ->assertJsonPath('message', "Thanks, Ada Example. We'll get back to you within 24 hours.");

        Mail::assertSent(ContactEnquiry::class, function (ContactEnquiry $mail) {
            return $mail->hasTo('hello@vireda.com')
                && $mail->hasReplyTo('ada@example.com');
        });
    }

    public function test_contact_enquiries_require_consent_and_human_verification(): void
    {
        Mail::fake();

        $this->postJson('/contact', [
            'name' => 'Ada Example',
            'email' => 'ada@example.com',
            'country_code' => '+234',
            'phone' => '803 555 0199',
            'service' => 'Not Sure Yet',
            'message' => 'This is a genuine enquiry with enough detail.',
            'privacy' => false,
            'human_answer' => 4,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['privacy', 'human_answer']);

        Mail::assertNothingSent();
    }
}
