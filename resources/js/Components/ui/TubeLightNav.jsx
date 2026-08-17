import { useEffect, useRef, useState } from 'react';

export function TubeLightNav({ items }) {
    const [activeItem, setActiveItem] = useState(items[0]?.label);
    const navRef = useRef(null);

    useEffect(() => {
        const nav = navRef.current;

        if (!nav) {
            return undefined;
        }

        const updateActiveIndicator = () => {
            const activeLink = nav.querySelector('a.is-active');

            if (!activeLink) {
                return;
            }

            nav.style.setProperty('--tube-active-left', `${activeLink.offsetLeft}px`);
            nav.style.setProperty('--tube-active-width', `${activeLink.offsetWidth}px`);
        };

        updateActiveIndicator();
        window.addEventListener('resize', updateActiveIndicator);

        return () => window.removeEventListener('resize', updateActiveIndicator);
    }, [activeItem]);

    return (
        <nav className="tube-light-nav" aria-label="Primary navigation" ref={navRef}>
            <span className="tube-light-active" aria-hidden="true">
                <i className="tube-light-bar" />
            </span>
            {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.label;

                return (
                    <a
                        className={isActive ? 'is-active' : ''}
                        href={item.href}
                        key={item.label}
                        onClick={() => setActiveItem(item.label)}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <span className="tube-nav-label">{item.label}</span>
                        <Icon className="tube-nav-icon" size={17} strokeWidth={2} aria-hidden="true" />
                    </a>
                );
            })}
        </nav>
    );
}
