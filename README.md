# VIREDÁ Website

Custom Laravel + React website for VIREDÁ.

## Stack

- Laravel 13
- React 19
- Vite
- Tailwind CSS 4
- Three.js
- SQLite by default, configurable for MySQL

## Local Installation

1. Clone the repository:

```bash
git clone https://github.com/horlaryehmee/vireda.git
cd vireda
```

2. Install PHP dependencies:

```bash
composer install
```

3. Install frontend dependencies:

```bash
npm install
```

4. Create the environment file:

```bash
cp .env.example .env
php artisan key:generate
```

5. Configure `.env`.

For SQLite:

```env
DB_CONNECTION=sqlite
```

Then create the database file if it does not exist:

```bash
touch database/database.sqlite
```

For MySQL, set:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Run migrations:

```bash
php artisan migrate --force
```

7. Build frontend assets:

```bash
npm run build
```

8. Start locally:

```bash
php artisan serve
```

Open `http://127.0.0.1:8000`.

## cPanel Installation

This setup uses the main domain's fixed document root,
`/home/CPANEL_USER/public_html`. Keep the Laravel repository directly in
`public_html`. The root `.htaccess` internally routes requests to
`public/`, so the site opens at the domain root without a `/public` URL.
The existing `public/index.php` loads the rest of Laravel.

**The root `.htaccess` is essential.** Confirm it appears in cPanel File
Manager with hidden files enabled. If the host does not honor Apache rewrite
rules, ask the host to enable them before using this layout.

### 1. Set Up The Repository

In cPanel Git Version Control, place the repository directly at:

```text
/home/CPANEL_USER/public_html
```

Pull the latest `main` branch so the root `.htaccess` is present. If an
older copy exists in `public_html/vireda`, move any `.env`, database, or
uploaded files you need into the root project, then remove that extra copy.
Do not create `public_html/index.php`; Laravel's entry point stays in
`public_html/public/index.php`.

### 2. Configure PHP And The Environment

Select PHP 8.3 or newer for the domain and CLI. Enable the PHP extensions
required by Laravel and your database driver. Create `public_html/.env`
from `.env.example` if it does not already exist. For the live site, set:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://vireda.co.uk
```

Preserve the existing `APP_KEY` and database settings when moving an
existing installation. For SQLite, use a database path under
`/home/CPANEL_USER/public_html/database/`; for MySQL, use the database
name, user, and password created in cPanel. Keep `.env` out of Git.

### 3. Install Dependencies

From cPanel Terminal:

```bash
cd ~/public_html
php -v
```

If `composer` is available, run:

```bash
composer install --no-dev --optimize-autoloader
```

If it is unavailable, follow the verified installer instructions at
https://getcomposer.org/download/ and run `php composer.phar install
--no-dev --optimize-autoloader` from `~/public_html`. Stop if the installer
download or signature verification fails. Confirm `vendor/autoload.php`
exists before continuing.

The repository includes the built `public/build` assets. Confirm that
`public/build/manifest.json` exists. When changing frontend code, run
`npm run build` locally and commit the updated `public/build` files,
or build on the server if Node.js is available.

### 4. Finish Setup

From `~/public_html`:

```bash
php artisan migrate --force
bash deploy/cpanel.sh
php artisan optimize
```

For a new installation without an `APP_KEY`, run `php artisan key:generate`
before migrations. Do not regenerate a key for an existing site. The deployment script checks
that `.env`, Composer dependencies, built assets, and the root `.htaccess`
are present. cPanel's **Deploy HEAD Commit** button runs the same script
through `.cpanel.yml`.

If the app later serves uploaded files, run `php artisan storage:link`.
This layout keeps Laravel's public path at `public_html/public`.

### 5. Verify

Open `https://vireda.co.uk/` and confirm that the site loads without
`/public` in the URL. Also check that
`https://vireda.co.uk/composer.json` does not return the Composer file.
If it does, the root rewrite rule is not active; contact the host before
using the site.

For future updates, pull the latest Git commit, install any changed
Composer dependencies, run migrations, and run `bash deploy/cpanel.sh`.

## Booking Administration

### URLs

- Public booking page: `/book`
- Administrator login: `/admin/login`
- Administrator dashboard: `/admin`

All public links labelled **Book a call**, **Book a conversation**, or **Book a discovery call** lead to the booking page.

### First-Time Setup

