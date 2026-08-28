<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Viredá | Management & Technology Consulting</title>
        <meta name="description" content="Viredá brings together strategy, technology and data to help businesses build better, work smarter and move forward with confidence.">
        <meta property="og:title" content="Viredá | Management & Technology Consulting">
        <meta property="og:description" content="Viredá brings together strategy, technology and data to help businesses build better, work smarter and move forward with confidence.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url('/') }}">
        <link rel="canonical" href="{{ url('/') }}">
        <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
        <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">
        <link rel="apple-touch-icon" href="{{ asset('favicon.png') }}">
        <link rel="preload" as="image" href="{{ asset('images/mobile-hero-gold-architecture-960.jpg') }}" media="(max-width: 640px)">
        <script>
            (() => {
                const stored = localStorage.getItem('vireda-theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
