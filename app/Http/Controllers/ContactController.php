<?php

namespace App\Http\Controllers;

use App\Mail\ContactEnquiry;
use App\Services\DynamicMailService;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    private const CHALLENGE_LIFETIME_SECONDS = 1800;

    public function challenge(Request $request): JsonResponse
    {
        $previousExpression = $request->session()->get('contact_challenge.expression');
        $challenge = $this->makeChallenge($previousExpression);

        $request->session()->put('contact_challenge', [
            ...$challenge,
            'issued_at' => now()->timestamp,
        ]);

        return response()
            ->json([
                'challenge' => $challenge['expression'],
                'expires_in' => self::CHALLENGE_LIFETIME_SECONDS,
            ])
            ->header('Cache-Control', 'no-store, private');
    }

    public function store(Request $request, DynamicMailService $mail): JsonResponse
    {
        $challenge = $request->session()->get('contact_challenge');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:190'],
            'country_code' => ['required', 'string', 'max:8', 'regex:/^\+[0-9]{1,4}$/'],
            'phone' => ['required', 'string', 'max:30', 'regex:/^[0-9()\s.\-]{6,30}$/'],
            'service' => ['required', 'string', 'in:Web Development and UX,Branding & Creative,AI & Automation,Software & Digital Products,Data and Analytics,Business Management Consulting,Multiple Services,Not Sure Yet'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'privacy' => ['accepted'],
            'human_answer' => [
                'required',
                'integer',
                function (string $attribute, mixed $value, Closure $fail) use ($challenge): void {
                    $isValid = is_array($challenge)
                        && isset($challenge['answer'], $challenge['issued_at'])
                        && now()->timestamp - (int) $challenge['issued_at'] <= self::CHALLENGE_LIFETIME_SECONDS
                        && (int) $value === (int) $challenge['answer'];

                    if (! $isValid) {
                        $fail('The human verification answer is incorrect or has expired.');
                    }
                },
            ],
            'website' => ['nullable', 'size:0'],
        ]);

        // A successful challenge can only be used once, even if the request is replayed.
        $request->session()->forget('contact_challenge');

        $enquiry = collect($validated)->except(['human_answer', 'website'])->all();

        $mail->configure();
        Mail::to(config('mail.contact_to', 'info@vireda.co.uk'))
            ->send(new ContactEnquiry($enquiry));

        return response()->json([
            'message' => "Thanks, {$validated['name']}. We'll get back to you within 24 hours.",
        ]);
    }

    /**
     * @return array{expression: string, answer: int}
     */
    private function makeChallenge(?string $previousExpression): array
    {
        do {
            $usesAddition = random_int(0, 1) === 1;

            if ($usesAddition) {
                $left = random_int(2, 9);
                $right = random_int(1, 9);
                $expression = "{$left} + {$right}";
                $answer = $left + $right;
            } else {
                $left = random_int(4, 12);
                $right = random_int(1, $left - 1);
                $expression = "{$left} - {$right}";
                $answer = $left - $right;
            }
        } while ($expression === $previousExpression);

        return compact('expression', 'answer');
    }
}
