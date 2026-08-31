import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock, ShieldCheck } from 'lucide-react';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import Select from 'react-select';

const initialForm = {
    name: '', email: '', country_iso: 'GB', country_code: '+44', phone: '', company: '', service: '', notes: '', privacy: false, website: '',
};

const bookingRegionNames = typeof Intl.DisplayNames === 'function'
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;

const bookingCountryCodes = getCountries()
    .map((country) => ({
        country,
        name: bookingRegionNames?.of(country) || country,
        callingCode: `+${getCountryCallingCode(country)}`,
        label: `${bookingRegionNames?.of(country) || country} +${getCountryCallingCode(country)}`,
        value: country,
    }))
    .sort((first, second) => first.name.localeCompare(second.name));

function BookingCountryLabel({ country, callingCode }) {
    return (
        <span className="country-picker-label is-compact">
            <span className={`fi fi-${country.toLowerCase()}`} aria-hidden="true" />
            <span className="country-picker-code">{callingCode}</span>
        </span>
    );
}

function csrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.content || '';
}

function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function dateFromKey(value) {
    return new Date(`${value}T12:00:00`);
}

function buildCalendar(month) {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());

    return Array.from({ length: 42 }, (_, index) => {
        const day = new Date(start);
        day.setDate(start.getDate() + index);
        return day;
    });
}

