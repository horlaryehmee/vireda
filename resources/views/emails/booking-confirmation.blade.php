<!doctype html>
<html lang="en">
<body style="margin:0;background:#f4f1e9;font-family:Arial,sans-serif;color:#18191c">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;background:#f4f1e9"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fff;border-radius:12px;overflow:hidden">
<tr><td style="padding:30px 36px;background:#050505;color:#fff8e6;border-bottom:3px solid #d8a73a"><div style="font-size:22px;font-weight:700">Viredá</div><div style="margin-top:8px;color:#d8a73a;font-size:12px;text-transform:uppercase;letter-spacing:1.5px">Discovery call confirmed</div></td></tr>
<tr><td style="padding:36px">
<h1 style="font-size:26px;margin:0 0 14px">You're booked, {{ $booking->name }}.</h1>
<p style="line-height:1.7;color:#55565a">Thanks for scheduling a conversation with us. We look forward to learning more about what you're working on.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:#faf8f2;border:1px solid #e7dfcf;border-radius:8px">
<tr><td style="padding:20px"><strong>Date</strong><br><span style="color:#55565a">{{ $booking->scheduled_at->timezone($booking->timezone)->format('l, j F Y') }}</span></td></tr>
<tr><td style="padding:0 20px 20px"><strong>Time</strong><br><span style="color:#55565a">{{ $booking->scheduled_at->timezone($booking->timezone)->format('g:i A') }} ({{ $booking->timezone }}) · {{ $booking->duration_minutes }} minutes</span></td></tr>
</table>
<p style="font-size:14px;color:#777">Booking reference: <strong>{{ $booking->reference }}</strong></p>
<p style="line-height:1.7;color:#55565a">If you need to make a change, reply to this email and include your booking reference.</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>
