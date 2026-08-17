import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
    ArrowRight,
    ArrowUp,
    BarChart3,
    Bot,
    Box,
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
    Puzzle,
    Smartphone,
    Sparkles,
    Settings,
    Sun,
    User,
    Wifi,
    X,
} from 'lucide-react';
import { GetStartedButton } from './Components/ui/GetStartedButton';
import { HeroGridBackground } from './Components/ui/HeroGridBackground';
import { IconStack } from './Components/ui/IconStack';
import { NeonMesh } from './Components/ui/NeonMesh';
import { ProjectShowcase } from './Components/ui/ProjectShowcase';
import { TextRevealByWord } from './Components/ui/text-reveal';
import { TubeLightNav } from './Components/ui/TubeLightNav';
import { WovenHeroObject } from './Components/ui/WovenHeroObject';
import '../css/app.css';

const navItems = [
    { label: 'What We Do', href: '#what-we-do' },
    { label: 'Services', href: '#services' },
    { label: 'Our Work', href: '#our-work' },
    { label: 'About', href: '#about' },
];

const footerSections = [
    {
        title: 'Company',
        links: [
            { label: 'About', href: '#about' },
            { label: 'Our Work', href: '#our-work' },
            { label: 'Insights', href: '#insights' },
        ],
    },
    {
        title: 'Services',
        links: [
            { label: 'Strategy', href: '#what-we-do' },
            { label: 'Technology', href: '#what-we-do' },
            { label: 'Data & Analytics', href: '#what-we-do' },
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
        <a className="logo" href="#top" aria-label="VIREDÁ home">
            <img className="logo-image logo-image-light" src="/images/vireda-logo-light.png" alt="VIREDÁ" />
            <img className="logo-image logo-image-dark" src="/images/vireda-logo-dark.png" alt="" aria-hidden="true" />
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
    const [, setTheme] = useThemeMode();

    return (
        <div className="footer-theme-controls" aria-label="Theme and page controls">
            <button type="button" onClick={() => setTheme('light')} aria-label="Switch to light mode">
                <Sun size={20} strokeWidth={1.5} />
            </button>
            <button type="button" onClick={handleScrollTop} aria-label="Scroll to top">
                <ArrowUp size={15} strokeWidth={1.8} />
            </button>
            <button type="button" onClick={() => setTheme('dark')} aria-label="Switch to dark mode">
                <Moon size={20} strokeWidth={1.5} />
            </button>
        </div>
    );
}

function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [overDarkSection, setOverDarkSection] = useState(true);
    const [mobileSection, setMobileSection] = useState('services');
    const navRef = useRef(null);

    const capabilityIcons = [Compass, Palette, Bot];
    const companyLinks = [
        { title: 'About VIREDÁ', description: 'Our beliefs, approach and the difference we aim to make.', href: '#about', icon: User },
        { title: 'Our Work', description: 'Selected projects across strategy, technology and brand.', href: '#our-work', icon: Grid2X2 },
    ];

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

    return (
        <header className={`navbar ${scrolled ? 'is-scrolled' : ''} ${overDarkSection ? 'is-over-dark' : ''} ${open ? 'menu-open' : ''}`} ref={navRef}>
            <div className="container nav-inner nav-shell">
                <Logo />
                <TubeLightNav items={[
                    { label: 'What We Do', href: '#what-we-do', icon: Compass },
                    { label: 'Services', href: '#services', icon: Box },
                    { label: 'Our Work', href: '#our-work', icon: Grid2X2 },
                    { label: 'About', href: '#about', icon: User },
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
                    <section className={mobileSection === 'services' ? 'open' : ''}>
                        <button type="button" onClick={() => setMobileSection((current) => current === 'services' ? null : 'services')}>
                            What We Do <ChevronDown size={17} />
                        </button>
                        <div className="mobile-submenu">
                            {capabilities.map((capability, index) => {
                                const Icon = capabilityIcons[index];
                                return <a href="#what-we-do" key={capability.title} onClick={closeNavigation}><Icon size={18} /><span><strong>{capability.title}</strong><small>{capability.statement}</small></span></a>;
                            })}
                        </div>
                    </section>
                    <section className={mobileSection === 'company' ? 'open' : ''}>
                        <button type="button" onClick={() => setMobileSection((current) => current === 'company' ? null : 'company')}>
                            Company <ChevronDown size={17} />
                        </button>
                        <div className="mobile-submenu">
                            {companyLinks.map((item) => {
                                const Icon = item.icon;
                                return <a href={item.href} key={item.title} onClick={closeNavigation}><Icon size={18} /><span><strong>{item.title}</strong><small>{item.description}</small></span></a>;
                            })}
                        </div>
                    </section>
                    <a className="mobile-primary-link" href="#services" onClick={closeNavigation}>Services <ArrowRight size={17} /></a>
                    <a className="mobile-primary-link" href="#our-work" onClick={closeNavigation}>Our Work <ArrowRight size={17} /></a>
                </div>
                <div className="mobile-menu-footer">
                    <GetStartedButton href="#start" size="sm" onClick={closeNavigation}>Start a Conversation</GetStartedButton>
                </div>
            </div>
        </header>
    );
}

const heroTypewriterItems = [
    "A problem that needs solving. An idea that hasn't found its shape yet.",
    'A process that could work better. An opportunity waiting to be explored.',
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
    return (
        <section className="hero radial-hero" id="top" data-nav-theme="dark">
            <HeroGridBackground />
            <WovenHeroObject />
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

function CapabilityCard({ capability, index, onActivate }) {
    const handleKeyDown = (event) => {
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
            onClick={() => onActivate(index)}
            onKeyDown={handleKeyDown}
            role="button"
            style={{
                '--card-index': index,
                '--card-y': index === 0 ? '0px' : '108%',
                '--card-width': '100%',
                '--card-opacity': index === 0 ? 1 : 0,
                '--card-pointer-events': index === 0 ? 'auto' : 'none',
            }}
            tabIndex={index === 0 ? 0 : -1}
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
    }, []);

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
                {services.map((service, index) => (
                    <article className={`deliver-card deliver-card-${index + 1}`} key={service.title}>
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
                    </article>
                ))}
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
                    <TextRevealByWord
                        as="h2"
                        className="section-heading-reveal"
                        highlight="possible"
                        text="Built to make better things possible."
                    />
                    <p className="about-lead">VIREDÁ was created around a simple belief: good ideas deserve the opportunity to become something meaningful.</p>
                </header>
                <div className="about-body">
                    <div className="about-system" aria-label="VIREDÁ works across strategy, technology, data and creativity">
                        <img
                            className="about-system-image"
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

function FinalCTA() {
    return (
        <section className="final-cta section" id="start">
            <div className="container">
                <p className="eyebrow">Ready To Begin?</p>
                <TextRevealByWord
                    as="h2"
                    className="section-heading-reveal"
                    highlight="matters to your business"
                    text="Let's build what matters to your business."
                />
                <GetStartedButton href="mailto:hello@vireda.com">Start a conversation</GetStartedButton>
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

function App() {
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

createRoot(document.getElementById('root')).render(<App />);
