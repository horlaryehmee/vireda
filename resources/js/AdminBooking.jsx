import React, { useEffect, useState } from 'react';
import { Bell, CalendarDays, Check, ChevronsRight, Clock, ExternalLink, LogOut, Mail, Moon, Save, Settings, SlidersHorizontal, Sun, Trash2, Users } from 'lucide-react';
import { GrainGradient } from '@paper-design/shaders-react';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const defaultSchedule = dayNames.map((_, day) => ({ day_of_week: day, is_available: day > 0 && day < 6, start_time: '09:00', end_time: '17:00' }));

function csrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.content || '';
}

async function api(path, options = {}) {
    const response = await fetch(path, {
        ...options,
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken(), ...options.headers },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(data.message || 'The request could not be completed.');
        error.errors = data.errors;
        throw error;
    }
    return data;
}

function AdminLogo({ variant = 'light' }) {
    return (
        <a className={`admin-wordmark ${variant}`} href="/" aria-label="Viredá home">
            <img
                src={`/images/vireda-logo-${variant}-420.png`}
                alt="Viredá"
                width="420"
                height="140"
            />
        </a>
    );
}

function AdminLoginPage() {
    const [form, setForm] = useState({ email: '', password: '', remember: false });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { document.title = 'Admin Sign In | Viredá'; }, []);

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api('/admin/api/login', { method: 'POST', body: JSON.stringify(form) });
            window.location.assign('/admin');
        } catch (requestError) {
            setError(requestError.message);
            setLoading(false);
        }
    };

    return (
        <main className="admin-login-page">
            <div className="admin-login-shell">
                <section className="admin-login-form-panel">
                    <div className="admin-login-card">
                        <AdminLogo />
                        <div className="admin-login-heading">
                            <h1>Welcome back.</h1>
                        </div>
                        <form onSubmit={submit}>
                            <label><span>Email address</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required autoFocus autoComplete="email" placeholder="admin@vireda.com" /></label>
                            <label><span>Password</span><input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required autoComplete="current-password" placeholder="Enter your password" /></label>
                            <label className="admin-remember"><input type="checkbox" checked={form.remember} onChange={(event) => setForm({ ...form, remember: event.target.checked })} /><span>Keep me signed in on this device</span></label>
                            {error && <div className="admin-alert error" role="alert">{error}</div>}
                            <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
                        </form>
                        <a className="admin-back-link" href="/">← Back to website</a>
                    </div>
                </section>

                <aside className="admin-login-visual" aria-hidden="true">
                    <GrainGradient
                        speed={0.55}
                        scale={1.1}
                        rotation={18}
                        offsetX={0}
                        offsetY={0}
                        softness={0.7}
                        intensity={0.48}
                        noise={0.2}
                        shape="corners"
                        colors={['#fff8e6', '#d8a73a', '#7c4e08', '#ffffff']}
                        colorBack="#00000000"
                        className="admin-login-gradient"
                    />
                </aside>
            </div>
        </main>
    );
}

function Flash({ flash }) {
    if (!flash?.message) return null;
    return <div className={`admin-alert ${flash.type}`} role="status">{flash.type === 'success' && <Check size={17} />}{flash.message}</div>;
}

