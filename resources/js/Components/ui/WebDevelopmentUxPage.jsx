import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Cable, Gauge, Search, TrendingUp, Users } from 'lucide-react';
import { ServicesCollageHero } from './ServicesCollageHero';
import { HowItWorksBlock } from './HowItWorksBlock';
import { FaqSplitSection } from './FaqSplitSection';
import { ServiceWorkSection } from './ServiceWorkSection';
import { ExploreMetricsSection, ExploreRelatedServicesSection, ExploreServicesSection, ExploreSupportSection, ExploreToolkitSection } from './ExplorePageSections';

const services = [
    ['Website Builds', 'Websites Built to Pull Their Weight', ['WordPress: custom themes and plugins, full flexibility.', 'HubSpot CMS: marketing-ready builds with CRM integration built in.', 'Webflow & Framer: modern, no-code, quick to launch.', 'Custom development: React, Next.js and bespoke builds for more complex needs.'], null, '/images/services/web-website-builds.webp'],
    ['E-commerce', 'Built to Turn Browsers Into Buyers', ['Shopify: beautiful storefronts, powerful built-in e-commerce features.', 'WooCommerce: WordPress-based, flexible, full control.', 'Payment integration: Stripe, PayPal, multi-currency support.', 'Inventory management: streamlined stock control and fulfilment.'], null, '/images/services/web-ecommerce.webp'],
    ['Bespoke Development', 'Built Around the Business, Not the Other Way Round', ['Custom APIs: bespoke integrations and connections to existing business systems.', 'React & Next.js: modern frameworks, built for performance.', 'Database design: scalable data architecture that grows with the business.', 'Third-party integration: CRMs, ERPs, and other external systems.'], null, '/images/services/web-bespoke-development.webp'],
    ['Creative Web Design', 'Design That Does More Than Look Good', ['UI design: clean, user-focused interfaces built to feel effortless.', 'Motion & animation: subtle interaction that enhances the experience, not decoration for its own sake.', "Brand integration: websites that actually reflect the business's identity.", 'Responsive design: built to work properly across every device and screen size.'], null, '/images/services/web-creative-design.webp'],
    ['UX/UI Design', 'Experiences Built Around How People Actually Use Them', ['User research: understanding audience needs and behaviour before design starts.', 'Wireframing: low-fidelity prototypes to validate ideas early.', 'Usability testing: real user feedback used to refine the experience.', 'Conversion optimisation: evidence-based improvements that actually move the numbers.'], null, '/images/services/web-ux-ui-design.webp'],
];

const faqs = [
    ['How long does a website project take?', 'It depends on scope, a focused brochure site takes considerably less time than a bespoke web application. On average, projects go from design to delivery in around 4 weeks.'],
    ["Can you improve our existing site instead of rebuilding it?", "Yes, sometimes a rebuild isn't necessary. Our free speed audit tells you exactly that, whether the fix is optimisation, or a full rebuild."],
    ['What happens after I book the free speed audit?', "We'll review your current site's performance and give you a clear picture of what's actually slowing it down, along with a straightforward recommendation, optimise, or rebuild, no obligation either way."],
    ['Will I be able to update the site myself afterwards?', "Yes, we build on systems that let you manage content without needing to code, and we'll walk you through how to use it."],
    ['What if we already use a specific platform?', "That's fine, we can work with what's already in place where it makes sense, rather than replacing something simply because we didn't build it."],
    ['Do you offer ongoing support after launch?', "Yes, where it makes sense. Some clients move into an ongoing support arrangement after launch, others prefer a project-by-project relationship, we'll talk through what fits before the work wraps up."],
];

const webTools = [
    ['WordPress', 'wordpress'], ['HubSpot', 'hubspot'], ['Webflow', 'webflow'], ['Framer', 'framer'], ['React', 'react'], ['Next.js', 'nextdotjs'], ['Node.js', 'nodedotjs'], ['TypeScript', 'typescript'], ['Shopify', 'shopify'], ['WooCommerce', 'woocommerce'], ['Stripe', 'stripe'], ['PayPal', 'paypal'],
].map(([name, slug]) => ({ name, src: `https://cdn.simpleicons.org/${slug}` })).concat({ name: 'AWS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' });

const relatedServices = [
    ['Software & Digital Products', 'Custom software and platforms built around ideas that need more than a website.', '/services/software-digital-products'],
    ['Branding & Creative', 'Brand identities built from strategy through to logo, guidelines, and everything in between.', '/services/brand-creative'],
    ['AI & Automation', 'Chatbots, workflow automation, and training that save your team time.', '/services/ai-automation'],
    ['Strategy & Operations', 'Fixing the operations, processes, and systems behind the business.', '/services/strategy-operations'],
    ['Data & Analytics', 'Turning scattered information into dashboards and insight the team can actually use.', '/services/data-analytics'],
];

export function MetricCounter({ value, suffix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;

        let frame;
        let started = false;
        const start = () => {
            if (started) return;
            started = true;
            const startedAt = performance.now();
            const duration = 1100;
            const tick = (now) => {
                const progress = Math.min(1, (now - startedAt) / duration);
                const eased = 1 - ((1 - progress) ** 3);
                setCount(Math.round(value * eased));
                if (progress < 1) frame = requestAnimationFrame(tick);
            };
            frame = requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                start();
                observer.disconnect();
            }
        }, { threshold: 0.35 });
        observer.observe(node);
        return () => {
            observer.disconnect();
            if (frame) cancelAnimationFrame(frame);
        };
    }, [value]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export function SatisfactionScore({ value }) {
    return (
        <div className="stats-bento-primary-main stats-bento-satisfaction">
            <div className="stats-bento-score-ring" style={{ '--score': value }}>
                <strong><MetricCounter value={value} suffix="%" /></strong>
            </div>
            <span className="stats-bento-satisfaction-label">Client<br /><em>Satisfaction</em><br />Score</span>
        </div>
    );
}

