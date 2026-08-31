<!doctype html>
<html lang="en">
<body style="margin:0;background:#f4f1e9;font-family:Arial,sans-serif;color:#18191c">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fff;border-radius:12px;overflow:hidden">
<tr><td style="padding:28px 34px;background:#050505;color:#fff8e6"><strong style="font-size:21px">New Viredá booking</strong></td></tr>
<tr><td style="padding:34px">
<h1 style="font-size:24px;margin:0 0 20px">{{ $booking->name }} booked a discovery call</h1>
<p><strong>When:</strong> {{ $booking->scheduled_at->timezone($booking->timezone)->format('l, j F Y \a\t g:i A') }} ({{ $booking->timezone }})</p>
<p><strong>Email:</strong> <a href="mailto:{{ $booking->email }}">{{ $booking->email }}</a></p>
<p><strong>Phone:</strong> {{ $booking->phone }}</p>
@if($booking->company)<p><strong>Company:</strong> {{ $booking->company }}</p>@endif
@if($booking->service)<p><strong>Interest:</strong> {{ $booking->service }}</p>@endif
@if($booking->notes)<p><strong>Context:</strong><br>{{ $booking->notes }}</p>@endif
<p style="margin-top:24px;color:#777;font-size:14px">Reference: {{ $booking->reference }}</p>
</td></tr></table>
</td></tr></table>
</body>
</html>
