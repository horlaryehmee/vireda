import React from 'react';
import { ProjectMarquee } from './ProjectMarquee';

/**
 * The "Our Work" band shown on the individual service pages.
 *
 * Uses the same marquee as the home page Our Work section, so every service page
 * presents work the same way. `items` are `{ image, name }` objects; the name is
 * revealed in the card's hover overlay. There is no `industry` here (the service
 * pages have no industry metadata), and the marquee renders the overlay without
 * that line when it is absent.
 */
function ServiceWorkSection({ title, intro, items = [] }) {
    return (
        <section className="web-development-section branding-work-section">
            <div className="container branding-work-heading">
                <div>
                    <span className="web-development-faq-label">Our Work</span>
                    <h2>{title}</h2>
                    <p>{intro}</p>
                </div>
            </div>
            <ProjectMarquee projects={items} />
        </section>
    );
}

export { ServiceWorkSection };
export default ServiceWorkSection;
