import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
    ArrowRight,
    ArrowUp,
    BarChart3,
    Bot,
    Box,
    ChevronLeft,
    ChevronRight,
    Cloud,
    ChevronDown,
    Compass,
    Database,
    Globe,
    Grid2X2,
    Mail,
    Menu,
    Moon,
    Palette,
    Plus,
    Puzzle,
    Smartphone,
    Sparkles,
    Settings,
    Sun,
    Tag,
    User,
    Wifi,
    X,
} from 'lucide-react';
import { GetStartedButton } from './Components/ui/GetStartedButton';
import { HeroGridBackground } from './Components/ui/HeroGridBackground';
import { HowItWorksBlock } from './Components/ui/HowItWorksBlock';
import { IconStack } from './Components/ui/IconStack';
import { KineticGridBackground } from './Components/ui/KineticGridBackground';
import { NeonMesh } from './Components/ui/NeonMesh';
import { ProjectShowcase } from './Components/ui/ProjectShowcase';
import { TextRevealByWord } from './Components/ui/text-reveal';
import { TubeLightNav } from './Components/ui/TubeLightNav';
import '../css/app.css';

const WovenHeroObject = lazy(() => import('./Components/ui/WovenHeroObject').then((module) => ({
    default: module.WovenHeroObject,
})));

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
];

const footerSections = [
    {
        title: 'Company',
        links: [
            { label: 'About', href: '/#about' },
            { label: 'Our Work', href: '/#our-work' },
            { label: 'Insights', href: '/#insights' },
        ],
    },
    {
        title: 'Services',
        links: [
            { label: 'Services Overview', href: '/services' },
            { label: 'Strategy', href: '/services#services' },
            { label: 'Technology', href: '/services#services' },
            { label: 'Data & Analytics', href: '/services#services' },
        ],
    },
    {
        title: 'Start',
        links: [
            { label: 'Contact', href: '#start' },
            { label: 'Email', href: 'mailto:hello@vireda.com' },
            { label: 'Book a call', href: '#start' },
        ],
    },
];

const socialLinks = [
    { label: 'Email', href: 'mailto:hello@vireda.com', icon: Mail },
    { label: 'LinkedIn', href: 'https://www.linkedin.com', brand: 'linkedin' },
    { label: 'X', href: 'https://x.com', brand: 'x' },
    { label: 'Instagram', href: 'https://www.instagram.com', brand: 'instagram' },
];

const capabilities = [
    {
        number: '01',
        title: 'Strategy & Transformation',
        statement: 'Understand the problem. Find the opportunity. Define the way forward.',
        paragraphs: [
            "We help businesses understand where they are, identify what's holding them back and find practical opportunities to improve. That could mean refining a business model, redesigning an inefficient process, introducing better systems or developing a clear strategy for growth.",
        ],
        visual: 'strategy',
    },
    {
        number: '02',
        title: 'Brand & Experience',
        statement: 'Make people understand why you matter.',
        paragraphs: [
            "A good business can still be overlooked if people don't understand what it does, trust it or remember it.",
            'We help turn ideas and businesses into clear, distinctive brands and experiences from positioning and visual identity to digital design and the way customers interact with you.',
            'Because how you present what you do can be just as important as what you do.',
        ],
        visual: 'brand',
    },
    {
        number: '03',
        title: 'Technology & Intelligence',
        statement: 'Turn better ideas into better ways of working.',
        paragraphs: [
            'We design and build the digital tools businesses need from websites and digital products to software, data systems, AI and automation. We look at how your business actually works, identify where technology can make a meaningful difference and build solutions around those needs.',
        ],
        visual: 'technology',
    },
];

const services = [
    {
        title: 'Business & Management Consulting',
        statement: "Clarity when you don't know what comes next.",
        description:
            'We help you assess where your business is today, identify opportunities, solve operational challenges and develop practical strategies for moving forward.',
        tags: ['Strategy', 'Business Improvement', 'Process Design', 'Transformation'],
    },
    {
        title: 'Websites & Digital Experiences',
        statement: 'Digital experiences built to do more than look good.',
        description:
            'We create websites and digital experiences that communicate your value clearly, engage your audience and give your business the digital presence it deserves.',
        tags: ['Web Design', 'UX/UI', 'Development', 'Digital Experiences'],
    },
    {
        title: 'Software & Digital Products',
        statement: 'Turn an idea into something people can actually use.',
        description:
            "From bespoke software to digital platforms and products, we design and build technology around real needs, not technology for technology's sake.",
        tags: ['Software', 'CRM Solutions', 'Applications', 'Product Development'],
    },
    {
        title: 'Data & Analytics',
        statement: 'Make your data work harder for you.',
        description:
            'We turn disconnected information into clear reporting, useful insights and better visibility, helping businesses understand what is happening and make more informed decisions.',
        tags: ['Data Analysis', 'Business Intelligence', 'Dashboards', 'Reporting'],
    },
    {
        title: 'AI & Automation',
        statement: 'Spend less time doing what technology can do for you.',
        description:
            'We identify repetitive or inefficient processes and explore where AI and automation can save time, reduce friction and help your people focus on higher-value work.',
        tags: ['AI Integration', 'Workflow Automation', 'Intelligent Systems'],
    },
    {
        title: 'Brand & Creative',
        statement: 'Give your business an identity people can recognise and remember.',
        description:
            'We develop distinctive brands and creative experiences that help businesses communicate clearly, build trust and stand apart.',
        tags: ['Brand Strategy', 'Identity', 'Creative Direction', 'Digital Design'],
    },
];

function slugifyServiceTitle(title) {
    return title
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const projects = [
    {
        name: 'Operating Model Redesign',
        industry: 'Professional services',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=85',
        description:
            'A working blueprint for clearer decision-making, leaner processes and a digital roadmap that teams could actually adopt.',
        services: ['Strategy', 'Process Design', 'Systems Planning'],
    },
    {
        name: 'Intelligence Dashboard Suite',
        industry: 'Distribution',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85',
        description:
            'A consolidated reporting experience that turned fragmented spreadsheets into usable visibility across commercial operations.',
        services: ['Data', 'Dashboards', 'Automation'],
    },
    {
        name: 'Brand-Led Digital Platform',
        industry: 'Emerging venture',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=85',
        description:
            'A sharper market position, identity system and product-facing web experience built to make the offer easier to understand.',
        services: ['Brand Strategy', 'UX/UI', 'Development'],
    },
];

const getInitialTheme = () => (
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
);

function applyThemeMode(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('vireda-theme', theme);
    window.dispatchEvent(new CustomEvent('vireda-theme-change', { detail: theme }));
}

function useThemeMode() {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const handleThemeChange = (event) => setTheme(event.detail || getInitialTheme());

        window.addEventListener('vireda-theme-change', handleThemeChange);
        return () => window.removeEventListener('vireda-theme-change', handleThemeChange);
    }, []);

    const updateTheme = (nextTheme) => {
        const resolvedTheme = typeof nextTheme === 'function' ? nextTheme(getInitialTheme()) : nextTheme;

        setTheme(resolvedTheme);
        applyThemeMode(resolvedTheme);
    };

    return [theme, updateTheme];
}

function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => (
        typeof window !== 'undefined' && window.matchMedia(query).matches
    ));

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const handleChange = () => setMatches(mediaQuery.matches);

        handleChange();
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [query]);

    return matches;
}

function handleScrollTop() {
    window.scroll({
        top: 0,
        behavior: 'smooth',
    });
}

function BrandIcon({ brand }) {
    if (brand === 'linkedin') {
        return (
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.34V9h3.41v1.57h.05c.47-.9 1.64-1.85 3.37-1.85 3.61 0 4.28 2.37 4.28 5.46v6.27ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.54V9H7.1v11.45ZM22.23 0H1.76C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.76 24h20.47c.97 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0Z" />
            </svg>
        );
    }

    if (brand === 'x') {
        return (
            <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.84L0 1.15h7.6l5.24 6.93 6.06-6.93Zm-1.29 19.5h2.04L6.5 3.23H4.31l13.3 17.42Z" />
            </svg>
        );
    }

    if (brand === 'instagram') {
        return (
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="3" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
        );
    }

    return null;
}

function Logo() {
    return (
        <a className="logo" href="/" aria-label="VIREDÁ home">
            <img className="logo-image logo-image-light" src="/images/vireda-logo-light-420.png" alt="VIREDÁ" width="420" height="140" />
            <img className="logo-image logo-image-dark" src="/images/vireda-logo-dark-420.png" alt="" aria-hidden="true" width="420" height="140" />
        </a>
    );
}

