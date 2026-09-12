import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useReducedMotion,
} from 'framer-motion';

const SPEED_PX_PER_SECOND = {
    slow: 26,
    normal: 44,
    fast: 74,
};

export function InfiniteMovingCards({
    items,
    direction = 'left',
    speed = 'normal',
    pauseOnHover = true,
    gap = 16,
    renderItem,
}) {
    const reduceMotion = useReducedMotion() === true;
    const x = useMotionValue(0);
    const viewportRef = useRef(null);
    const trackRef = useRef(null);
    const [singleWidth, setSingleWidth] = useState(0);
    const [paused, setPaused] = useState(false);
    const safeItems = items || [];
    const renderedItems = [...safeItems, ...safeItems];

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;

        if (!viewport || !track) return undefined;

        const measure = () => setSingleWidth(track.scrollWidth / 2);
        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(viewport);
        observer.observe(track);

        return () => observer.disconnect();
    }, [gap, safeItems.length]);

    useEffect(() => {
        if (singleWidth > 0) {
            x.set(direction === 'right' ? -singleWidth : 0);
        }
    }, [direction, singleWidth, x]);

    useAnimationFrame((_, delta) => {
        if (reduceMotion || paused || safeItems.length <= 1 || singleWidth <= 0) return;

        const velocity = SPEED_PX_PER_SECOND[speed] * (delta / 1000);
        let next = x.get() + (direction === 'left' ? -velocity : velocity);

        if (direction === 'left' && next <= -singleWidth) next += singleWidth;
        if (direction === 'right' && next >= 0) next -= singleWidth;
        x.set(next);
    });

    return (
        <div
            className="infinite-cards"
            onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
            onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
        >
            <div className="infinite-cards-viewport" ref={viewportRef}>
                <motion.div
                    className="infinite-cards-track"
                    ref={trackRef}
                    style={{ gap, x: reduceMotion ? 0 : x }}
                >
                    {renderedItems.map((item, index) => (
                        <div
                            aria-hidden={index >= safeItems.length ? 'true' : undefined}
                            className="infinite-card-slot"
                            key={`${item.id}-${index}`}
                        >
                            {renderItem(item, index)}
                        </div>
                    ))}
                </motion.div>
            </div>
            <span className="infinite-cards-mask infinite-cards-mask-left" aria-hidden="true" />
            <span className="infinite-cards-mask infinite-cards-mask-right" aria-hidden="true" />
        </div>
    );
}

export default InfiniteMovingCards;
