import { useState } from 'react';

export function TubeLightNav({ items }) {
    const [activeItem, setActiveItem] = useState(items[0]?.label);

    return (
        <nav className="tube-light-nav" aria-label="Primary navigation">
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
                        {isActive && (
                            <span
                                className="tube-light-active"
                                aria-hidden="true"
                            >
                                <i className="tube-light-bar" />
                            </span>
                        )}
                    </a>
                );
            })}
        </nav>
    );
}