function BookingsPanel({ data, timezone, reload, setFlash }) {
    const [status, setStatus] = useState('all');

    const filter = async (value) => {
        setStatus(value);
        await reload(value);
    };

    const updateStatus = async (booking, value) => {
        try {
            await api(`/admin/api/bookings/${booking.id}`, { method: 'PATCH', body: JSON.stringify({ status: value }) });
            setFlash({ type: 'success', message: 'Booking status updated.' });
            reload(status);
        } catch (error) {
            setFlash({ type: 'error', message: error.message });
        }
    };

    return (
        <section className="admin-panel">
            <div className="admin-panel-heading"><div><p className="eyebrow">Schedule</p><h2>Bookings</h2></div><select value={status} onChange={(event) => filter(event.target.value)}><option value="all">All statuses</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="no_show">No-show</option></select></div>
            <div className="admin-booking-list">
                {data.length === 0 ? <div className="admin-empty"><CalendarDays size={28} /><p>No bookings match this filter.</p></div> : data.map((booking) => {
                    const date = new Date(booking.scheduled_at);
                    return (
                        <article className="admin-booking-card" key={booking.id}>
                            <div className="admin-booking-date"><strong>{date.toLocaleDateString('en-GB', { day: '2-digit' })}</strong><span>{date.toLocaleDateString('en-GB', { month: 'short' })}</span></div>
                            <div className="admin-booking-person"><h3>{booking.name}</h3><p>{booking.company || booking.service || 'Discovery call'}</p><span><Mail size={14} />{booking.email}</span><span><Clock size={14} />{date.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: timezone })}</span></div>
                            <div className="admin-booking-context">{booking.notes ? <p>{booking.notes}</p> : <p className="muted">No additional context provided.</p>}<small>{booking.reference} · Email {booking.notification_status}</small></div>
                            <select className={`admin-status ${booking.status}`} value={booking.status} onChange={(event) => updateStatus(booking, event.target.value)}><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="no_show">No-show</option></select>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

function AvailabilityPanel({ settingsData, reload, setFlash }) {
    const [schedule, setSchedule] = useState(settingsData.schedule.length ? settingsData.schedule : defaultSchedule);
    const [booking, setBooking] = useState(settingsData.booking);
    const [override, setOverride] = useState({ date: '', is_available: false, start_time: '09:00', end_time: '17:00', note: '' });

    useEffect(() => {
        setSchedule(settingsData.schedule.length ? settingsData.schedule : defaultSchedule);
        setBooking(settingsData.booking);
    }, [settingsData]);

    const saveSchedule = async () => {
        try {
            await api('/admin/api/schedule', { method: 'PUT', body: JSON.stringify({ days: schedule.map((day) => ({ ...day, start_time: day.start_time.slice(0, 5), end_time: day.end_time.slice(0, 5) })) }) });
            setFlash({ type: 'success', message: 'Weekly availability saved.' });
            reload();
        } catch (error) { setFlash({ type: 'error', message: error.message }); }
    };

    const saveBooking = async () => {
        try {
            await api('/admin/api/booking-settings', { method: 'PUT', body: JSON.stringify(booking) });
            setFlash({ type: 'success', message: 'Booking rules saved.' });
            reload();
        } catch (error) { setFlash({ type: 'error', message: error.message }); }
    };

    const saveOverride = async (event) => {
        event.preventDefault();
        try {
            await api('/admin/api/overrides', { method: 'POST', body: JSON.stringify(override) });
            setOverride({ date: '', is_available: false, start_time: '09:00', end_time: '17:00', note: '' });
            setFlash({ type: 'success', message: 'Date override saved.' });
            reload();
        } catch (error) { setFlash({ type: 'error', message: error.message }); }
    };

    const removeOverride = async (id) => {
        try {
            await api(`/admin/api/overrides/${id}`, { method: 'DELETE' });
            setFlash({ type: 'success', message: 'Date override removed.' });
            reload();
        } catch (error) { setFlash({ type: 'error', message: error.message }); }
    };

    const updateDay = (index, field, value) => setSchedule((current) => current.map((day, itemIndex) => itemIndex === index ? { ...day, [field]: value } : day));

    return (
        <div className="admin-settings-grid">
            <section className="admin-panel admin-settings-card admin-span-two">
                <div className="admin-panel-heading"><div><p className="eyebrow">Recurring hours</p><h2>Weekly availability</h2></div><button className="admin-save-button" type="button" onClick={saveSchedule}><Save size={17} />Save hours</button></div>
                <div className="admin-schedule-list">{schedule.map((day, index) => <div className={!day.is_available ? 'disabled' : ''} key={day.day_of_week}><label className="admin-switch"><input type="checkbox" checked={day.is_available} onChange={(event) => updateDay(index, 'is_available', event.target.checked)} /><span /></label><strong>{dayNames[day.day_of_week]}</strong><div><input type="time" value={day.start_time.slice(0, 5)} disabled={!day.is_available} onChange={(event) => updateDay(index, 'start_time', event.target.value)} /><span>to</span><input type="time" value={day.end_time.slice(0, 5)} disabled={!day.is_available} onChange={(event) => updateDay(index, 'end_time', event.target.value)} /></div><small>{day.is_available ? 'Available' : 'Unavailable'}</small></div>)}</div>
            </section>

            <section className="admin-panel admin-settings-card">
                <div className="admin-panel-heading"><div><p className="eyebrow">Scheduling rules</p><h2>Booking settings</h2></div></div>
                <div className="admin-form-grid">
                    <label><span>Timezone</span><input value={booking.timezone || ''} onChange={(event) => setBooking({ ...booking, timezone: event.target.value })} /></label>
                    <label><span>Call duration</span><select value={booking.slot_duration} onChange={(event) => setBooking({ ...booking, slot_duration: Number(event.target.value) })}>{[15, 30, 45, 60, 90].map((value) => <option value={value} key={value}>{value} minutes</option>)}</select></label>
                    <label><span>Buffer between calls</span><input type="number" min="0" max="60" value={booking.buffer_minutes} onChange={(event) => setBooking({ ...booking, buffer_minutes: Number(event.target.value) })} /></label>
                    <label><span>Minimum notice (hours)</span><input type="number" min="0" value={booking.minimum_notice_hours} onChange={(event) => setBooking({ ...booking, minimum_notice_hours: Number(event.target.value) })} /></label>
                    <label><span>Booking window (days)</span><input type="number" min="1" max="365" value={booking.booking_window_days} onChange={(event) => setBooking({ ...booking, booking_window_days: Number(event.target.value) })} /></label>
                    <label><span>Admin notification email</span><input type="email" value={booking.admin_email || ''} onChange={(event) => setBooking({ ...booking, admin_email: event.target.value })} /></label>
                </div>
                <button className="admin-save-button" type="button" onClick={saveBooking}><Save size={17} />Save rules</button>
            </section>

            <section className="admin-panel admin-settings-card">
                <div className="admin-panel-heading"><div><p className="eyebrow">Exceptions</p><h2>Date overrides</h2></div></div>
                <form className="admin-override-form" onSubmit={saveOverride}>
                    <label><span>Date</span><input type="date" required value={override.date} onChange={(event) => setOverride({ ...override, date: event.target.value })} /></label>
                    <label className="admin-override-toggle"><input type="checkbox" checked={override.is_available} onChange={(event) => setOverride({ ...override, is_available: event.target.checked })} /><span>Open this date for bookings</span></label>
                    {override.is_available && <div className="admin-time-pair"><input type="time" value={override.start_time} onChange={(event) => setOverride({ ...override, start_time: event.target.value })} /><span>to</span><input type="time" value={override.end_time} onChange={(event) => setOverride({ ...override, end_time: event.target.value })} /></div>}
                    <label><span>Internal note</span><input value={override.note} onChange={(event) => setOverride({ ...override, note: event.target.value })} placeholder="Holiday, special hours…" /></label>
                    <button className="admin-save-button" type="submit">Add override</button>
                </form>
                <div className="admin-overrides">{settingsData.overrides.map((item) => <div key={item.id}><span><strong>{new Date(`${item.date}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong><small>{item.is_available ? `${item.start_time.slice(0, 5)}–${item.end_time.slice(0, 5)}` : 'Unavailable'}{item.note ? ` · ${item.note}` : ''}</small></span><button type="button" aria-label="Remove override" onClick={() => removeOverride(item.id)}><Trash2 size={16} /></button></div>)}</div>
            </section>
        </div>
    );
}

function EmailPanel({ settingsData, reload, setFlash }) {
    const [email, setEmail] = useState({ ...settingsData.email, password: '' });
    const [testing, setTesting] = useState(false);

    useEffect(() => setEmail({ ...settingsData.email, password: '' }), [settingsData]);

    const save = async (event) => {
        event.preventDefault();
        try {
            await api('/admin/api/email-settings', { method: 'PUT', body: JSON.stringify(email) });
            setFlash({ type: 'success', message: 'Email settings saved securely.' });
            reload();
        } catch (error) { setFlash({ type: 'error', message: error.message }); }
    };

    const test = async () => {
        setTesting(true);
        try {
            const result = await api('/admin/api/email-settings/test', { method: 'POST', body: '{}' });
            setFlash({ type: 'success', message: result.message });
        } catch (error) { setFlash({ type: 'error', message: error.message }); }
        finally { setTesting(false); }
    };

    return (
        <section className="admin-panel admin-email-panel">
            <div className="admin-panel-heading"><div><p className="eyebrow">Email delivery</p><h2>SMTP settings</h2><p>Configure the mailbox used for customer confirmations and internal booking alerts.</p></div></div>
            <form className="admin-form-grid" onSubmit={save}>
                <label><span>Delivery method</span><select value={email.mailer} onChange={(event) => setEmail({ ...email, mailer: event.target.value })}><option value="smtp">SMTP</option><option value="log">Log only (testing)</option></select></label>
                {email.mailer === 'smtp' && <>
                    <label><span>SMTP host</span><input required value={email.host || ''} onChange={(event) => setEmail({ ...email, host: event.target.value })} placeholder="smtp.example.com" /></label>
                    <label><span>Port</span><input required type="number" value={email.port || 587} onChange={(event) => setEmail({ ...email, port: Number(event.target.value) })} /></label>
                    <label><span>Encryption</span><select value={email.encryption || 'tls'} onChange={(event) => setEmail({ ...email, encryption: event.target.value })}><option value="tls">TLS</option><option value="ssl">SSL</option></select></label>
                    <label><span>Username</span><input value={email.username || ''} onChange={(event) => setEmail({ ...email, username: event.target.value })} autoComplete="off" /></label>
                    <label><span>Password</span><input type="password" value={email.password} onChange={(event) => setEmail({ ...email, password: event.target.value })} placeholder={email.has_password ? 'Leave blank to keep current password' : 'SMTP password'} autoComplete="new-password" /></label>
                </>}
                <label><span>From address</span><input required type="email" value={email.from_address || ''} onChange={(event) => setEmail({ ...email, from_address: event.target.value })} /></label>
                <label><span>From name</span><input required value={email.from_name || ''} onChange={(event) => setEmail({ ...email, from_name: event.target.value })} /></label>
                <div className="admin-email-actions"><button className="admin-save-button" type="submit"><Save size={17} />Save settings</button><button className="admin-test-button" type="button" disabled={testing} onClick={test}>{testing ? 'Sending…' : 'Send test email'}</button></div>
            </form>
            <div className="admin-security-note"><Settings size={19} /><p><strong>Credentials are encrypted at rest.</strong> Passwords are never returned to the browser after saving.</p></div>
        </section>
    );
}

function AdminDashboardPage() {
    const [tab, setTab] = useState('bookings');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('vireda-admin-theme') === 'dark');
    const [dashboard, setDashboard] = useState({ stats: {}, bookings: { data: [] }, timezone: 'Africa/Lagos' });
    const [settingsData, setSettingsData] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [flash, setFlash] = useState(null);

    const loadDashboard = async (status = 'all') => setDashboard(await api(`/admin/api/dashboard?status=${status}`));
    const loadSettings = async () => setSettingsData(await api('/admin/api/settings'));

    useEffect(() => {
        document.title = 'Booking Administration | Viredá';
        Promise.all([api('/admin/api/user'), api('/admin/api/dashboard'), api('/admin/api/settings')])
            .then(([userData, dashboardData, settings]) => { setUser(userData.user); setDashboard(dashboardData); setSettingsData(settings); })
            .catch(() => window.location.assign('/admin/login'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        localStorage.setItem('vireda-admin-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    useEffect(() => {
        if (!flash) return undefined;
        const timeout = window.setTimeout(() => setFlash(null), 5000);
        return () => window.clearTimeout(timeout);
    }, [flash]);

    const logout = async () => { await api('/admin/api/logout', { method: 'POST', body: '{}' }); window.location.assign('/admin/login'); };

    if (loading || !settingsData) return <main className="admin-loading">Loading booking administration…</main>;

    const pageTitle = tab === 'bookings' ? 'Dashboard' : tab === 'availability' ? 'Availability' : 'Email delivery';
    const pageDescription = tab === 'bookings'
        ? 'Welcome back. Here is what is happening with your bookings.'
        : tab === 'availability'
            ? 'Control when clients can schedule a discovery call.'
            : 'Manage confirmations, notifications and SMTP delivery.';

    return (
        <main className={`admin-page ${sidebarOpen ? '' : 'sidebar-collapsed'} ${darkMode ? 'dark' : ''}`}>
            <aside className="admin-sidebar">
                <div className="admin-sidebar-brand">
                    <AdminLogo variant={darkMode ? 'dark' : 'light'} />
                    {sidebarOpen && <div><strong>Booking Manager</strong><small>Administration</small></div>}
                </div>
                <nav>
                    <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')} title="Dashboard"><span className="admin-nav-icon"><CalendarDays size={18} /></span>{sidebarOpen && <span>Dashboard</span>}{sidebarOpen && dashboard.stats.upcoming > 0 && <small>{dashboard.stats.upcoming}</small>}</button>
                    <button className={tab === 'availability' ? 'active' : ''} onClick={() => setTab('availability')} title="Availability"><span className="admin-nav-icon"><SlidersHorizontal size={18} /></span>{sidebarOpen && <span>Availability</span>}</button>
                    <button className={tab === 'email' ? 'active' : ''} onClick={() => setTab('email')} title="Email settings"><span className="admin-nav-icon"><Mail size={18} /></span>{sidebarOpen && <span>Email settings</span>}{sidebarOpen && dashboard.stats.notification_issues > 0 && <small className="warning">{dashboard.stats.notification_issues}</small>}</button>
                </nav>
                <div className="admin-sidebar-account">
                    {sidebarOpen && <span>Account</span>}
                    <a href="/" target="_blank" rel="noreferrer" title="View website"><span className="admin-nav-icon"><ExternalLink size={18} /></span>{sidebarOpen && <span>View website</span>}</a>
                </div>
                <div className="admin-user"><span>{user?.name?.charAt(0)}</span>{sidebarOpen && <div><strong>{user?.name}</strong><small>{user?.email}</small></div>}<button aria-label="Sign out" title="Sign out" onClick={logout}><LogOut size={17} /></button></div>
                <button className="admin-sidebar-toggle" type="button" onClick={() => setSidebarOpen((value) => !value)} aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}><ChevronsRight className={sidebarOpen ? 'open' : ''} size={18} />{sidebarOpen && <span>Hide sidebar</span>}</button>
            </aside>
            <div className="admin-main">
                <header className="admin-topbar">
                    <div><h1>{pageTitle}</h1><p>{pageDescription}</p></div>
                    <div className="admin-topbar-actions">
                        <button className="admin-notification-button" type="button" onClick={() => setTab('email')} aria-label="Email delivery notifications"><Bell size={19} />{dashboard.stats.notification_issues > 0 && <span />}</button>
                        <button type="button" onClick={() => setDarkMode((value) => !value)} aria-label={darkMode ? 'Use light mode' : 'Use dark mode'}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
                        <button className="admin-profile-button" type="button" title={user?.name}>{user?.name?.charAt(0)}</button>
                    </div>
                </header>
                <Flash flash={flash} />
                {tab === 'bookings' && <>
                    <div className="admin-stats">
                        <article><div><CalendarDays size={20} /></div><span>Upcoming calls</span><strong>{dashboard.stats.upcoming || 0}</strong><small>Confirmed and scheduled</small></article>
                        <article><div><Users size={20} /></div><span>This month</span><strong>{dashboard.stats.this_month || 0}</strong><small>All booking activity</small></article>
                        <article><div><Check size={20} /></div><span>Completed</span><strong>{dashboard.stats.completed || 0}</strong><small>Calls marked complete</small></article>
                        <article><div><Mail size={20} /></div><span>Email issues</span><strong>{dashboard.stats.notification_issues || 0}</strong><small>{dashboard.stats.notification_issues ? 'Needs your attention' : 'Delivery looks healthy'}</small></article>
                    </div>
                    <BookingsPanel data={dashboard.bookings.data} timezone={dashboard.timezone} reload={loadDashboard} setFlash={setFlash} />
                </>}
                {tab === 'availability' && <AvailabilityPanel settingsData={settingsData} reload={loadSettings} setFlash={setFlash} />}
                {tab === 'email' && <EmailPanel settingsData={settingsData} reload={loadSettings} setFlash={setFlash} />}
            </div>
        </main>
    );
}

export { AdminDashboardPage, AdminLoginPage };
