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

        $response = $this->withSession([
            'contact_challenge' => [
                'expression' => '7 - 2',
                'answer' => 5,
                'issued_at' => now()->timestamp,
            ],
        ])->postJson('/contact', [
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

        $response->assertSessionMissing('contact_challenge');

        Mail::assertSent(ContactEnquiry::class, function (ContactEnquiry $mail) {
            return $mail->hasTo('info@vireda.co.uk')
                && $mail->hasReplyTo('ada@example.com');
        });
    }

    public function test_contact_enquiries_require_consent_and_human_verification(): void
    {
        Mail::fake();

        $this->withSession([
            'contact_challenge' => [
                'expression' => '7 - 2',
                'answer' => 5,
                'issued_at' => now()->timestamp,
            ],
        ])->postJson('/contact', [
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

    public function test_each_challenge_request_returns_a_new_question_without_the_answer(): void
    {
        $first = $this->getJson('/contact/challenge')
            ->assertOk()
            ->assertJsonStructure(['challenge', 'expires_in'])
            ->assertJsonMissing(['answer']);

        $second = $this->getJson('/contact/challenge')
            ->assertOk()
            ->assertJsonMissing(['answer']);

        $this->assertNotSame($first->json('challenge'), $second->json('challenge'));
    }

    public function test_an_expired_challenge_cannot_send_an_enquiry(): void
    {
        Mail::fake();

        $this->withSession([
            'contact_challenge' => [
                'expression' => '7 - 2',
                'answer' => 5,
                'issued_at' => now()->subMinutes(31)->timestamp,
            ],
        ])->postJson('/contact', [
            'name' => 'Ada Example',
            'email' => 'ada@example.com',
            'country_code' => '+234',
            'phone' => '803 555 0199',
            'service' => 'AI & Automation',
            'message' => 'We would like to discuss automating our customer onboarding process.',
            'privacy' => true,
            'human_answer' => 5,
            'website' => '',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('human_answer');

        Mail::assertNothingSent();
    }
}