function WebDevelopmentUxPage({ Navbar, Footer, FinalCTA }) {
    const animationFrameRef = useRef(null);
    const [animationScale, setAnimationScale] = useState(1);

    useLayoutEffect(() => {
        const node = animationFrameRef.current;
        if (!node) return undefined;

        const updateScale = () => {
            const { width, height } = node.getBoundingClientRect();
            setAnimationScale(Math.min(width / 1240, height / 820));
        };

        updateScale();
        const observer = new ResizeObserver(updateScale);
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Navbar />
            <main className="page-shell web-development-page">
                <ServicesCollageHero
                    title={<>Your website should work as hard as your best <span>salesperson.</span></>}
                    subtitle="It should bring people in, earn their trust, and turn them into customers, around the clock, without you having to think about it. We pair solid development with design built around how people actually use it, so it doesn't just look good, it gets results."
                    visual={<figure className="web-development-hero-animation" ref={animationFrameRef}><iframe src="/animations/web-development.html" title="Animated website design and development workspace" loading="eager" sandbox="allow-scripts" style={{ transform: `translate(-50%, -50%) scale(${animationScale})` }} /></figure>}
                />
                <ExploreMetricsSection title={<>Design That <span>Delivers</span></>}>
                            <article className="stats-bento-primary">
                                <SatisfactionScore value={98} />
                                <div className="stats-bento-primary-meta">
                                    <span><b>5-Star</b> Google &amp; Trustpilot Reviews</span>
                                    <span><b>GDPR Compliant</b> From Start to Finish</span>
                                </div>
                            </article>
                            <article className="stats-bento-growth">
                                <div className="stats-bento-value-first"><strong><MetricCounter value={108} /></strong><span>Projects Completed</span></div>
                            </article>
                            <article className="stats-bento-small"><strong><MetricCounter value={27} suffix="%" /></strong><span>Average Increase in Traffic</span></article>
                            <article className="stats-bento-rating stats-bento-rating-wide">
                                <div><strong><MetricCounter value={4} suffix=" Weeks" /></strong><span>Average Design to Delivery</span></div>
                            </article>
                </ExploreMetricsSection>
                <ExploreServicesSection services={services} />
                <ExploreToolkitSection title={<>Our Web Development <span>Toolkit</span></>} subtitle="The platforms and technologies we use to build fast, dependable digital experiences." items={webTools} />
                <ExploreSupportSection title="Rebuilds & Performance" intro="Sometimes the answer isn't a new website, it's fixing the one you've got." options={[{ icon: Gauge, title: 'Website Rebuilds', description: 'Replacing a slow, fragile, or outdated site while preserving the content and search rankings that already work.' }, { icon: Search, title: 'Free Speed Audit', description: 'A quick performance check to see whether the fix is optimisation, or a full rebuild.' }]} />
                <HowItWorksBlock
                    eyebrow="Why Choose Us"
                    title={<>For Your Next <span className="consulting-project-script">Web Development Project</span></>}
                    intro={null}
                    secondaryIntro={null}
                    steps={[
                        { icon: Gauge, title: 'Speed & SEO Optimisation', copy: 'Built around real performance fundamentals, fast to load, and built to stay that way.' },
                        { icon: TrendingUp, title: 'Growth & Scalability', copy: "Architecture designed to hold up as traffic and complexity increase, not something you'll need to rebuild in a year." },
                        { icon: Users, title: 'User-Centric Design', copy: 'Every decision shaped by how people actually use the site, not guesswork or personal preference.' },
                        { icon: Cable, title: 'Smooth Integrations', copy: 'Connects properly with your CRM, payment systems, and marketing tools, not sitting isolated from the rest of the business.' },
                    ]}
                />
                <ServiceWorkSection
                    title={<>Web Development &amp;<br />UX <span>Projects</span></>}
                    intro="A look at some of the digital experiences we've built, real businesses, real users, real results."
                    items={[
                        { image: '/images/vireda-office-mockup.png', name: 'Conversion-focused website', description: 'A faster, clearer website shaped around the questions customers ask before they buy.' },
                        { image: '/images/homepage-about-vireda-team.jpg', name: 'User experience redesign', description: 'A simplified customer journey that removed friction from the most important actions.' },
                        { image: '/images/strategy-transformation-visual.jpeg', name: 'Connected digital platform', description: 'A responsive experience connected properly to the tools behind the business.' },
                    ]}
                />
                <FaqSplitSection items={faqs} />
                <ExploreRelatedServicesSection intro="A strong website rarely works in isolation. Here's where else we might fit in." items={relatedServices} />
                <FinalCTA eyebrow={null} text="Let's Get This Moving" highlight="Moving" description="Book a free discovery call to talk through what you need, or send us a message and we'll get back to you as soon as we can." primaryLabel="Book a Conversation" secondaryLabel="Send a Message" />
            </main>
            <Footer />
        </>
    );
}

export default WebDevelopmentUxPage;
