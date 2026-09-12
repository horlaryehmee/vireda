import React, { useState } from 'react';

/**
 * Full-bleed client logo marquee, scrolling left.
 *
 * Each brand ships two exports: a dark-ink mark for the light theme and a
 * white-ink mark for the dark theme. Both are rendered and CSS swaps them on
 * the `.dark` class, so the strip re-tints instantly with the theme toggle
 * (the existing `.marquee-scroller` relied on `filter: invert(1)` instead,
 * which mangles any logo that is not pure black and white).
 */

// Widest logo (148px) plus its inline margins, used to size the loop.
const CARD_APPROX_WIDTH = 230;

function ClientMarquee({ logos = [], className = '' }) {
    const [paused, setPaused] = useState(false);

    // The track translates exactly -50%, so it needs two identical halves and
    // one half must be wider than the viewport or the loop would show a gap.
    const repeats = Math.max(1, Math.ceil(1800 / Math.max(1, logos.length * CARD_APPROX_WIDTH)));
    const half = Array.from({ length: repeats }, () => logos).flat();
    const items = [...half, ...half];

    return (
        <div
            className={`client-marquee ${className}`.trim()}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            <span className="client-marquee-fade client-marquee-fade-left" aria-hidden="true" />
            <span className="client-marquee-fade client-marquee-fade-right" aria-hidden="true" />

            <ul
                className="client-marquee-track"
                data-paused={paused ? 'true' : 'false'}
                style={{ '--client-marquee-duration': `${(half.length * 3).toFixed(2)}s` }}
            >
                {items.map((logo, index) => {
                    // Optical sizing: every mark is scaled to a similar ink area rather
                    // than a shared height, otherwise a wide wordmark like FOOTASYUM
                    // renders as a thin sliver next to a compact mark like WESTBROOK.
                    const size = { width: `${logo.width}px`, height: `${logo.height}px` };

                    // Both variants are in the DOM so the theme switch is pure CSS (instant,
                    // no JS, no flash of missing logos). That rules out loading="lazy": a
                    // display:none <img> has no box, never intersects, and so would never
                    // load at all. These files are small (0.47 MB for all 22) so eager is fine.
                    const imgProps = {
                        style: size,
                        alt: logo.name,
                        loading: 'eager',
                        decoding: 'async',
                        draggable: 'false',
                    };

                    return (
                        <li
                            className="client-marquee-card"
                            key={`${logo.name}-${index}`}
                            // Second half is a visual duplicate; hide it from assistive tech.
                            aria-hidden={index >= half.length ? 'true' : undefined}
                        >
                            <img className="client-logo-light" src={logo.light} {...imgProps} />
                            <img className="client-logo-dark" src={logo.dark} {...imgProps} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export { ClientMarquee };
export default ClientMarquee;
