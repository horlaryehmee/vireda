import React from 'react';

export function MarqueeLogoScroller({ title = 'Technology logos', description, items }) {
    const repeatCount = Math.max(1, Math.ceil(12 / Math.max(1, items.length)));
    const loopItems = Array.from({ length: repeatCount }, () => items).flat();

    const renderGroup = (groupIndex) => (
        <div aria-hidden={groupIndex === 1 ? 'true' : undefined} className="marquee-scroller-group" key={groupIndex}>
            {loopItems.map((item, index) => (
                <div className={`marquee-scroller-card ${item.src ? 'has-logo' : 'has-text'}`} key={`${groupIndex}-${item.name}-${index}`}>
                    {item.src ? (
                        <>
                            <img
                                src={item.src}
                                alt={groupIndex === 0 ? item.name : ''}
                                loading="lazy"
                                onError={(event) => {
                                    event.currentTarget.hidden = true;
                                    event.currentTarget.nextElementSibling.hidden = false;
                                }}
                            />
                            <span className="marquee-logo-fallback" hidden>{item.name}</span>
                        </>
                    ) : <span>{item.name}</span>}
                </div>
            ))}
        </div>
    );

    return (
        <section className="marquee-scroller" aria-label={title}>
            {description && <div className="marquee-scroller-header"><h2>{title}</h2><p>{description}</p></div>}
            <div className="marquee-scroller-window">
                <div className="marquee-scroller-track">
                    {[0, 1].map(renderGroup)}
                </div>
            </div>
        </section>
    );
}

export default MarqueeLogoScroller;
