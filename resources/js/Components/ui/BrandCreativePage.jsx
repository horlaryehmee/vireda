import React, { useLayoutEffect, useRef, useState } from 'react';
import { Compass, Layers3, Palette, RefreshCw, Search, Shapes } from 'lucide-react';
import { ServicesCollageHero } from './ServicesCollageHero';
import { HowItWorksBlock } from './HowItWorksBlock';
import { ServiceWorkSection } from './ServiceWorkSection';
import { MetricCounter, SatisfactionScore } from './WebDevelopmentUxPage';
import { FaqSplitSection } from './FaqSplitSection';
import { ExploreMetricsSection, ExploreRelatedServicesSection, ExploreServicesSection, ExploreSupportSection, ExploreToolkitSection } from './ExplorePageSections';

const brandServices = [
    ['Brand Strategy', 'Strategy Before a Single Pixel', ['Market research: understanding the competitive landscape.', 'Brand positioning: defining a clear position in the market.', 'Target audience: getting specific about who the audience actually is.', 'Brand messaging: shaping a voice that sounds like a real business, not a template.'], "Before any design starts, we work out who the business is, who it's for, and what makes it worth choosing.", '/images/services/brand-strategy.webp'],
    ['Brand Identity', 'Built to Be Recognised, Not Just Seen', ['Colour system: strategic palettes chosen for what they communicate, not what is trending.', 'Typography: font pairings that reinforce brand personality.', 'Visual language: one consistent imagery and iconography style across every touchpoint.', 'Brand guidelines: comprehensive documentation so nothing drifts as the business grows.'], 'A complete visual system, built so the business is recognisable wherever it shows up.', '/images/services/brand-identity.webp'],
    ['Logo Design', 'A Mark Built to Last', ['Concept development: multiple directions explored and refined properly before landing on one.', 'Versatility: built to hold up across print, digital, and merchandise.', 'File formats: every format actually needed, nothing missing later.', 'Brand marks: icons and sub-marks for flexible applications.'], 'Often the first impression a business makes, so it has to carry weight.', '/images/services/brand-logo-design.webp'],
    ['Graphic & Print Design', 'Materials That Still Sound Like the Brand', ['Business cards: designed to make a lasting first impression.', 'Brochures: compelling layouts that tell the brand story.', 'Packaging: eye-catching design built to sell on the shelf.', 'Stationery: cohesive suites for professional communication.'], 'Print materials designed to look professional while reinforcing the brand and telling its story.', '/images/services/brand-print-design.webp'],
];

const brandTools = [
    { name: 'Adobe Illustrator', src: 'https://img.icons8.com/color/96/adobe-illustrator.png' },
    { name: 'Adobe Photoshop', src: 'https://img.icons8.com/color/96/adobe-photoshop.png' },
    { name: 'Adobe InDesign', src: 'https://img.icons8.com/color/96/adobe-indesign.png' },
    { name: 'Figma', src: 'https://img.icons8.com/color/96/figma--v1.png' },
];

const brandFaqs = [
    ["What's included in a brand identity project?", 'Typically strategy, visual identity (colour, type, visual language), logo, and a set of brand guidelines, scoped to what the business actually needs.'],
    ['How many logo concepts will I see?', "Enough to properly explore different directions before narrowing down, we'll agree the specifics with you upfront."],
    ['Can you refresh an existing brand rather than start over?', "Yes, a refresh keeps what's already working and updates what isn't, a full rebuild isn't always necessary."],
    ['How long does a branding project take?', "Depends on scope, a logo refresh takes considerably less time than a full identity system. We'll give a realistic timeline once we understand what's needed."],
    ['What files will I receive?', "Every format actually needed for how the business uses its brand day to day, we'll confirm this as part of scoping the work."],
    ['Do you offer ongoing support after launch?', "Yes, where it makes sense. Some clients need occasional design support as the brand evolves, others prefer a one-off project, we'll talk through what fits."],
];

const relatedServices = [
    ['Web Development & UX', 'Websites and digital experiences built around how people actually use them.', '/services/web-development-ux'],
    ['Software & Digital Products', 'Custom software and platforms built around ideas that need more than a website.', '/services/software-digital-products'],
    ['AI & Automation', 'Chatbots, workflow automation, and training that save your team time.', '/services?service=ai-and-automation#services'],
    ['Strategy & Operations', 'Fixing the operations, processes, and systems behind the business.', '/services/strategy-operations'],
    ['Data & Analytics', 'Turning scattered information into dashboards and insight the team can actually use.', '/services/data-analytics'],
];