function ThemeToggle() {
    const [theme, setTheme] = useThemeMode();

    return (
        <button
            className="icon-button"
            type="button"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}

function FooterThemeControls() {
    const [theme, setTheme] = useThemeMode();

    return (
        <div className="footer-theme-controls" aria-label="Theme and page controls">
            <button
                className={theme === 'light' ? 'is-active' : ''}
                type="button"
                onClick={() => setTheme('light')}
                aria-label="Switch to light mode"
                aria-pressed={theme === 'light'}
            >
                <Sun size={20} strokeWidth={1.5} />
            </button>
            <button type="button" onClick={handleScrollTop} aria-label="Scroll to top">
                <ArrowUp size={15} strokeWidth={1.8} />
            </button>
            <button
                className={theme === 'dark' ? 'is-active' : ''}
                type="button"
                onClick={() => setTheme('dark')}
                aria-label="Switch to dark mode"
                aria-pressed={theme === 'dark'}
            >
                <Moon size={20} strokeWidth={1.5} />
            </button>
        </div>
    );
}

function Navbar() {
    const isServicesPage = window.location.pathname === '/services';
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [overDarkSection, setOverDarkSection] = useState(true);
    const [mobileSection, setMobileSection] = useState(isServicesPage ? 'services' : null);
    const navRef = useRef(null);
    const serviceNavItems = servicePageServices.map((service) => {
        const slug = slugifyServiceTitle(service.title);

        return {
            label: service.title,
            href: `/services?service=${slug}#${slug}`,
            slug,
        };
    });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        let animationFrame;
        const updateLogoContrast = () => {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(() => {
                const probeY = 34;
                const darkSections = document.querySelectorAll('[data-nav-theme="dark"]');
                const isOverDarkSection = Array.from(darkSections).some((section) => {
                    const bounds = section.getBoundingClientRect();
                    return bounds.top <= probeY && bounds.bottom > probeY;
                });
                setOverDarkSection(isOverDarkSection);
            });
        };

        updateLogoContrast();
        window.addEventListener('scroll', updateLogoContrast, { passive: true });
        window.addEventListener('resize', updateLogoContrast);
        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('scroll', updateLogoContrast);
            window.removeEventListener('resize', updateLogoContrast);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (!open) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    const closeNavigation = () => {
        setOpen(false);
    };

    const handleServiceNavClick = (event, service) => {
        if (!isServicesPage) {
            closeNavigation();
            return;
        }

        event.preventDefault();
        window.history.pushState({}, '', service.href);
        window.dispatchEvent(new CustomEvent('vireda:open-service', { detail: { slug: service.slug } }));
        closeNavigation();
    };

    return (
        <header className={`navbar ${scrolled ? 'is-scrolled' : ''} ${overDarkSection ? 'is-over-dark' : ''} ${open ? 'menu-open' : ''}`} ref={navRef}>
            <div className="container nav-inner nav-shell">
                <Logo />
                <TubeLightNav activeLabel={isServicesPage ? 'Services' : undefined} items={[
                    { label: 'Home', href: '/', icon: Compass },
                    {
                        label: 'Services',
                        href: '/services',
                        icon: Box,
                        submenu: serviceNavItems.map((service) => ({
                            ...service,
                            onClick: (event) => handleServiceNavClick(event, service),
                        })),
                    },
                ]} />
                <div className="nav-actions">
                    <GetStartedButton href="#start" size="sm" className="nav-cta">Start a Conversation</GetStartedButton>
                    <ThemeToggle />
                    <button
                        className="icon-button menu-button"
                        type="button"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        aria-expanded={open}
                        onClick={() => setOpen((value) => !value)}
                    >
                        {open ? <X size={19} /> : <Menu size={19} />}
                    </button>
                </div>
            </div>
            <button className={`mobile-menu-backdrop ${open ? 'open' : ''}`} type="button" aria-label="Close menu" onClick={() => setOpen(false)} />
            <div className={`mobile-menu ${open ? 'open' : ''}`} aria-hidden={!open}>
                <div className="mobile-menu-header">
                    <Logo />
                    <button className="icon-button" type="button" aria-label="Close menu" onClick={() => setOpen(false)}><X size={19} /></button>
                </div>
                <div className="mobile-menu-content">
                    <a className="mobile-primary-link" href="/" onClick={closeNavigation}>Home <ArrowRight size={17} /></a>
                    <section className={mobileSection === 'services' ? 'open' : ''}>
                        <button type="button" onClick={() => setMobileSection((current) => current === 'services' ? null : 'services')}>
                            Services <ChevronDown size={17} />
                        </button>
                        <div className="mobile-submenu">
                            {serviceNavItems.map((service) => (
                                <a href={service.href} key={service.label} onClick={(event) => handleServiceNavClick(event, service)}>
                                    <Box size={18} />
                                    <span>
                                        <strong>{service.label}</strong>
                                    </span>
                                </a>
                            ))}
                        </div>
                    </section>
                </div>
                <div className="mobile-menu-footer">
                    <GetStartedButton href="#start" size="sm" onClick={closeNavigation}>Start a Conversation</GetStartedButton>
                </div>
            </div>
        </header>
    );
}

const heroTypewriterItems = [
    'A problem that needs solving.',
    'An idea that hasn’t found its shape yet.',
    'A process that could work better.',
    'An opportunity waiting to be explored.',
    'A vision that needs the right team and technology behind it.',
];

function HeroTypewriter() {
    const [itemIndex, setItemIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentText = heroTypewriterItems[itemIndex];
        const isComplete = visibleCount === currentText.length;
        const isEmpty = visibleCount === 0;
        const delay = isComplete && !isDeleting ? 1500 : isDeleting ? 5 : 34;

        const timeout = window.setTimeout(() => {
            if (!isDeleting && isComplete) {
                setIsDeleting(true);
                return;
            }

            if (isDeleting && isEmpty) {
                setIsDeleting(false);
                setItemIndex((current) => (current + 1) % heroTypewriterItems.length);
                return;
            }

            setVisibleCount((current) => current + (isDeleting ? -1 : 1));
        }, delay);

        return () => window.clearTimeout(timeout);
    }, [itemIndex, visibleCount, isDeleting]);

    const currentText = heroTypewriterItems[itemIndex];

    return (
        <p className="hero-typewriter" aria-live="polite">
            <span>{currentText.slice(0, visibleCount)}</span>
        </p>
    );
}

