import React, { useEffect, useRef, useState } from 'react';

export function TubeLightNav({ activeLabel, items }) {
    const [activeItem, setActiveItem] = useState(activeLabel || items[0]?.label);
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

            const navBounds = nav.getBoundingClientRect();
            const linkBounds = activeLink.getBoundingClientRect();

            nav.style.setProperty('--tube-active-left', `${linkBounds.left - navBounds.left}px`);
            nav.style.setProperty('--tube-active-width', `${activeLink.offsetWidth}px`);
        };

        updateActiveIndicator();
        window.addEventListener('resize', updateActiveIndicator);

        return () => window.removeEventListener('resize', updateActiveIndicator);
    }, [activeItem]);

    useEffect(() => {
        if (activeLabel) {
            setActiveItem(activeLabel);
        }
    }, [activeLabel]);

    return (
        <nav className="tube-light-nav" aria-label="Primary navigation" ref={navRef}>
            <span className="tube-light-active" aria-hidden="true">
                <i className="tube-light-bar" />
            </span>
            {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.label;
                const link = (
                    <a
                        className={isActive ? 'is-active' : ''}
                        href={item.href}
                        onClick={(event) => {
                            setActiveItem(item.label);
                            item.onClick?.(event);
                        }}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <span className="tube-nav-label">{item.label}</span>
                        <Icon className="tube-nav-icon" size={17} strokeWidth={2} aria-hidden="true" />
                    </a>
                );

                if (!item.submenu?.length) {
                    return React.cloneElement(link, { key: item.label });
                }

                return (
                    <div className="tube-nav-item" key={item.label}>
                        {link}
                        <div className="tube-nav-submenu">
                            {item.submenu.map((submenuItem) => (
                                <a
                                    href={submenuItem.href}
                                    key={submenuItem.label}
                                    onClick={submenuItem.onClick}
                                >
                                    {submenuItem.label}
                                </a>
                            ))}
                        </div>
                    </div>
                );
            })}
        </nav>
    );
}
