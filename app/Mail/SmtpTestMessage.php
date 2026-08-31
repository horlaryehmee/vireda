<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class SmtpTestMessage extends Mailable
{
    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Viredá email settings test');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.smtp-test');
    }
}
