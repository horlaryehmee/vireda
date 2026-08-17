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

If cPanel does not have Node.js:

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

The website will not load its CSS/JS correctly without `public/build`.

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

If there is no Node.js on cPanel, run `npm run build` locally and upload the new `public/build` folder after pulling.

## Troubleshooting

- Blank page: check `storage/logs/laravel.log`.
- CSS or JavaScript missing: confirm `public/build` exists and `public/build/manifest.json` is present.
- 500 error after deployment: run `php artisan optimize:clear`, verify `.env`, and check PHP version.
- Permission errors: ensure `storage` and `bootstrap/cache` are writable.
- Wrong domain links: set `APP_URL` correctly and rebuild config cache.

