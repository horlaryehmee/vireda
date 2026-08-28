<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactEnquiry extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public array $enquiry)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [new Address($this->enquiry['email'], $this->enquiry['name'])],
            subject: "New Vireda enquiry: {$this->enquiry['service']}",
        );
    }

    public function content(): Content
    {
        return new Content(
            text: 'emails.contact-enquiry',
        );
    }
}
