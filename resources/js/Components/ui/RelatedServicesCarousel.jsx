import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, BarChart3, Bot, Box, ChevronLeft, ChevronRight, Compass, Globe, Palette } from 'lucide-react';
import { IconStack } from './IconStack';

export function RelatedServicesCarousel({ items = [] }) {
    const trackRef = useRef(null);
    const [active, setActive] = useState(0);
    const [visible, setVisible] = useState(3);
    const maxIndex = Math.max(0, items.length - visible);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;
        const measure = () => {
            const width = track.getBoundingClientRect().width;
            setVisible(width <= 700 ? 1 : width <= 1050 ? 2 : 3);
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(track);
        return () => observer.disconnect();
    }, []);

    useEffect(() => setActive((current) => Math.min(current, maxIndex)), [maxIndex]);

    const goTo = (index) => {
        const track = trackRef.current;
        const card = track?.querySelector('.related-service-deliver-card');
        if (!track || !card) return;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const nextIndex = Math.max(0, Math.min(index, maxIndex));
        track.scrollTo({ left: nextIndex * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
        setActive(nextIndex);
    };

    const syncActive = () => {
        const track = trackRef.current;
        const card = track?.querySelector('.related-service-deliver-card');
        if (!track || !card) return;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        setActive(Math.min(maxIndex, Math.max(0, Math.round(track.scrollLeft / (card.getBoundingClientRect().width + gap)))));
    };

    return (
        <div className="related-services-carousel web-development-carousel">
            <div className="related-services-grid" ref={trackRef} onScroll={syncActive}>
                {items.map(([title, copy, href], index) => {
                    const Icon = title.startsWith('Web') ? Globe
                        : title.startsWith('Software') ? Box
                            : title.startsWith('AI') ? Bot
                                : title.startsWith('Data') ? BarChart3
                                    : title.startsWith('Brand') ? Palette
                                        : Compass;
                    return (
                        <a aria-label={`Explore ${title}`} className={`deliver-card deliver-card-${(index % 4) + 1} related-service-deliver-card`} href={href} key={title}>
                            <div className="deliver-card-top"><IconStack aria-hidden="true"><Icon size={17} strokeWidth={1.7} /></IconStack></div>
                            <div className="deliver-card-body"><h3>{title}</h3><p className="service-statement">{copy}</p></div>
                            <span className="deliver-card-link" aria-hidden="true"><ArrowRight size={17} strokeWidth={1.8} /></span>
                        </a>
                    );
                })}
            </div>
            <div className="web-development-carousel-footer">
                <div className="web-development-carousel-controls"><button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous services"><ChevronLeft size={20} /></button><button type="button" onClick={() => goTo(active + 1)} disabled={active === maxIndex} aria-label="Next services"><ChevronRight size={20} /></button></div>
                <div className="web-development-carousel-progress">{Array.from({ length: maxIndex + 1 }, (_, index) => <button key={index} type="button" className={index === active ? 'is-active' : ''} onClick={() => goTo(index)} aria-label={`Go to related service slide ${index + 1}`} />)}</div>
                <span className="web-development-carousel-count">{String(active + 1).padStart(2, '0')} / {String(maxIndex + 1).padStart(2, '0')}</span>
            </div>
        </div>
    );
}

export default RelatedServicesCarousel;