export default function BookingPage({ Navbar, Footer, services }) {
    const [settings, setSettings] = useState({ timezone: 'Africa/Lagos', duration: 30, booking_window_days: 60 });
    const [displayTimezone, setDisplayTimezone] = useState('Africa/Lagos');
    const [visibleMonth, setVisibleMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [slots, setSlots] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [calendarLoading, setCalendarLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [step, setStep] = useState(1);
    const days = useMemo(() => buildCalendar(visibleMonth), [visibleMonth]);
    const today = useMemo(() => {
        const value = new Date();
        value.setHours(0, 0, 0, 0);
        return value;
    }, []);
    const latestDate = useMemo(() => {
        const value = new Date(today);
        value.setDate(value.getDate() + settings.booking_window_days);
        return value;
    }, [settings.booking_window_days, today]);
    const latestMonth = useMemo(() => new Date(latestDate.getFullYear(), latestDate.getMonth(), 1), [latestDate]);

    useEffect(() => {
        document.title = 'Book a Discovery Call | Viredá';
        fetch('/booking/settings', { headers: { Accept: 'application/json' } })
            .then((response) => response.json())
            .then((data) => {
                setSettings(data);
                const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                setDisplayTimezone(data.timezones?.includes(detectedTimezone) ? detectedTimezone : data.timezone);
            });
    }, []);

    useEffect(() => {
        if (!selectedDate) return;
        setSlotsLoading(true);
        setSelectedTime('');
        fetch(`/booking/availability?date=${selectedDate}&timezone=${encodeURIComponent(displayTimezone)}`, { headers: { Accept: 'application/json' } })
            .then((response) => response.json())
            .then((data) => setSlots(data.slots || []))
            .finally(() => setSlotsLoading(false));
    }, [selectedDate, displayTimezone]);

    useEffect(() => {
        const month = `${visibleMonth.getFullYear()}-${String(visibleMonth.getMonth() + 1).padStart(2, '0')}`;
        setCalendarLoading(true);
        fetch(`/booking/calendar?month=${month}`, { headers: { Accept: 'application/json' } })
            .then((response) => response.json())
            .then((data) => setAvailableDates(data.dates || []))
            .finally(() => setCalendarLoading(false));
    }, [visibleMonth]);

    const chooseDate = (day) => {
        if (day < today || day > latestDate || day.getMonth() !== visibleMonth.getMonth()) return;
        setSelectedDate(dateKey(day));
        setStep(2);
        setErrors((current) => ({ ...current, date: undefined, time: undefined }));
    };

    const chooseTime = (time) => {
        setSelectedTime(time);
        setStep(3);
        setErrors((current) => ({ ...current, time: undefined }));
    };

    const changeTimezone = (event) => {
        setDisplayTimezone(event.target.value);
        setSelectedTime('');
        if (selectedDate) setStep(2);
    };

    const updateForm = (event) => {
        const { name, value, checked, type } = event.target;
        setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
        setErrors((current) => ({ ...current, [name]: undefined }));
    };

    const updateCountry = (option) => {
        setForm((current) => ({
            ...current,
            country_iso: option.country,
            country_code: `+${getCountryCallingCode(option.country)}`,
        }));
        setErrors((current) => ({ ...current, phone: undefined }));
    };

    const submit = async (event) => {
        event.preventDefault();
        if (!selectedDate || !selectedTime) {
            setErrors((current) => ({ ...current, date: !selectedDate ? ['Choose a date.'] : undefined, time: !selectedTime ? ['Choose a time.'] : undefined }));
            return;
        }

        setSubmitting(true);
        setErrors({});

        try {
            const response = await fetch('/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken() },
                body: JSON.stringify({
                    ...form,
                    phone: `${form.country_code} ${form.phone}`.trim(),
                    date: selectedDate,
                    time: selectedTime,
                    timezone: displayTimezone,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                setErrors(data.errors || { general: [data.message || 'We could not complete your booking.'] });
                if (response.status === 422 && !data.errors) {
                    const refreshed = await fetch(`/booking/availability?date=${selectedDate}&timezone=${encodeURIComponent(displayTimezone)}`, { headers: { Accept: 'application/json' } }).then((item) => item.json());
                    setSlots(refreshed.slots || []);
                    setSelectedTime('');
                    setStep(2);
                }
                return;
            }

            setResult(data.booking);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
            setErrors({ general: ['Something went wrong. Please check your connection and try again.'] });
        } finally {
            setSubmitting(false);
        }
    };

    const selectedSlot = slots.find((slot) => slot.time === selectedTime);
    const selectedDateLabel = selectedSlot?.date_label || (selectedDate
        ? dateFromKey(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : 'Choose a date');

    return (
        <>
        <Navbar />
        <main className="booking-page booking-page-focused">
            <section className="booking-section">
                <div className="booking-shell" data-step={result ? 4 : step}>
                    <aside className="booking-summary">
                        <p className="booking-kicker">Book a time to talk</p>
                        <h1>Discovery call</h1>
                        <ul>
                            <li><Clock size={18} /><span>{settings.duration} minutes</span></li>
                            <li><CalendarDays size={18} /><span>Online meeting</span></li>
                            <li><ShieldCheck size={18} /><span>{displayTimezone}</span></li>
                        </ul>
                        <p className="booking-summary-copy">Tell us what you're working on, what you're trying to achieve, or what's not quite working. We'll talk through the challenge, explore what's possible, and leave you with a clearer idea of what to do next.</p>
                        {selectedDate && (
                            <div className="booking-selection">
                                <small>Your selection</small>
                                <strong>{selectedDateLabel}</strong>
                                {selectedSlot && <span>{selectedSlot.label} · {settings.duration} minutes</span>}
                            </div>
                        )}
                    </aside>

                    <section className="booking-calendar-column" aria-label="Choose a date">
                        <div className="booking-panel-heading">
                            <div>
                                <span>Step 1 of 3</span>
                                <h2>Select a date</h2>
                            </div>
                        </div>
                        <div className={`booking-calendar ${calendarLoading ? 'loading' : ''}`}>
                            <div className="booking-calendar-header">
                                <strong>{visibleMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</strong>
                                <div>
                                    <button type="button" aria-label="Previous month" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))} disabled={visibleMonth <= new Date(today.getFullYear(), today.getMonth(), 1)}><ArrowLeft size={18} /></button>
                                    <button type="button" aria-label="Next month" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))} disabled={visibleMonth >= latestMonth}><ArrowRight size={18} /></button>
                                </div>
                            </div>
                            <div className="booking-weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}</div>
                            <div className="booking-days">
                                {days.map((day) => {
                                    const key = dateKey(day);
                                    const disabled = calendarLoading || day < today || day > latestDate || day.getMonth() !== visibleMonth.getMonth() || !availableDates.includes(key);
                                    return <button className={selectedDate === key ? 'selected' : ''} disabled={disabled} key={key} onClick={() => chooseDate(day)} type="button"><span>{day.getDate()}</span></button>;
                                })}
                            </div>
                        </div>
                        {errors.date && <small className="booking-error">{errors.date[0]}</small>}
                        <div className="booking-timezone-card">
                            <label htmlFor="booking-timezone">Timezone</label>
                            <div className="booking-timezone-select">
                                <ShieldCheck size={17} aria-hidden="true" />
                                <select id="booking-timezone" value={displayTimezone} onChange={changeTimezone}>
                                    {(settings.timezones || [settings.timezone]).map((timezone) => <option value={timezone} key={timezone}>{timezone.replaceAll('_', ' ')}</option>)}
                                </select>
                            </div>
                            <small>Times are automatically converted to this timezone.</small>
                        </div>
                    </section>

                    <section className="booking-side-panel" aria-live="polite">
                        {result ? (
                            <div className="booking-success">
                                <span className="booking-success-icon"><Check size={32} /></span>
                                <p className="booking-kicker">Booking confirmed</p>
                                <h2>You're all set.</h2>
                                <p>We've reserved your discovery call and sent the details to your email.</p>
                                <div className="booking-success-details">
                                    <strong>{selectedDateLabel}</strong>
                                    <span>{selectedSlot?.label} · {settings.duration} minutes</span>
                                    <small>Reference: {result.reference}</small>
                                </div>
                                <a className="booking-primary-action" href="/">Return home <ArrowRight size={18} /></a>
                            </div>
                        ) : step === 1 ? (
                            <div className="booking-panel-empty">
                                <span>Step 2 of 3</span>
                                <h2>Select a time</h2>
                                <p>Choose an available date to see appointment times.</p>
                            </div>
                        ) : step === 2 ? (
                            <div className="booking-time-step">
                                <div className="booking-panel-heading">
                                    <button type="button" onClick={() => setStep(1)}><ArrowLeft size={17} />Change date</button>
                                    <div><span>Step 2 of 3</span><h2>Available times</h2><p>{selectedDateLabel}</p></div>
                                </div>
                                {slotsLoading ? <p className="booking-loading">Checking availability…</p> : slots.length === 0 ? <p className="booking-empty">There are no open times on this date. Please choose another day.</p> : (
                                    <div className="booking-slots booking-time-list">{slots.map((slot) => <button className={selectedTime === slot.time ? 'selected' : ''} key={slot.time} onClick={() => chooseTime(slot.time)} type="button">{slot.label}</button>)}</div>
                                )}
                                {errors.time && <small className="booking-error">{errors.time[0]}</small>}
                            </div>
                        ) : (
                            <form className="booking-details-step" onSubmit={submit} noValidate>
                                <div className="booking-panel-heading">
                                    <button type="button" onClick={() => setStep(2)}><ArrowLeft size={17} />Change time</button>
                                    <div><span>Step 3 of 3</span><h2>Your details</h2><p>Tell us who we'll be speaking with.</p></div>
                                </div>
                                <div className="booking-fields">
                                    <label><span>Full name *</span><input name="name" value={form.name} onChange={updateForm} required autoComplete="name" />{errors.name && <small>{errors.name[0]}</small>}</label>
                                    <label><span>Email address *</span><input type="email" name="email" value={form.email} onChange={updateForm} required autoComplete="email" />{errors.email && <small>{errors.email[0]}</small>}</label>
                                    <div className="booking-phone-field">
                                        <span>Phone number *</span>
                                        <div className="booking-phone-row">
                                            <label>
                                                <span className="sr-only">Country code</span>
                                                <Select
                                                    inputId="booking-country"
                                                    name="country_iso"
                                                    className="country-select"
                                                    classNamePrefix="country-select"
                                                    options={bookingCountryCodes}
                                                    value={bookingCountryCodes.find(({ country }) => country === form.country_iso)}
                                                    onChange={updateCountry}
                                                    formatOptionLabel={(option) => <BookingCountryLabel {...option} />}
                                                    aria-label="Country and calling code"
                                                    placeholder="Select country"
                                                    isSearchable
                                                />
                                            </label>
                                            <label>
                                                <span className="sr-only">Phone number</span>
                                                <input type="tel" name="phone" value={form.phone} onChange={updateForm} required autoComplete="tel-national" inputMode="tel" placeholder="Phone number" />
                                            </label>
                                        </div>
                                        {errors.phone && <small>{errors.phone[0]}</small>}
                                    </div>
                                    <label><span>Company</span><input name="company" value={form.company} onChange={updateForm} autoComplete="organization" /></label>
                                    <label><span>What would you like to discuss?</span><select name="service" value={form.service} onChange={updateForm}><option value="">Select an area (optional)</option>{services.map((service) => <option value={service} key={service}>{service}</option>)}</select></label>
                                    <label><span>Anything we should know beforehand?</span><textarea name="notes" value={form.notes} onChange={updateForm} rows="4" placeholder="A little context helps us make the call more useful." />{errors.notes && <small>{errors.notes[0]}</small>}</label>
                                </div>
                                <label className="booking-honeypot" aria-hidden="true">Website<input name="website" value={form.website} onChange={updateForm} tabIndex="-1" autoComplete="off" /></label>
                                <label className="booking-consent"><input type="checkbox" name="privacy" checked={form.privacy} onChange={updateForm} /><span>I agree to the <a href="/privacy-policy" target="_blank" rel="noreferrer">privacy policy</a> and consent to Viredá using my details to manage this call.</span></label>
                                {errors.privacy && <small className="booking-error">Please confirm your consent.</small>}
                                {errors.general && <div className="booking-feedback" role="alert">{errors.general[0]}</div>}
                                <button className="booking-submit" type="submit" disabled={submitting}><span>{submitting ? 'Confirming…' : 'Confirm booking'}</span><ArrowRight size={19} /></button>
                            </form>
                        )}
                    </section>
                </div>
            </section>
        </main>
        <Footer />
        </>
    );
}