function Hero() {
    const showDesktopObject = useMediaQuery('(min-width: 641px)');

    return (
        <section className="hero radial-hero" id="top" data-nav-theme="dark">
            {showDesktopObject && <HeroGridBackground />}
            {showDesktopObject && (
                <Suspense fallback={null}>
                    <WovenHeroObject />
                </Suspense>
            )}
            <div className="radial-hero-glow" aria-hidden="true" />
            <div className="blackhole-copy">
                <div className="blackhole-copy-inner">
                    <p className="hero-kicker">Management &amp; Technology Consulting</p>
                    <h1>
                        Let&apos;s build
                        <br />
                        <span className="hero-title-highlight">something better.</span>
                    </h1>
                    <div className="blackhole-subcopy">
                        <p className="hero-subcopy-intro">Every business has something worth building:</p>
                        <HeroTypewriter />
                        <p className="hero-subcopy-summary">
                            VIREDÁ brings together strategy, technology and data to help businesses build better,
                            work smarter and move forward with confidence.
                        </p>
                    </div>
                    <div className="hero-actions">
                        <GetStartedButton href="#start">Start a conversation</GetStartedButton>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ServicesMarquee() {
    const items = [
        'Business Consulting',
        'Digital Transformation',
        'Software',
        'Websites',
        'Data & Analytics',
        'AI & Automation',
        'Product Development',
        'Brand & Creative',
    ];
    const marqueeLabel = items.join(', ');

    return (
        <div className="marquee" aria-label={marqueeLabel}>
            <div className="marquee-track">
                {[0, 1, 2, 3].map((set) => (
                    <React.Fragment key={set}>
                        {items.map((item) => (
                            <React.Fragment key={`${set}-${item}`}>
                                <span className="marquee-item">{item}</span>
                                <i className="marquee-divider" aria-hidden="true" />
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

function CapabilityVisual({ type }) {
    return (
        <div className={`capability-visual ${type}`} aria-hidden="true">
            {type === 'strategy' && (
                <div className="strategy-visual">
                    <svg className="strategy-pyramid-scene" viewBox="0 0 900 675" role="img">
                        <defs>
                            <linearGradient id="pyramidIvory" x1="0%" x2="100%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#fffaf0" />
                                <stop offset="52%" stopColor="#eee8db" />
                                <stop offset="100%" stopColor="#d9d0bf" />
                            </linearGradient>
                            <linearGradient id="pyramidSide" x1="0%" x2="100%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#d7ccba" />
                                <stop offset="100%" stopColor="#f9f4ea" />
                            </linearGradient>
                            <linearGradient id="pyramidTop" x1="0%" x2="100%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#fffaf0" />
                                <stop offset="100%" stopColor="#e6dece" />
                            </linearGradient>
                            <linearGradient id="goldCap" x1="18%" x2="88%" y1="10%" y2="92%">
                                <stop offset="0%" stopColor="#f7dc85" />
                                <stop offset="30%" stopColor="#d4af55" />
                                <stop offset="62%" stopColor="#b88a2a" />
                                <stop offset="100%" stopColor="#f0ca68" />
                            </linearGradient>
                            <linearGradient id="goldCapSide" x1="0%" x2="100%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#a77a22" />
                                <stop offset="100%" stopColor="#e2bd60" />
                            </linearGradient>
                            <filter id="pyramidShadow" x="-20%" y="-30%" width="150%" height="170%">
                                <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#4a3520" floodOpacity="0.18" />
                            </filter>
                            <filter id="blockShadow" x="-18%" y="-35%" width="140%" height="180%">
                                <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#4a3520" floodOpacity="0.16" />
                            </filter>
                        </defs>

                        <ellipse className="pyramid-floor-shadow" cx="292" cy="582" rx="244" ry="33" />

                        <g className="pyramid-stack" filter="url(#pyramidShadow)">
                            <g className="pyramid-level level-impact">
                                <path className="block-top" d="M88 466 L420 424 L512 482 L164 532 Z" />
                                <path className="block-front" d="M164 532 L512 482 L560 573 L140 633 Z" />
                                <path className="block-side" d="M88 466 L164 532 L140 633 L40 560 Z" />
                                <g className="pyramid-icon impact-icon">
                                    <rect x="254" y="565" width="22" height="42" />
                                    <rect x="289" y="546" width="22" height="61" />
                                    <rect x="324" y="519" width="22" height="88" />
                                </g>
                            </g>

                            <g className="pyramid-level level-alignment" filter="url(#blockShadow)">
                                <path className="block-top" d="M142 348 L372 319 L452 365 L206 401 Z" />
                                <path className="block-front" d="M206 401 L452 365 L492 454 L190 499 Z" />
                                <path className="block-side" d="M142 348 L206 401 L190 499 L106 440 Z" />
                                <g className="pyramid-icon people-icon">
                                    <circle cx="310" cy="413" r="17" />
                                    <circle cx="281" cy="424" r="13" />
                                    <circle cx="340" cy="424" r="13" />
                                    <path d="M274 466 C278 439 300 432 310 432 C320 432 342 439 346 466" />
                                    <path d="M246 459 C250 442 264 435 280 437" />
                                    <path d="M374 459 C370 442 356 435 340 437" />
                                </g>
                            </g>

                            <g className="pyramid-level level-strategy" filter="url(#blockShadow)">
                                <path className="block-top" d="M194 236 L338 218 L404 253 L250 276 Z" />
                                <path className="block-front" d="M250 276 L404 253 L438 327 L238 357 Z" />
                                <path className="block-side" d="M194 236 L250 276 L238 357 L166 307 Z" />
                                <g className="pyramid-icon strategy-icon">
                                    <rect x="288" y="284" width="56" height="56" />
                                    <path d="M301 300 L315 314 M315 300 L301 314" />
                                    <path d="M330 322 L344 336 M344 322 L330 336" />
                                    <path d="M303 330 C326 326 338 309 337 294" />
                                    <path d="M337 294 L349 304 M337 294 L325 302" />
                                </g>
                            </g>

                            <g className="pyramid-level level-vision" filter="url(#blockShadow)">
                                <path className="cap-left" d="M284 76 L194 235 L286 254 Z" />
                                <path className="cap-front" d="M284 76 L286 254 L418 235 Z" />
                                <path className="cap-base" d="M194 235 L286 254 L418 235 L338 218 Z" />
                                <path className="cap-highlight" d="M287 87 C278 127 260 189 250 238" />
                                <g className="pyramid-icon vision-icon">
                                    <circle cx="306" cy="185" r="31" />
                                    <circle cx="306" cy="185" r="20" />
                                    <circle cx="306" cy="185" r="8" />
                                    <path d="M306 185 L350 141" />
                                    <path d="M342 143 L360 136 L354 154" />
                                </g>
                            </g>
                        </g>

                        <g className="pyramid-connectors">
                            <path d="M390 185 H530" />
                            <circle cx="530" cy="185" r="8" />
                            <path d="M432 310 H532" />
                            <circle cx="532" cy="310" r="8" />
                            <path d="M488 434 H562" />
                            <circle cx="562" cy="434" r="8" />
                            <path d="M548 560 H586" />
                            <circle cx="586" cy="560" r="8" />
                        </g>

                        <g className="pyramid-labels">
                            <text className="pyramid-heading" x="574" y="192">Vision</text>
                            <text className="pyramid-copy" x="574" y="230">Where we want to go</text>

                            <text className="pyramid-heading" x="574" y="317">Strategy</text>
                            <text className="pyramid-copy" x="574" y="355">The plan that gets us there</text>

                            <text className="pyramid-heading" x="600" y="442">Alignment</text>
                            <text className="pyramid-copy" x="600" y="480">Teams, systems &amp; resources</text>

                            <text className="pyramid-heading" x="620" y="568">Impact</text>
                            <text className="pyramid-copy" x="620" y="606">Measurable, lasting results</text>
                        </g>

                        <g className="pyramid-return-path">
                            <path d="M790 170 C948 181 936 520 844 560" />
                            <path d="M790 170 L805 160 M790 170 L805 181" />
                            <path d="M844 560 L861 558 M844 560 L857 548" />
                            <circle cx="884" cy="373" r="12" />
                        </g>
                    </svg>
                </div>
            )}
            {type === 'brand' && (
                <div className="brand-visual">
                    <div className="brand-fragments">
                        {Array.from({ length: 25 }).map((_, index) => (
                            <span className={`brand-fragment frag-${index + 1}`} key={index} />
                        ))}
                    </div>
                    <svg viewBox="0 0 260 320" className="brand-guides">
                        {[60, 95, 130, 165, 200, 235].map((y) => (
                            <path d={`M12 ${y} C76 ${y - 10}, 132 ${y - 8}, 238 160`} key={y} />
                        ))}
                    </svg>
                    <div className="brand-assets">
                        <svg viewBox="0 0 390 270" className="system-guides">
                            <path d="M72 82 C118 112, 154 118, 218 66" />
                            <path d="M82 166 C142 162, 178 142, 264 145" />
                            <path d="M190 88 C226 116, 270 120, 338 128" />
                            <path d="M126 224 C190 220, 240 204, 316 186" />
                        </svg>
                        <div className="logo-tile">A</div>
                        <div className="poster">A<span /></div>
                        <div className="mini-card"><strong>A</strong><i /><i /></div>
                        <div className="phone"><span>A<i /></span></div>
                        <div className="palette"><i /><i /><i /><i /><i /></div>
                        <div className="type-spec"><strong>Aa</strong><span /><span /><span /><span /><span /></div>
                    </div>
                </div>
            )}
            {type === 'technology' && (
                <div className="technology-visual">
                    <div className="tech-particles" />
                    <div className="tech-column tech-inputs">
                        {[
                            [User, 'Users'], [Globe, 'Web'], [Smartphone, 'Mobile'], [Database, 'Systems'], [Wifi, 'Sensors'],
                        ].map(([Icon, label]) => (
                            <span className="tech-pill" key={label}><Icon size={15} />{label}</span>
                        ))}
                    </div>
                    <svg viewBox="0 0 680 360" className="tech-lines">
                        {[70, 116, 162, 208, 254].map((y) => <path d={`M150 ${y} C245 ${y}, 260 180, 330 180`} key={`l-${y}`} />)}
                        {[70, 116, 162, 208, 254].map((y) => <path d={`M350 180 C430 180, 438 ${y}, 530 ${y}`} key={`r-${y}`} />)}
                        <path d="M340 44 L340 136" />
                        <path d="M340 224 L340 318" />
                    </svg>
                    <div className="tech-node cloud-node"><Cloud size={20} /></div>
                    <div className="tech-node db-node"><Database size={20} /></div>
                    <div className="tech-hub">
                        <span className="hub-ring ring-one" />
                        <span className="hub-ring ring-two" />
                        <span className="hub-ring ring-three" />
                        <Box size={30} />
                    </div>
                    <div className="tech-column tech-outputs">
                        {[
                            [Grid2X2, 'Applications'], [Settings, 'Automation'], [Sparkles, 'AI Insights'], [BarChart3, 'Dashboards'], [Puzzle, 'Integrations'],
                        ].map(([Icon, label]) => (
                            <span className="tech-pill" key={label}><Icon size={15} />{label}</span>
                        ))}
                    </div>
                    {[1, 2, 3, 4].map((item) => <span className={`tech-signal tech-signal-${item}`} key={item} />)}
                </div>
            )}
        </div>
    );
}

const getCapabilityStart = (cardIndex) => (cardIndex === 0 ? 0 : 0.16 + cardIndex * 0.24);
const clampProgress = (value) => Math.max(0, Math.min(1, value));

function CapabilityCard({ capability, index, isPinned, onActivate }) {
    const handleKeyDown = (event) => {
        if (!isPinned) {
            return;
        }

        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        event.preventDefault();
        onActivate(index);
    };

    return (
        <article
            className={`capability-card card-${capability.number}`}
            data-card-index={index}
            onClick={() => isPinned && onActivate(index)}
            onKeyDown={handleKeyDown}
            role={isPinned ? 'button' : undefined}
            style={{
                '--card-index': index,
                '--card-y': isPinned && index !== 0 ? '108%' : '0px',
                '--card-width': '100%',
                '--card-opacity': isPinned && index !== 0 ? 0 : 1,
                '--card-pointer-events': isPinned && index !== 0 ? 'none' : 'auto',
            }}
            tabIndex={isPinned ? (index === 0 ? 0 : -1) : undefined}
        >
            <div className="capability-content">
                <div className="capability-number">
                    <span>{capability.number}</span>
                    <strong>{capability.title}</strong>
                </div>
                <h3>{capability.statement}</h3>
                <div className="capability-copy">
                    {capability.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </article>
    );
}

function CoreCapabilities() {
    const sectionRef = useRef(null);
    const usePinnedCards = useMediaQuery('(min-width: 0px)');

    const scrollToCapabilityCard = (index) => {
        const section = sectionRef.current;

        if (!section) {
            return;
        }

        const rect = section.getBoundingClientRect();
        const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
        const sectionTop = window.scrollY + rect.top;
        const targetProgress = clampProgress(getCapabilityStart(index) + (index === 0 ? 0 : 0.23));
        const targetTop = sectionTop + scrollable * targetProgress;

        window.scrollTo({
            behavior: 'smooth',
            top: targetTop,
        });
    };

    useEffect(() => {
        if (!usePinnedCards) {
            return undefined;
        }

        let frame = null;

        const updateProgress = () => {
            const section = sectionRef.current;

            if (!section) {
                return;
            }

            const rect = section.getBoundingClientRect();
            const scrollable = Math.max(1, rect.height - window.innerHeight);
            const nextProgress = Math.max(0, Math.min(1, -rect.top / scrollable));
            const cards = section.querySelectorAll('.capability-card');

            cards.forEach((card) => {
                const index = Number(card.dataset.cardIndex || 0);
                const start = getCapabilityStart(index);
                const localProgress = index === 0 ? 1 : clampProgress((nextProgress - start) / 0.22);
                const stackOffset = index * 48;
                const hiddenOffset = index === 0 ? 0 : 108 * (1 - localProgress);
                const y = index === 0 ? `${stackOffset}px` : `calc(${hiddenOffset}% + ${stackOffset * localProgress}px)`;
                let shrinkByLaterCards = 0;
                let collapsed = false;

                for (let laterIndex = index + 1; laterIndex < capabilities.length; laterIndex += 1) {
                    const laterProgress = clampProgress((nextProgress - getCapabilityStart(laterIndex)) / 0.22);

                    shrinkByLaterCards += laterProgress * 6;
                    collapsed = collapsed || laterProgress > 0.94;
                }

                const visible = index === 0 || localProgress > 0.02;

                card.style.setProperty('--card-y', y);
                card.style.setProperty('--card-width', `${Math.max(86, 100 - shrinkByLaterCards)}%`);
                card.style.setProperty('--card-opacity', visible ? '1' : '0');
                card.style.setProperty('--card-pointer-events', visible ? 'auto' : 'none');
                card.classList.toggle('is-collapsed', collapsed);
                card.tabIndex = visible ? 0 : -1;
            });
        };

        const onScroll = () => {
            if (frame) {
                return;
            }

            frame = window.requestAnimationFrame(() => {
                frame = null;
                updateProgress();
            });
        };

        updateProgress();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', updateProgress);

        return () => {
            if (frame) {
                window.cancelAnimationFrame(frame);
            }

            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', updateProgress);
        };
    }, [usePinnedCards]);

    return (
        <section className="capabilities-section" id="what-we-do" ref={sectionRef}>
            <div className="capabilities-pin">
                <div className="container capabilities-intro">
                    <p className="eyebrow">Our Core Capabilities</p>
                    <TextRevealByWord
                        as="h2"
                        className="section-heading-reveal"
                        highlight="Shape it"
                        text="Think it. Shape it. Build it."
                    />
                    <p>
                        Whether you're starting something new, improving an existing business or trying to solve a
                        problem that doesn't have an obvious answer, we bring the right disciplines together to find a
                        way forward.
                    </p>
                </div>
                <div className="container capabilities-stack">
                    {capabilities.map((capability, index) => (
                        <CapabilityCard
                            capability={capability}
                            index={index}
                            isPinned={usePinnedCards}
                            key={capability.title}
                            onActivate={scrollToCapabilityCard}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ServicesSection() {
    const serviceIcons = [Compass, Globe, Box, BarChart3, Bot, Palette];

    return (
        <section className="section services-section" id="services" data-nav-theme="dark">
            <NeonMesh />
            <div className="container section-heading">
                <p className="eyebrow">What We Deliver</p>
                <TextRevealByWord
                    as="h2"
                    className="section-heading-reveal"
                    highlight="designed for impact"
                    text="Purpose-built solutions, designed for impact."
                />
                <p>
                    Every engagement is shaped around the challenge, the opportunity and the outcome. We focus on
                    creating solutions that make a meaningful difference to your organisation.
                </p>
            </div>
            <div className="container deliver-grid">
                {services.map((service, index) => {
                    const targetService = servicePageServices[index] || service;

                    return (
                        <a
                            aria-label={`View ${service.title} service details`}
                            className={`deliver-card deliver-card-${index + 1}`}
                            href={`/services?service=${slugifyServiceTitle(targetService.title)}#${slugifyServiceTitle(targetService.title)}`}
                            key={service.title}
                        >
                            <div className="deliver-card-top">
                                <IconStack aria-hidden="true">
                                    {React.createElement(serviceIcons[index], { size: 17, strokeWidth: 1.7 })}
                                </IconStack>
                            </div>
                            <div className="deliver-card-body">
                                <h3>{service.title}</h3>
                                <p className="service-statement">{service.statement}</p>
                                <p>{service.description}</p>
                            </div>
                            <div className="tags">
                                {service.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                            <span className="deliver-card-link" aria-hidden="true">
                                <ArrowRight size={17} strokeWidth={1.8} />
                            </span>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}

function OurWork() {
    return (
        <section className="section work-section" id="our-work">
            <div className="container">
                <header className="work-heading">
                    <div>
                    <p className="eyebrow">Our Work</p>
                        <TextRevealByWord
                            as="h2"
                            className="section-heading-reveal"
                            highlight="Meaningful outcomes"
                            text="Selected work. Meaningful outcomes."
                        />
                    </div>
                    <p>
                        A selection of projects bringing strategy, technology, data and creativity together to move
                        organisations forward.
                    </p>
                </header>
                <ProjectShowcase projects={projects} />
            </div>
        </section>
    );
}

function AboutVireda() {
    return (
        <section className="section about-section" id="about">
            <div className="container">
                <header className="about-header">
                    <p className="eyebrow">About VIREDÁ</p>
                    <h2 className="about-title">
                        Built to make better things <span>possible.</span>
                    </h2>
                    <p className="about-lead">VIREDÁ was created around a simple belief: good ideas deserve the opportunity to become something meaningful.</p>
                </header>
                <div className="about-body">
                    <div className="about-system" aria-label="VIREDÁ works across strategy, technology, data and creativity">
                        <img
                            className="about-system-image"
                            loading="lazy"
                            decoding="async"
                            src="/images/about-strategy-workshop.jpg"
                            alt="A collaborative strategy workshop with a team planning ideas on a glass board"
                        />
                    </div>
                    <div className="about-copy-grid">
                    <p>We don't believe in offering solutions simply because they can be offered. We work with organisations to understand what they're trying to achieve, uncover what's getting in the way, and find the path that moves them forward.</p>
                    <p>We work at the intersection of strategy, technology, data and creativity turning challenges into opportunities and ideas into solutions people can actually build on.</p>
                    <p>Every engagement starts with understanding and ends with something tangible: a clearer direction, a better way of working, a solution that works, or an opportunity brought to life.</p>
                    <p>We measure our work by the difference it makes, not simply by what we deliver.</p>
                        <GetStartedButton href="#about" size="sm" className="about-link">More about VIREDÁ</GetStartedButton>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FinalCTA({
    eyebrow = 'Ready To Begin?',
    highlight = 'matters to your business',
    text = "Let's build what matters to your business.",
    primaryLabel = 'Start a conversation',
    primaryHref = 'mailto:hello@vireda.com',
    secondaryLabel,
    secondaryHref = 'mailto:hello@vireda.com',
}) {
    return (
        <section className="final-cta section" id="start">
            <div className="container">
                <p className="eyebrow">{eyebrow}</p>
                <TextRevealByWord
                    as="h2"
                    className="section-heading-reveal"
                    highlight={highlight}
                    text={text}
                />
                <div className="final-cta-actions">
                    <GetStartedButton href={primaryHref}>{primaryLabel}</GetStartedButton>
                    {secondaryLabel && (
                        <a className="final-cta-secondary" href={secondaryHref}>{secondaryLabel}</a>
                    )}
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="footer" id="insights" data-nav-theme="dark">
            <div className="container footer-intro">
                <div className="footer-brand">
                    <Logo />
                    <p>
                        We bring strategy, technology, data and creativity together to help businesses shape better
                        ideas, build useful systems and move forward with clarity.
                    </p>
                </div>
                <nav className="footer-nav" aria-label="Footer navigation">
                    {footerSections.map((section) => (
                        <div className="footer-nav-section" key={section.title}>
                            <h2>{section.title}</h2>
                            <ul>
                                {section.links.map((item) => (
                                    <li key={item.label}>
                                        <a href={item.href}>{item.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>

            <div className="container footer-social-row">
                <div className="footer-social-links" aria-label="Social links">
                    {socialLinks.map((item) => {
                        const Icon = item.icon;
                        const isExternal = item.href.startsWith('http');

                        return (
                            <a
                                href={item.href}
                                key={item.label}
                                aria-label={item.label}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noreferrer' : undefined}
                            >
                                {Icon ? <Icon size={19} strokeWidth={1.6} /> : <BrandIcon brand={item.brand} />}
                            </a>
                        );
                    })}
                </div>
                <FooterThemeControls />
            </div>

            <div className="container footer-line">
                <span>Strategy. Technology. Data. Creativity.</span>
                <span className="footer-credit">
                    <span>&copy; {new Date().getFullYear()} VIREDÁ.</span>
                    <span>Management &amp; Technology Consulting.</span>
                </span>
            </div>
        </footer>
    );
}

const servicesPageIssues = [
    {
        number: '01',
        title: "Your business is growing, but the way you work hasn't.",
        body: 'Manual processes, disconnected systems and unnecessary admin can quickly become a bottleneck. We help simplify operations, improve processes and build systems that can grow with you.',
    },
    {
        number: '02',
        title: "You're generating interest, but opportunities are slipping away.",
        body: "Slow responses, inconsistent follow-up and unclear sales processes can turn good enquiries into missed opportunities. We help create better lead, CRM and conversion systems that keep opportunities moving.",
    },
    {
        number: '03',
        title: "You know AI could help. You just don't know where.",
        body: "AI shouldn't be added simply because everyone else is using it. We identify where AI and automation can genuinely save time, improve processes or create new possibilities for your business.",
    },
    {
        number: '04',
        title: "Your business has evolved. Your brand hasn't.",
        body: "Sometimes the business has outgrown its identity, website or digital presence. We create brands and digital experiences that better reflect where your business is today and where it's going next.",
    },
];

const servicePageServices = [
    {
        number: '01',
        title: 'Business & Management Consulting',
        intro: "Growth can expose problems that weren't obvious before: inefficient processes, unnecessary admin, inconsistent sales activity, disconnected systems and too much time spent on work that doesn't move the business forward.",
        paragraphs: [
            'We assess how your business operates, identify where time, resources and opportunities are being lost, and help redesign the processes and systems that matter.',
            'From improving operations and documenting processes to building better lead management and conversion systems, we help create a leaner, clearer and more effective way of working.',
        ],
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=85',
        imageAlt: 'A business team mapping processes and strategy on a wall',
        tags: ['Business Strategy', 'Operations & Process Improvement', 'Process Mapping', 'Operating Models', 'Workflow Design & Automation', 'Lead Conversion Systems', 'CRM Setup & Configuration', 'Sales Process Design'],
        cards: [
            ['Find Where You Are Actually Losing Time', "We examine how work moves through your business and identify the bottlenecks, duplication and admin nobody's noticed yet."],
            ['Build Processes That Hold Up as You Grow', "We redesign how your team works: clearer, leaner, and built to keep up as the business grows, not just to fix today's problem."],
            ['Turn More Leads Into Customers', "Create structured lead pipelines, improve follow-up and introduce the right CRM and conversion processes so good opportunities don't get lost."],
            ['Make Better Working the Default', "New processes only stick if people actually use them. We build in the habits, ownership and simple documentation that keep things working long after we've left."],
        ],
    },
    {
        number: '02',
        title: 'Websites & Digital Experiences',
        intro: 'Build a digital presence that works as hard as your business does. Your website should do more than look good. It should be fast, easy to use, discoverable and designed to turn attention into action.',
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=85',
        imageAlt: 'A designer working on a website interface across desktop screens',
        tags: ['Business Websites', 'Corporate Websites', 'Landing Pages', 'Ecommerce', 'UX/UI', 'Website Redesigns', 'CMS', 'Website Development', 'Digital Experiences', 'Website Optimisation'],
        cta: 'Discuss your website',
        cards: [
            ['Fast & High-Performing', 'Built for speed and performance, creating a smoother experience for visitors while supporting stronger search visibility.'],
            ['Designed for Conversion', 'Every element has a purpose, guiding visitors towards the information, interaction or action that matters.'],
            ['SEO-Ready', 'Built with search visibility in mind from the start, with a strong technical foundation to help the right people find you.'],
            ['Fully Customised', 'No generic templates or off-the-shelf solutions. We build around your brand, your audience, your objectives and the way your business works.'],
        ],
    },
    {
        number: '03',
        title: 'Software & Products Development',
        intro: 'Most ideas never make it past the whiteboard. We build the ones that should.',
        paragraphs: [
            "We design and build the software, digital products and platforms those ideas actually need, from early thinking and validation through to something real, built to last.",
            "Because the right product isn't just a good idea brought to life, it's a new way to save time, win customers, or open up revenue you didn't have before.",
        ],
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=85',
        imageAlt: 'A software product team collaborating around application development',
        tags: ['Bespoke Software', 'Web Applications', 'Digital Products', 'Product Strategy', 'MVP Development', 'Prototyping', 'Product Design', 'Product Development', 'CRM Solutions', 'Venture Development'],
        cta: 'Explore Software & Products Development',
        cards: [
            ['Built Around Your Business', "No two products or businesses have exactly the same needs. We build solutions around your users, objectives and the problem you're trying to solve."],
            ['Validated Before You Build', "We test the idea before committing to the build, so you're not spending months on something the market was never going to want."],
            ['Designed to Evolve', 'Build with the future in mind. Our products are designed to adapt as your users, business and opportunities develop.'],
            ['Technology With Purpose', 'The technology is only valuable if it solves a real problem. We focus on building useful, practical products rather than adding complexity for the sake of it.'],
        ],
    },
    {
        number: '04',
        title: 'Data & Analytics',
        intro: 'Your business already has data. The challenge is making it accessible, understandable and useful. We help organisations bring data together, build reporting people trust, uncover meaningful insights and create tools that make information easier to use across the business.',
        paragraphs: ['From dashboards and management reporting to custom internal systems, we turn data into something your people can actually see, understand and act on.'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85',
        imageAlt: 'Business intelligence dashboards and data visualisations on a screen',
        tags: ['Data Analysis', 'Business Intelligence', 'Power BI & Dashboards', 'Management Reporting', 'Data Visualisation', 'KPI Reporting', 'Reporting Automation', 'Data Strategy', 'API & Data Integrations'],
        cta: 'Explore Data & Analytics',
        cards: [
            ['Numbers You Can Trust', 'Replace manual, error-prone reporting with systems that update themselves and are actually right.'],
            ['No More Guesswork', 'Bring scattered data together into one place, so decisions are based on the full picture, not whichever report someone pulled last.'],
            ['Reports That Build Themselves', "Automate reporting and repetitive data processes so your team isn't stuck compiling numbers instead of acting on them."],
            ['Built to Be Used, Not Just Built', 'Dashboards and reporting clear enough that people actually check them, not ones that get built once and ignored.'],
        ],
    },
    {
        number: '05',
        title: 'AI & Automation',
        intro: "AI isn't just for technology companies. It's for any business looking to save time, improve efficiency and create new ways of working.",
        paragraphs: [
            'We help businesses identify where AI and automation can make a genuine difference: from intelligent assistants and automated workflows to AI-powered analytics and customer experiences.',
            "The goal isn't to use AI for the sake of it. It's to give your people more time to focus on the work that matters.",
        ],
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=85',
        imageAlt: 'AI technology interface with connected automation patterns',
        tags: ['AI Chatbot Development', 'AI Automation', 'AI Agent Development', 'AI Training & Workshops', 'AI Content Generation', 'AI-Powered Analytics', 'AI Integration', 'Custom AI Solutions', 'AI Strategy & Consulting', 'AI Workflow Automation', 'AI-Powered Customer Service'],
        cta: 'Explore AI & Automation',
        cards: [
            ['Save Time with Automation', 'Automate repetitive tasks and reduce the amount of manual work your team has to do every day.'],
            ['Start Small, Prove It Works', 'We identify one high-impact use case first, not a company-wide AI rollout on day one. Momentum builds from results, not ambition.'],
            ['Smarter Decisions', 'Use AI and data to uncover patterns, surface useful insights and help your team make better-informed decisions.'],
            ['AI Your Team Understands', 'We can help your team understand, adopt and confidently use AI tools in their day-to-day work.'],
        ],
    },
    {
        number: '06',
        title: 'Brand & Creative',
        intro: 'Make people understand why you matter. A strong brand should do more than look good. It should communicate who you are, differentiate you from competitors and create a consistent experience wherever people encounter your business.',
        paragraphs: [
            "Your brand is more than a logo. It's how people recognise your business, understand what you stand for and decide whether to trust you.",
            'We create distinctive brand identities that bring together strategy, visual identity and creative direction, giving your business a clear and consistent presence across every touchpoint.',
        ],
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=85',
        imageAlt: 'A creative brand identity design workspace with colour and layout materials',
        tags: ['Brand Strategy', 'Brand Positioning', 'Naming', 'Visual Identity', 'Logo Design', 'Brand Guidelines', 'Creative Direction', 'Digital Design', 'UX/UI', 'Marketing Collateral'],
        cta: 'Build your brand',
        cards: [
            ['Stand Out & Be Remembered', 'Create a distinctive identity that helps your business cut through the noise and gives people a reason to remember you.'],
            ['Logos With Purpose', 'Design memorable, versatile logos that capture the character of your business and work across digital and physical applications.'],
            ['A Brand People Trust, Not Just Notice', 'Standing out matters less than being believed. We build brands that earn confidence, not just attention.'],
            ['Creative That Supports Your Business', 'From digital assets to marketing materials, create communications that reinforce your identity and help you connect with your audience.'],
        ],
    },
];

const serviceFeatureIconPaths = [
    ['circle:12,12,7', 'path:M12 7v5l3 2'],
    ['path:M4 7h7v7H4z', 'path:M13 10h7v7h-7z', 'path:M11 11h2'],
    ['path:M7 12h10', 'path:M8 9l-3 3 3 3', 'path:M16 9l3 3-3 3'],
    ['path:M8 5h8', 'path:M6 9h12', 'path:M8 13h8', 'path:M10 17h4'],
    ['path:M5 17c2-7 12-7 14 0', 'path:M8 17a4 4 0 0 1 8 0', 'path:M12 13v-4'],
    ['path:M5 12h14', 'path:M12 5v14', 'circle:12,12,3'],
    ['circle:10,10,5', 'path:M14 14l5 5', 'path:M8 10l1.5 1.5L12 8'],
    ['path:M7 17l10-10', 'path:M8 8l8 8', 'path:M5 19h14'],
    ['circle:9,9,3', 'circle:15,15,3', 'path:M11 11l2 2'],
    ['path:M6 17h12', 'path:M8 17V7h8v10', 'path:M10 10h4'],
    ['path:M5 16l5-5 3 3 6-7', 'path:M15 7h4v4'],
    ['circle:12,12,7', 'circle:12,12,3', 'path:M12 2v3', 'path:M22 12h-3'],
    ['path:M12 4l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V7z', 'path:M9 12l2 2 4-4'],
    ['path:M5 8l7-4 7 4-7 4z', 'path:M5 12l7 4 7-4', 'path:M5 16l7 4 7-4'],
    ['path:M6 8h8a4 4 0 0 1 0 8H8', 'path:M8 12l-3 4 3 4'],
    ['path:M6 6h12v12H6z', 'path:M9 9h6v6H9z', 'path:M4 12h2', 'path:M18 12h2'],
    ['path:M13 2L5 14h6l-1 8 8-12h-6z'],
    ['path:M9 18h6', 'path:M10 22h4', 'path:M8 10a4 4 0 1 1 8 0c0 2-2 3-2 5h-4c0-2-2-3-2-5z'],
    ['path:M7 8h10', 'path:M7 12h7', 'path:M7 16h10', 'path:M17 8l2 2-2 2'],
    ['path:M5 19h14', 'path:M7 19V9l5-4 5 4v10', 'path:M10 13h4'],
    ['path:M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z', 'circle:12,12,3'],
    ['path:M12 3l2.4 4.8 5.3.8-3.8 3.7.9 5.2L12 15l-4.8 2.5.9-5.2-3.8-3.7 5.3-.8z'],
    ['path:M5 9h4l7-4v14l-7-4H5z', 'path:M19 10a4 4 0 0 1 0 4'],
    ['path:M4 20l5-1 10-10-4-4L5 15z', 'path:M13 7l4 4'],
];

function ServiceFeatureIcon({ serviceIndex, cardIndex, ...props }) {
    const paths = serviceFeatureIconPaths[(serviceIndex * 4) + cardIndex] ?? serviceFeatureIconPaths[0];

    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
            {paths.map((shape) => {
                const [type, value] = shape.split(':');

                if (type === 'circle') {
                    const [cx, cy, r] = value.split(',');
                    return <circle key={shape} cx={cx} cy={cy} r={r} />;
                }

                return <path key={shape} d={value} />;
            })}
        </svg>
    );
}

const servicePageResults = [
    {
        client: 'Health & Wellness Business',
        sector: 'Healthcare',
        imageSrc: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85',
        imageAlt: 'Healthcare team reviewing patient enquiries',
        tag: 'Outcome',
        brandLogoSrc: '/images/vireda-logo-dark-420.png',
        problem: 'Good enquiries were coming in but too many were going cold.',
        body: 'Enquiries were being handled manually, meaning responses could be delayed and follow-up was inconsistent.',
        actionLabel: 'What we implemented',
        changes: ['Faster enquiry response and lead routing', 'Automated appointment links', "Structured follow-up for enquiries that didn't book", 'Simple lead pipeline to track enquiry to booking', 'Automated post-appointment review requests'],
        resultLead: 'More consistent follow-up',
        result: 'with fewer enquiries falling through the cracks.',
        quote: 'We had a much clearer process for following up, and the team stopped having to remember everything manually.',
    },
    {
        client: 'E-commerce Brand',
        sector: 'Retail / E-commerce',
        imageSrc: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85',
        imageAlt: 'E-commerce team reviewing online sales performance',
        tag: 'Conversion',
        brandLogoSrc: '/images/vireda-logo-dark-420.png',
        problem: "The website was getting traffic. It wasn't doing enough with it.",
        body: 'Customers were reaching product pages but dropping out before completing their purchase, while the team had limited insight into where the biggest opportunities were.',
        actionLabel: 'What we changed',
        changes: ['Reviewed the customer journey', 'Reworked key conversion points', 'Simplified product navigation', 'Improved mobile experience', 'Introduced conversion and behaviour reporting'],
        resultLead: '18% increase',
        result: 'in completed purchases following the changes.',
        quote: 'We thought we needed more traffic. We actually needed to make better use of the traffic we already had.',
    },
    {
        client: 'Independent Property Group',
        sector: 'Property / Real Estate',
        imageSrc: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85',
        imageAlt: 'Modern property buildings and management activity',
        tag: 'Operations',
        brandLogoSrc: '/images/vireda-logo-dark-420.png',
        problem: 'The team was managing hundreds of properties through spreadsheets, emails and too many tabs.',
        body: 'Property information was spread across different systems, making it difficult to keep records up to date and easy for important tasks to get missed.',
        actionLabel: 'What we changed',
        changes: ['Centralised property and tenancy information', 'Built a clearer maintenance workflow', 'Automated tenant and contractor notifications', 'Introduced task ownership and escalation points', 'Created management dashboards for portfolio activity'],
        resultLead: 'One clearer view',
        result: 'of the portfolio, with less time spent chasing updates and checking spreadsheets.',
        quote: "We didn't realise how much time we were losing just trying to find information. Having everything in one place changed the way the team worked.",
    },
    {
        client: 'Accounting Firm',
        sector: 'Professional Services',
        imageSrc: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85',
        imageAlt: 'Professional services team working through financial documents',
        tag: 'Brand',
        brandLogoSrc: '/images/vireda-logo-dark-420.png',
        problem: "The company had grown, but its positioning hadn't.",
        body: 'The business had expanded its services but its website and brand still communicated what it had been several years earlier.',
        actionLabel: 'What we changed',
        changes: ['Clarified brand positioning', 'Refined messaging', 'Developed a new visual identity', 'Redesigned the website', 'Created a consistent digital presence across key touchpoints'],
        resultLead: 'A brand that finally matched the business behind it.',
        result: 'A brand that finally matched the business behind it.',
        quote: "It finally feels like the company we've become, rather than the company we started as.",
    },
];

const serviceSelectedWorkProjects = [
    {
        name: 'Conversion-Focused Website Build',
        industry: 'Web build',
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=85',
        description: 'A sharper digital presence built around clearer messaging, faster navigation and a better route from interest to enquiry.',
        services: ['Website Development', 'UX/UI', 'Digital Presence'],
    },
    {
        name: 'E-commerce Experience Refresh',
        industry: 'E-commerce',
        image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1600&q=85',
        description: 'A cleaner shopping journey with improved product discovery, simplified conversion points and stronger reporting around customer behaviour.',
        services: ['E-commerce', 'Conversion', 'Analytics'],
    },
    {
        name: 'Custom Operations Platform',
        industry: 'Software',
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=85',
        description: 'A bespoke internal tool that replaced scattered spreadsheets and manual updates with one clearer way to manage work.',
        services: ['Software', 'Workflow Automation', 'Operations'],
    },
    {
        name: 'Lead Management CRM Setup',
        industry: 'CRM solution',
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85',
        description: 'A practical CRM and follow-up system designed to keep enquiries moving, improve visibility and reduce missed opportunities.',
        services: ['CRM', 'Lead Conversion', 'Sales Process'],
    },
    {
        name: 'Brand-Led Digital Presence',
        industry: 'Digital presence',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85',
        description: 'A more coherent identity and web experience that helped the business explain its offer with more confidence and consistency.',
        services: ['Brand Strategy', 'Website', 'Creative Direction'],
    },
];

const servicePageProcess = [
    {
        number: '01',
        title: 'Discover',
        body: "We begin by understanding your business, your goals, your current situation and what's getting in the way. Whether you're looking to improve a process, build a product, transform your digital presence or explore what's possible with AI, we start by asking the right questions.",
    },
    {
        number: '02',
        title: 'Define',
        body: "We analyse what we've learned, identify opportunities and shape the right approach. This might mean defining a strategy, mapping a process, designing a brand, planning a digital product or determining where technology can create the most value.",
    },
    {
        number: '03',
        title: 'Build',
        body: "Once we know what we're solving and how we're going to approach it, we get to work. Depending on the project, that could mean designing a brand, developing a website, building software, creating dashboards, implementing automation or developing an AI-powered solution.",
    },
    {
        number: '04',
        title: 'Launch',
        body: "We don't consider the work finished when something technically works. We help get the solution ready for the people who will actually use it - from testing and refinement through to implementation, handover and adoption.",
    },
    {
        number: '05',
        title: 'Evolve',
        lead: 'Make it better as your business changes.',
        body: "Businesses don't stand still, and neither should the solutions supporting them. We use feedback, data and real-world performance to identify improvements, optimise what's working and adapt as new opportunities emerge.",
    },
];

function AnimatedIssueCard({ issue }) {
    return (
        <article className="issue-card animated-issue-card">
            <div className="issue-card-index">{issue.number}</div>
            <div className="issue-card-copy">
                <h3>{issue.title}</h3>
                <p>{issue.body}</p>
            </div>
        </article>
    );
}

function WhatWeFixSection() {
    const issueSectionRef = useRef(null);

    useEffect(() => {
        const section = issueSectionRef.current;

        if (!section) {
            return undefined;
        }

        const viewport = section.querySelector('.issue-track-viewport');
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frame = null;

        const updateTrack = () => {
            if (!viewport) {
                return;
            }

            const cards = Array.from(section.querySelectorAll('.issue-card'));

            if (motionQuery.matches || window.innerWidth <= 640) {
                cards.forEach((card) => {
                    card.style.setProperty('--issue-card-x', '0px');
                });
                return;
            }

            const rect = section.getBoundingClientRect();
            const viewportHeight = Math.max(1, window.innerHeight);
            const start = viewportHeight * 0.72;
            const end = -(rect.height - viewportHeight * 1.08);
            const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
            const itemCount = Math.max(1, cards.length);

            cards.forEach((card, index) => {
                if (index === 0) {
                    card.style.setProperty('--issue-card-x', '0px');
                    return;
                }

                const segmentStart = index / itemCount;
                const segmentEnd = segmentStart + (1 / itemCount);
                const localProgress = Math.max(0, Math.min(1, (progress - segmentStart) / (segmentEnd - segmentStart)));
                const startX = viewport.clientWidth - card.offsetLeft;
                const endX = -(card.offsetLeft - (64 * index));
                const x = startX + ((endX - startX) * localProgress);

                card.style.setProperty('--issue-card-x', `${x.toFixed(2)}px`);
            });
        };

        const requestUpdate = () => {
            if (frame) {
                return;
            }

            frame = window.requestAnimationFrame(() => {
                frame = null;
                updateTrack();
            });
        };

        updateTrack();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', updateTrack);
        motionQuery.addEventListener('change', updateTrack);

        return () => {
            if (frame) {
                window.cancelAnimationFrame(frame);
            }

            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', updateTrack);
            motionQuery.removeEventListener('change', updateTrack);
        };
    }, []);

    return (
        <section className="page-section problem-section" ref={issueSectionRef}>
            <div className="problem-sticky">
                <div className="container section-heading problem-heading">
                    <p className="eyebrow">What We Fix</p>
                    <h2 className="problem-heading-title">
                        <span>The problems</span>
                        <span>behind the problem.</span>
                    </h2>
                    <p className="problem-heading-copy">
                        A few things tend to hold businesses back, whether they realise it or not. Here's what we see
                        most often and what we do about it.
                    </p>
                </div>
                <div className="container issue-track-viewport">
                    <div className="issue-track">
                        {servicesPageIssues.map((issue) => (
                            <AnimatedIssueCard issue={issue} key={issue.number} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function PageSectionHeading({ eyebrow, highlight, text, children }) {
    return (
        <div className="container page-section-heading">
            <p className="eyebrow">{eyebrow}</p>
            <TextRevealByWord
                as="h2"
                className="section-heading-reveal"
                highlight={highlight}
                text={text}
            />
            {typeof children === 'string' ? (
                <p>{children}</p>
            ) : (
                <div className="page-section-heading-copy">{children}</div>
            )}
        </div>
    );
}

function ClientResultsSlider({ results }) {
    const [selectedResult, setSelectedResult] = useState(null);
    const carouselRef = useRef(null);

    useEffect(() => {
        if (!selectedResult) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setSelectedResult(null);
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedResult]);

    const scrollResults = (direction) => {
        if (!carouselRef.current) {
            return;
        }

        carouselRef.current.scrollBy({
            left: carouselRef.current.clientWidth * (direction === 'left' ? -0.8 : 0.8),
            behavior: 'smooth',
        });
    };

    return (
        <div className="container client-results-shell">
            <div className="client-results-carousel">
                <button
                    aria-label="Scroll client results left"
                    className="client-results-scroll-button is-left"
                    onClick={() => scrollResults('left')}
                    type="button"
                >
                    <ChevronLeft size={24} strokeWidth={1.8} />
                </button>

                <div className="client-results-track" ref={carouselRef}>
                    {results.map((result) => (
                        <article className="client-result-offer-card" key={result.client}>
                            <img src={result.imageSrc} alt={result.imageAlt} loading="lazy" />

                            <div className="client-result-offer-content">
                                <div className="client-result-offer-main">
                                    <div className="client-result-offer-tag">
                                        <Tag size={15} strokeWidth={1.8} />
                                        <span>{result.tag}</span>
                                    </div>
                                    <h3>{result.client}</h3>
                                    <p>{result.resultLead}{result.result && result.result !== result.resultLead ? ` ${result.result}` : ''}</p>
                                </div>

                                <footer className="client-result-offer-footer">
                                    <button
                                        aria-label={`View full details for ${result.client}`}
                                        className="client-result-arrow-button"
                                        onClick={() => setSelectedResult(result)}
                                        type="button"
                                    >
                                        <ArrowRight size={18} strokeWidth={1.8} />
                                    </button>
                                </footer>
                            </div>
                        </article>
                    ))}
                </div>

                <button
                    aria-label="Scroll client results right"
                    className="client-results-scroll-button is-right"
                    onClick={() => scrollResults('right')}
                    type="button"
                >
                    <ChevronRight size={24} strokeWidth={1.8} />
                </button>
            </div>

            {selectedResult ? (
                <div
                    aria-modal="true"
                    className="client-result-modal"
                    onMouseDown={() => setSelectedResult(null)}
                    role="dialog"
                >
                    <article
                        className="client-result-modal-panel"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <button
                            aria-label="Close client result details"
                            className="client-result-modal-close"
                            onClick={() => setSelectedResult(null)}
                            type="button"
                        >
                            <X size={20} strokeWidth={1.8} />
                        </button>

                        <figure className="client-result-modal-media">
                            <img src={selectedResult.imageSrc} alt={selectedResult.imageAlt} />
                            <figcaption>
                                <span>{selectedResult.tag}</span>
                                <strong>{selectedResult.sector}</strong>
                            </figcaption>
                        </figure>

                        <div className="client-result-modal-content">
                            <header className="client-result-modal-header">
                                <span>{selectedResult.tag} / {selectedResult.sector}</span>
                                <h3>{selectedResult.client}</h3>
                                <p>{selectedResult.problem}</p>
                            </header>

                            <div className="client-result-modal-outcome">
                                <span className="client-result-label">Result</span>
                                <strong>{selectedResult.resultLead}</strong>
                                {selectedResult.result && selectedResult.result !== selectedResult.resultLead ? <p>{selectedResult.result}</p> : null}
                            </div>

                            <div className="client-result-modal-grid">
                                <div className="client-result-section">
                                    <span className="client-result-label">The problem</span>
                                    <p>{selectedResult.body}</p>
                                </div>

                                <div className="client-result-section">
                                    <span className="client-result-label">{selectedResult.actionLabel}</span>
                                    <ul className="client-result-changes">
                                        {selectedResult.changes.map((change) => (
                                            <li key={change}>{change}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <blockquote>{selectedResult.quote}</blockquote>
                        </div>
                    </article>
                </div>
            ) : null}
        </div>
    );
}

function getInitialServiceIndex() {
    const fallbackIndex = 0;

    if (typeof window === 'undefined') {
        return fallbackIndex;
    }

    const requestedService = new URLSearchParams(window.location.search).get('service');

    if (!requestedService) {
        return fallbackIndex;
    }

    const requestedIndex = servicePageServices.findIndex((service) => (
        slugifyServiceTitle(service.title) === requestedService
    ));

    return requestedIndex >= 0 ? requestedIndex : fallbackIndex;
}

function ServicesPage() {
    const [openServiceIndex, setOpenServiceIndex] = useState(getInitialServiceIndex);
    const [hoveredServiceIndex, setHoveredServiceIndex] = useState(null);
    const [servicePreviewVisible, setServicePreviewVisible] = useState(false);
    const [servicePreviewPosition, setServicePreviewPosition] = useState({ x: 0, y: 0 });
    const [smoothServicePreviewPosition, setSmoothServicePreviewPosition] = useState({ x: 0, y: 0 });
    const serviceStackRef = useRef(null);

    useEffect(() => {
        const openRequestedService = (slug) => {
            const requestedIndex = servicePageServices.findIndex((service) => (
                slugifyServiceTitle(service.title) === slug
            ));

            if (requestedIndex < 0) {
                return;
            }

            setOpenServiceIndex(requestedIndex);
            window.requestAnimationFrame(() => {
                document.getElementById(slug)?.scrollIntoView({
                    block: 'start',
                    behavior: 'auto',
                });
            });
        };

        const requestedService = new URLSearchParams(window.location.search).get('service');

        if (requestedService) {
            window.requestAnimationFrame(() => openRequestedService(requestedService));
        }

        const handleServiceNav = (event) => {
            openRequestedService(event.detail?.slug);
        };

        window.addEventListener('vireda:open-service', handleServiceNav);

        return () => {
            window.removeEventListener('vireda:open-service', handleServiceNav);
        };
    }, []);

    useEffect(() => {
        let animationFrame;
        const lerp = (start, end, factor) => start + ((end - start) * factor);

        const animatePreview = () => {
            setSmoothServicePreviewPosition((position) => ({
                x: lerp(position.x, servicePreviewPosition.x, 0.16),
                y: lerp(position.y, servicePreviewPosition.y, 0.16),
            }));
            animationFrame = window.requestAnimationFrame(animatePreview);
        };

        animationFrame = window.requestAnimationFrame(animatePreview);

        return () => {
            window.cancelAnimationFrame(animationFrame);
        };
    }, [servicePreviewPosition]);

    const updateServicePreviewPosition = (event) => {
        const stack = serviceStackRef.current;

        if (!stack) {
            return;
        }

        const rect = stack.getBoundingClientRect();

        setServicePreviewPosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    };

    return (
        <>
            <Navbar />
            <main className="page-shell services-page">
                <section className="page-hero services-page-hero" id="top" data-nav-theme="dark">
                    <div className="container page-hero-inner">
                        <p className="eyebrow">Services</p>
                        <h1>
                            We build what your business needs to{' '}
                            <span className="page-hero-title-highlight">work better.</span>
                        </h1>
                        <p>
                            There's always room to improve, from the systems behind your business to the experiences
                            your customers see. We bring thinking, technology and creativity together to find what's
                            getting in the way, and build better ways of working, connecting and growing.
                        </p>
                    </div>
                </section>

                <ServicesMarquee />

                <WhatWeFixSection />

                <section className="page-section page-services-list" id="services">
                    <KineticGridBackground className="services-kinetic-background" />
                    <div className="container section-heading services-list-heading">
                        <p className="eyebrow">Our Services</p>
                        <TextRevealByWord
                            as="h2"
                            className="section-heading-reveal"
                            highlight="works in isolation"
                            text="Nothing here works in isolation."
                        />
                        <p>
                            Strategy, systems, software, data, AI and brand rarely live in separate boxes. Pick where
                            you need us most, or bring it all together.
                        </p>
                    </div>
                    <div
                        className="container service-detail-stack"
                        onMouseMove={updateServicePreviewPosition}
                        onMouseLeave={() => {
                            setHoveredServiceIndex(null);
                            setServicePreviewVisible(false);
                        }}
                        ref={serviceStackRef}
                    >
                        <div
                            aria-hidden="true"
                            className={`service-hover-preview ${servicePreviewVisible ? 'is-visible' : ''}`}
                            style={{
                                '--service-preview-x': `${smoothServicePreviewPosition.x}px`,
                                '--service-preview-y': `${smoothServicePreviewPosition.y}px`,
                            }}
                        >
                            {servicePageServices.map((service, index) => (
                                <img
                                    alt=""
                                    className={hoveredServiceIndex === index ? 'is-active' : ''}
                                    key={service.title}
                                    src={service.image}
                                />
                            ))}
                        </div>
                        {servicePageServices.map((service, index) => {
                            const expanded = openServiceIndex === index;

                            return (
                                <article
                                    className={`service-detail-card ${expanded ? 'is-open' : ''}`}
                                    id={slugifyServiceTitle(service.title)}
                                    key={service.number}
                                >
                                    <button
                                        aria-expanded={expanded}
                                        className="service-detail-toggle"
                                        onClick={() => setOpenServiceIndex(expanded ? null : index)}
                                        onFocus={() => {
                                            setHoveredServiceIndex(index);
                                            setServicePreviewVisible(false);
                                        }}
                                        onMouseEnter={(event) => {
                                            updateServicePreviewPosition(event);
                                            setHoveredServiceIndex(index);
                                            setServicePreviewVisible(true);
                                        }}
                                        type="button"
                                    >
                                        <span className="service-detail-title">{service.title}</span>
                                        <span className="service-detail-icon" aria-hidden="true">
                                            <Plus size={22} strokeWidth={1.8} />
                                        </span>
                                    </button>
                                    <div className="service-detail-content">
                                        <div className="service-detail-rule" />
                                        <div className="service-detail-copy">
                                            <div className="service-detail-description">
                                                <p>{service.intro}</p>
                                                {service.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                                            </div>
                                        </div>
                                        <div className="service-detail-rule" />
                                        <div className="service-detail-layout">
                                            <figure className="service-detail-media">
                                                <img src={service.image} alt={service.imageAlt} loading="lazy" />
                                            </figure>
                                            <div className="service-detail-body">
                                                <div className="service-detail-points">
                                                    {service.cards.map(([title, body], cardIndex) => (
                                                        <div className="service-detail-point" key={title}>
                                                            <ServiceFeatureIcon aria-hidden="true" serviceIndex={index} cardIndex={cardIndex} width="22" height="22" strokeWidth="1.25" />
                                                            <h4>{title}</h4>
                                                            <p>{body}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="service-detail-tags" aria-label={`${service.title} capabilities`}>
                                            <div className="service-detail-tags-track">
                                                {[...service.tags, ...service.tags].map((tag, tagIndex) => (
                                                    <React.Fragment key={`${tag}-${tagIndex}`}>
                                                        <span>{tag}</span>
                                                        <i className="service-detail-tags-divider" aria-hidden="true" />
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="page-section results-section">
                    <PageSectionHeading
                        eyebrow="Client Results"
                        highlight="Outcomes."
                        text="Not case studies. Outcomes."
                    >
                        Every business below came to us with a different problem, what they walked away with was the same thing: something that actually worked. No two engagements start the same way. They all start with a conversation, not a pitch.
                    </PageSectionHeading>
                    <ClientResultsSlider results={servicePageResults} />
                </section>

                <section className="page-section selected-work-section">
                    <PageSectionHeading
                        eyebrow="Selected Work"
                        highlight="things we've built"
                        text="A few of the things we've built."
                    >
                        A look at recent work across web builds, e-commerce, software, CRM solutions and digital presence - no two projects are the same, but the standard behind them never changes.
                    </PageSectionHeading>
                    <div className="container selected-work-showcase">
                        <ProjectShowcase projects={serviceSelectedWorkProjects} />
                    </div>
                </section>

                <HowItWorksBlock />

                <FinalCTA
                    eyebrow="Ready to see what's possible?"
                    highlight="walk you through"
                    text="Share a bit about your project, and we'll walk you through how we'd approach it."
                    primaryLabel="Book a discovery call"
                    secondaryLabel="Send us a message"
                />
            </main>
            <Footer />
        </>
    );
}

function HomePage() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <ServicesMarquee />
                <CoreCapabilities />
                <ServicesSection />
                <OurWork />
                <AboutVireda />
                <FinalCTA />
            </main>
            <Footer />
        </>
    );
}

function App() {
    return window.location.pathname === '/services' ? <ServicesPage /> : <HomePage />;
}

createRoot(document.getElementById('root')).render(<App />);
