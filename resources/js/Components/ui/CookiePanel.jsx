import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Cookie, X } from 'lucide-react';

const initialPreferences = {
    necessary: true,
    functional: false,
};

export function CookiePanel({
    title = 'This site uses cookies',
    message = 'We use essential storage to keep VIREDÁ working and remember your preferences.',
    privacyHref = '/privacy-policy',
}) {
    const [render, setRender] = useState(false);
    const [visible, setVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState(initialPreferences);
    const preferencesRef = useRef(null);
    const [preferencesHeight, setPreferencesHeight] = useState(0);

    useEffect(() => {
        if (window.location.pathname.startsWith('/admin')) return undefined;

        const savedPreferences = window.localStorage.getItem('vireda-cookie-preferences');
        if (savedPreferences) {
            try {
                setPreferences({ ...initialPreferences, functional: Boolean(JSON.parse(savedPreferences).functional), necessary: true });
            } catch {
                // Ignore malformed local storage and use the safe defaults.
            }
        }

        if (!window.localStorage.getItem('vireda-cookie-consent')) {
            setRender(true);
            requestAnimationFrame(() => setVisible(true));
        }

        return undefined;
    }, []);

    useEffect(() => {
        setPreferencesHeight(showPreferences && preferencesRef.current ? preferencesRef.current.scrollHeight : 0);
    }, [showPreferences, preferences]);

    const dismiss = (accepted = false) => {
        if (accepted) window.localStorage.setItem('vireda-cookie-consent', 'true');
        setVisible(false);
        window.setTimeout(() => setRender(false), 280);
    };

    const savePreferences = () => {
        window.localStorage.setItem('vireda-cookie-preferences', JSON.stringify(preferences));
        window.localStorage.setItem('vireda-cookie-consent', 'true');
        dismiss();
    };

    if (!render) return null;

    const PreferenceRow = ({ field, label, description, locked = false }) => (
        <div className="cookie-preference-row">
            <button
                type="button"
                className={`cookie-check ${locked ? 'is-locked' : ''}`}
                disabled={locked}
                aria-pressed={preferences[field]}
                aria-label={`${label} cookies`}
                onClick={() => !locked && setPreferences((current) => ({ ...current, [field]: !current[field] }))}
            >
                {preferences[field] && <Check size={13} aria-hidden="true" />}
            </button>
            <span><strong>{label}</strong>{locked && <small>Required</small>}<em>{description}</em></span>
        </div>
    );

    return (
        <aside className={`cookie-panel ${visible ? 'is-visible' : ''}`} role="dialog" aria-live="polite" aria-label="Cookie consent">
            <div className="cookie-panel-heading">
                <span className="cookie-panel-icon"><Cookie size={18} aria-hidden="true" /></span>
                <h2>{title}</h2>
                <button type="button" className="cookie-panel-close" onClick={() => dismiss()} aria-label="Close cookie banner"><X size={16} /></button>
            </div>
            <p className="cookie-panel-message">{message} See our <a href={privacyHref}>Privacy Policy</a>.</p>
            <div className="cookie-panel-actions">
                <button type="button" className="cookie-button cookie-button-muted" onClick={() => setShowPreferences((open) => !open)} aria-expanded={showPreferences}>
                    Customize {showPreferences ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button type="button" className="cookie-button cookie-button-primary" onClick={() => dismiss(true)}>Accept all</button>
            </div>
            <div ref={preferencesRef} className="cookie-preferences" style={{ height: `${preferencesHeight}px` }}>
                {showPreferences && <div className="cookie-preferences-inner">
                    <PreferenceRow field="necessary" label="Strictly necessary" description="Required for security, sessions, contact, and booking forms." locked />
                    <PreferenceRow field="functional" label="Functional" description="Remembers your theme preference." />
                    <button type="button" className="cookie-save" onClick={savePreferences}>Save preferences</button>
                </div>}
            </div>
        </aside>
    );
}

export default CookiePanel;
