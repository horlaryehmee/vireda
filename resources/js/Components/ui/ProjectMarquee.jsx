import React, { useState } from 'react';

/**
 * Horizontal, continuously scrolling project marquee.
 *
 * Adapted for this codebase (JSX, not TSX) from the supplied marquee demo:
 * - `cn` (clsx + tailwind-merge) is not a dependency here and was unused in the
 *   original file, so it is dropped rather than adding two packages for nothing.
 * - Colours read the `.work-section` tokens so light AND dark themes both work
 *   (the original hardcoded `from-white` / `text-slate-900`, which only worked in light).
 * - No Google Fonts @import and no global `*` font override: the site uses
 *   Instrument Sans / Bricolage Grotesque and a `*` rule would wipe that out everywhere.
 */

// Card width plus its inline margins. Used to decide how many times the list
// must repeat before the loop is wide enough to look seamless on a wide screen.
const CARD_APPROX_WIDTH = 260;

function ProjectMarquee({ projects = [], className = '' }) {
    const [paused, setPaused] = useState(false);

    // The track translates by exactly -50%, so it must contain two identical halves.
    // One half has to be at least as wide as the viewport, otherwise the loop
    // reveals a gap. Repeat the source list until one half clears ~1800px.
    const repeats = Math.max(2, Math.ceil(1800 / Math.max(1, projects.length * CARD_APPROX_WIDTH)));
    const half = Array.from({ length: repeats }, () => projects).flat();
    const cards = [...half, ...half];

    return (
        <div
            className={`work-marquee ${className}`.trim()}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            <span className="work-marquee-fade work-marquee-fade-left" aria-hidden="true" />
            <span className="work-marquee-fade work-marquee-fade-right" aria-hidden="true" />

            <ul
                className="work-marquee-track"
                data-paused={paused ? 'true' : 'false'}
                style={{ '--work-marquee-duration': `${(half.length * 5.5).toFixed(2)}s` }}
            >
                {cards.map((project, index) => (
                    <li
                        className="work-marquee-card"
                        key={`${project.name}-${index}`}
                        // The second half is a visual duplicate of the first, so hide it
                        // from assistive tech instead of announcing every project twice.
                        aria-hidden={index >= half.length ? 'true' : undefined}
                        tabIndex={index < half.length ? 0 : -1}
                    >
                        <div className="work-marquee-media">
                            <img
                                src={project.image}
                                alt={project.name}
                                loading="lazy"
                                decoding="async"
                                draggable="false"
                            />
                        </div>
                        <span className="work-marquee-overlay">
                            <span className="work-marquee-title">{project.name}</span>
                            {project.description && (
                                <span className="work-marquee-description">{project.description}</span>
                            )}
                            {project.industry && (
                                <span className="work-marquee-industry">{project.industry}</span>
                            )}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export { ProjectMarquee };
export default ProjectMarquee;
