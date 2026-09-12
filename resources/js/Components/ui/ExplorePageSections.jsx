import React from 'react';
import { Check } from 'lucide-react';
import { MarqueeLogoScroller } from './MarqueeLogoScroller';
import { GetStartedButton } from './GetStartedButton';
import { RelatedServicesCarousel } from './RelatedServicesCarousel';
import StackingCards, { StackingCardItem } from './StackingCards';

export function ExploreMetricsSection({ title, children }) {
    return (
        <section className="web-development-section web-development-results">
            <div className="container">
                <h2 className="stats-bento-heading">{title}</h2>
                <div className="web-development-metrics stats-bento-grid">{children}</div>
            </div>
        </section>
    );
}

export function ExploreServicesSection({ services }) {
    return (
        <section className="web-development-section consulting-services-section">
            <div className="container">
                <h2 className="web-development-services-title">Our <span>Services</span></h2>
                <div className="consulting-service-stack">
                    <StackingCards className="consulting-stacking-cards" scaleMultiplier={0.025} totalCards={services.length}>
                        {services.map(([title, heading, points, intro, suppliedImage], index) => (
                            <StackingCardItem className="consulting-stack-item" index={index} key={title} topPosition={`${18 + (index * 12)}px`}>
                                <article className="consulting-stack-card">
                                    <div className="consulting-stack-copy">
                                        <div className="consulting-stack-kicker"><span>{title}</span></div>
                                        <h3>{heading}</h3>
                                        {intro && <p>{intro}</p>}
                                        <ul>{points.map((point) => {
                                            const separator = point.indexOf(':');
                                            return <li key={point}><Check size={17} aria-hidden="true" /><span>{separator >= 0 && <strong>{point.slice(0, separator + 1)}</strong>}{separator >= 0 ? point.slice(separator + 1) : point}</span></li>;
                                        })}</ul>
                                    </div>
                                    <figure className="consulting-stack-image"><img src={suppliedImage} alt={`${title} service`} loading="lazy" decoding="async" /></figure>
                                </article>
                            </StackingCardItem>
                        ))}
                    </StackingCards>
                </div>
            </div>
        </section>
    );
}

export function ExploreToolkitSection({ title, subtitle, items }) {
    return (
        <section className="web-development-section consulting-toolkit">
            <div className="container consulting-toolkit-inner">
                <h2>{title}</h2>
                <p>{subtitle}</p>
                <div className="consulting-toolkit-marquee"><MarqueeLogoScroller title="Tools and methods" items={items} /></div>
            </div>
        </section>
    );
}

export function ExploreSupportSection({ title, accentTitle = 'Support', intro, options }) {
    return (
        <section className="web-development-section consulting-diagnostic-section">
            <div className="container consulting-diagnostic-layout">
                <div className="consulting-diagnostic-intro">
                    <h2><span>{title}</span><em>{accentTitle}</em></h2>
                    <p>{intro}</p>
                    <GetStartedButton className="consulting-diagnostic-button" href="/contact">Start a conversation</GetStartedButton>
                </div>
                <div className="consulting-diagnostic-showcase">
                    <div className="consulting-diagnostic-cards">
                        {options.map(({ icon: Icon, title: optionTitle, description }) => <article key={optionTitle}><Icon size={32} strokeWidth={1.5} aria-hidden="true" /><div><h3>{optionTitle}</h3><p>{description}</p></div></article>)}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function ExploreRelatedServicesSection({ intro, items }) {
    return (
        <section className="web-development-section related-services-section">
            <div className="container">
                <div className="related-services-heading"><h2>More Ways We Can <span>Help</span></h2><p>{intro}</p></div>
                <RelatedServicesCarousel items={items} />
            </div>
        </section>
    );
}