export default function BrandCreativePage({ Navbar, Footer, FinalCTA, workProjects = [] }) {
    const animationFrameRef = useRef(null);
    const [animationScale, setAnimationScale] = useState(1);

    useLayoutEffect(() => {
        const node = animationFrameRef.current;
        if (!node) return undefined;
        const updateScale = () => {
            const { width, height } = node.getBoundingClientRect();
            setAnimationScale(Math.min(width / 1240, height / 900));
        };
        updateScale();
        const observer = new ResizeObserver(updateScale);
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Navbar />
            <main className="page-shell web-development-page brand-creative-page">
                <ServicesCollageHero
                    eyebrow="Branding & Creative"
                    title={<>A brand is the reason someone picks you over the <span>alternative.</span></>}
                    subtitle="A logo isn't a brand, it's one piece of it. What actually makes someone trust a business, remember it, and choose it again is everything around that logo: the strategy behind it, the way it looks and sounds everywhere it shows up, and how consistently that holds together over time."
                    visual={<figure className="web-development-hero-animation brand-creative-hero-animation" ref={animationFrameRef}><iframe src="/animations/branding.html" title="Animated branding and creative workspace" loading="eager" sandbox="allow-scripts" style={{ transform: `translate(-50%, -50%) scale(${animationScale})` }} /></figure>}
                />

                <ExploreMetricsSection title={<>A Brand People <span>Remember</span></>}>
                            <article className="stats-bento-primary">
                                <SatisfactionScore value={96} />
                                <div className="stats-bento-primary-meta"><span><span className="stats-bento-meta-value"><MetricCounter value={5} /></span> Logo Concepts Explored on Average</span><span><span className="stats-bento-meta-value"><MetricCounter value={40} suffix="%" /></span> Projects Involving a Full Rebrand</span></div>
                            </article>
                            <article className="stats-bento-growth"><div className="stats-bento-value-first"><strong><MetricCounter value={64} /></strong><span>Brand Projects Completed</span></div></article>
                            <article className="stats-bento-small"><strong><MetricCounter value={72} suffix="%" /></strong><span>Clients Who Return for Future Work</span></article>
                            <article className="stats-bento-rating stats-bento-rating-wide"><div><strong><MetricCounter value={3} suffix=" Weeks" /></strong><span>Average Design to Delivery</span></div></article>
                </ExploreMetricsSection>

                <ExploreServicesSection services={brandServices} />
                <ExploreToolkitSection title={<>Our Branding &amp; Creative <span>Toolkit</span></>} subtitle="The tools we use to build clear, consistent, recognisable brands." items={brandTools} />
                <ExploreSupportSection title="Brand Refresh & Rebrand" intro="Sometimes the answer isn't a new brand, it's evolving the one you've got." options={[{ icon: RefreshCw, title: 'Brand Refresh', description: "Updating a brand that's fallen behind the business, without losing what's already recognisable." }, { icon: Search, title: 'Free Brand Audit', description: 'A quick review of how the brand currently looks, sounds, and holds together, to see whether the fix is a refresh, or a full rebuild.' }]} />

                <HowItWorksBlock eyebrow="Why Choose Us" title={<>For Your Next <span className="consulting-project-script">Branding Project</span></>} intro={null} secondaryIntro={null} steps={[
                    { icon: Compass, title: 'Strategy First', copy: "Nothing gets designed until we know what it's actually meant to communicate." },
                    { icon: Layers3, title: 'Built to Stay Consistent', copy: 'Clear guidelines so the brand looks and sounds the same everywhere it shows up.' },
                    { icon: Shapes, title: 'Distinctive, Not Decorative', copy: 'The goal is recognition, not just looking nice for five minutes.' },
                    { icon: Palette, title: 'Ready to Actually Use', copy: 'Every asset delivered in a format the team can use immediately.' },
                ]} />

                <ServiceWorkSection
                    title={<>Branding &amp;<br />Creative <span>Projects</span></>}
                    intro="A look at some of the identities we've built, real problems, real businesses, real recognition."
                    items={workProjects}
                />

                <FaqSplitSection items={brandFaqs} />

                <ExploreRelatedServicesSection intro="Branding is rarely the whole story. Here's where else we might fit in." items={relatedServices} />

                <FinalCTA eyebrow={null} text="Let's Get This Moving" highlight="Moving" description="Book a free discovery call to talk through what you need, or send us a message and we'll get back to you as soon as we can." primaryLabel="Book a Conversation" secondaryLabel="Send a Message" />
            </main>
            <Footer />
        </>
    );
}