Run the booking migration and create the recurring availability records:

```bash
php artisan migrate --force
php artisan db:seed --force
```

Create the first administrator interactively:

```bash
php artisan booking:create-admin
```

The command asks for the administrator's name, email and a password of at least 12 characters. It can also be rerun to update the name or password for an existing administrator email.

For automated deployments, set these variables before running `php artisan db:seed --force`:

```dotenv
ADMIN_NAME="Viredá Admin"
ADMIN_EMAIL="admin@vireda.com"
ADMIN_PASSWORD="use-a-unique-password-with-at-least-12-characters"
BOOKING_TIMEZONE="Africa/Lagos"
```

Do not commit a real `ADMIN_PASSWORD` to Git. Remove it from the production environment after the administrator has been created if the deployment platform does not require it for future seeds.

### Setting Availability

Sign in, open **Availability**, and configure the following:

1. Set the normal opening and closing time for every weekday.
2. Disable days that should never accept bookings.
3. Save the weekly hours.
4. Add date overrides for holidays, closures, or special opening hours.
5. Configure the timezone, call duration, buffer between calls, minimum booking notice, future booking window, and internal notification email.

The public calendar only enables dates with at least one valid time slot. Existing confirmed bookings and configured buffers are automatically removed from the available times.

### Managing Bookings

The **Bookings** screen shows the client, company, email, call time, notes, booking reference, and notification status. Administrators can mark a booking as:

- Confirmed
- Completed
- Cancelled
- No-show

Cancelling a booking releases its time slot so another visitor can book it.

### SMTP and Email Delivery

Open **Email settings** in the dashboard and enter the values supplied by the email provider:

- Delivery method: `SMTP` for production or `Log only` for local testing
- SMTP hostname
- Port, commonly `587` with TLS or `465` with SSL
- Encryption type
- SMTP username and password
- From address and sender name

Save the settings, then select **Send test email**. The test is sent to the email address of the signed-in administrator. Do not accept live bookings until this test succeeds.

For reliable delivery, the From address should belong to a domain authenticated with SPF and DKIM at the email provider. Add DMARC as well for production domains. The hosting provider must allow outbound SMTP connections on the selected port.

After a successful booking:

1. The customer receives a confirmation containing the date, time, timezone, duration and booking reference.
2. The configured administrator email receives the customer's contact details and call context.
3. Delivery success or failure is recorded against the booking and displayed in the dashboard.

SMTP passwords are encrypted using `APP_KEY` and are never returned to the browser. Keep the production `APP_KEY` stable; changing it will make previously saved encrypted credentials unreadable.

### Security and Operations

- Serve the website and admin area over HTTPS in production.
- Use a unique administrator password and do not share administrator accounts.
- Keep `APP_DEBUG=false` in production.
- Keep `.env` outside public web access and never commit it.
- Back up the database before deployments and before changing booking records in bulk.
- Preserve `APP_KEY` between deployments because it protects stored SMTP credentials.
- The login endpoint and public booking endpoint are rate limited.
- SMTP credentials are encrypted at rest and excluded from administrator API responses.

### Booking Deployment Checklist

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan migrate --force
php artisan db:seed --force
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

After deployment:

1. Confirm `/book` loads and displays available dates.
2. Confirm `/admin/login` accepts the administrator credentials.
3. Save the production availability and notification email.
4. Save SMTP settings and send a test email.
5. Place a real test booking and verify both customer and administrator notifications.

### Booking Troubleshooting

- No dates are enabled: save weekly availability and confirm the booking window and minimum-notice settings.
- A date is unexpectedly closed: check date overrides and existing confirmed bookings.
- Confirmation email failed: review the booking's notification status, send an SMTP test, and check `storage/logs/laravel.log`.
- SMTP authentication failed: confirm the provider uses the entered port/encryption combination and whether it requires an application-specific password.
- Admin login redirects back: confirm the account was created with `php artisan booking:create-admin`, then clear cookies or run `php artisan optimize:clear`.

## Troubleshooting

- Blank page: check `storage/logs/laravel.log`.
- CSS or JavaScript missing: confirm `public/build` exists and `public/build/manifest.json` is present.
- 500 error after deployment: run `php artisan optimize:clear`, verify `.env`, and check PHP version.
- Permission errors: ensure `storage` and `bootstrap/cache` are writable.
- Wrong domain links: set `APP_URL` correctly and rebuild config cache.
