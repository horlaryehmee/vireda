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

These steps assume the domain will point to Laravel's `public` directory.

### 1. Prepare The cPanel Account

1. Log in to cPanel.
2. Confirm the server supports PHP 8.3 or newer.
3. Enable required PHP extensions, typically: `bcmath`, `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `hash`, `mbstring`, `openssl`, `pdo`, `pdo_mysql` or `pdo_sqlite`, `session`, `tokenizer`, `xml`.
4. Create a database if you will use MySQL:
   - Open **MySQL Databases**.
   - Create a database.
   - Create a database user.
   - Add the user to the database with all privileges.

### 2. Upload Or Clone The Project

Preferred cPanel Git method:

1. Open **Git Version Control** in cPanel.
2. Create a new repository from:

```text
https://github.com/horlaryehmee/vireda.git
```

3. Clone it into a folder outside `public_html`, for example:

```text
/home/CPANEL_USER/vireda
```

Do not put the full Laravel project directly inside `public_html` unless you know how to protect private framework files.

### 3. Point The Domain To `public`

Recommended:

1. In **Domains** or **Addon Domains**, set the document root to:

```text
/home/CPANEL_USER/vireda/public
```

Alternative if cPanel forces `public_html`:

1. Move the Laravel project to `/home/CPANEL_USER/vireda`.
2. Copy the contents of `/home/CPANEL_USER/vireda/public` into `/home/CPANEL_USER/public_html`.
3. Edit `public_html/index.php` paths so they point back to the Laravel project:

```php
require __DIR__.'/../vireda/vendor/autoload.php';
$app = require_once __DIR__.'/../vireda/bootstrap/app.php';
```

Adjust `../vireda` if your folder name is different.

### 4. Create The Production `.env`

In the project root, create `.env`:

```bash
cp .env.example .env
```

Set the production values:

```env
APP_NAME="VIREDÁ"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

LOG_CHANNEL=stack
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

For MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=cpanel_database_name
DB_USERNAME=cpanel_database_user
DB_PASSWORD=database_password
```

For SQLite:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/home/CPANEL_USER/vireda/database/database.sqlite
```

Then create the SQLite file if needed:

```bash
touch database/database.sqlite
```

### 5. Install Dependencies On cPanel

Open **Terminal** in cPanel and run:

```bash
cd /home/CPANEL_USER/vireda
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
```

If `composer` is unavailable globally, use the Composer path provided by your host, or upload `composer.phar` and run:

```bash
php composer.phar install --no-dev --optimize-autoloader
```

### 6. Build Frontend Assets

If cPanel has Node.js:

```bash
cd /home/CPANEL_USER/vireda
npm ci
npm run build
```

This repository includes the committed `public/build` production assets for cPanel hosting environments where Node.js is unavailable. After `git pull`, confirm this file exists:

```text
public/build/manifest.json
```

If the committed build assets are missing or you need to rebuild locally:

1. Build locally:

```bash
npm install
npm run build
```

2. Upload the generated folder:

```text
public/build
```

to:

```text
/home/CPANEL_USER/vireda/public/build
```

The website will not load its CSS/JS correctly without `public/build/manifest.json`.

### 7. Set Permissions

Run:

```bash
chmod -R 775 storage bootstrap/cache
```

If your host requires stricter permissions, use:

```bash
find storage bootstrap/cache -type d -exec chmod 755 {} \;
find storage bootstrap/cache -type f -exec chmod 644 {} \;
```

### 8. Optimize Laravel

Run:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

After future `.env` changes, clear and rebuild cache:

```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 9. Storage Link

If the site later uses uploaded files, run:

```bash
php artisan storage:link
```

### 10. Deployment Updates

For future updates from GitHub:

```bash
cd /home/CPANEL_USER/vireda
git pull origin main
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

If there is no Node.js on cPanel, use the committed `public/build` folder from GitHub, or run `npm run build` locally and upload the new `public/build` folder after pulling.

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
