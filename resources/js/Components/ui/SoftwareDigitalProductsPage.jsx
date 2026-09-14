import React, { useLayoutEffect, useRef, useState } from 'react';
import { Boxes, GitBranch, Lightbulb, Rocket, Search, Settings2 } from 'lucide-react';
import { ServicesCollageHero } from './ServicesCollageHero';
import { HowItWorksBlock } from './HowItWorksBlock';
import { ServiceWorkSection } from './ServiceWorkSection';
import { MetricCounter, SatisfactionScore } from './WebDevelopmentUxPage';
import { FaqSplitSection } from './FaqSplitSection';
import { ExploreMetricsSection, ExploreRelatedServicesSection, ExploreServicesSection, ExploreSupportSection, ExploreToolkitSection } from './ExplorePageSections';

const softwareServices = [
    ['Product Strategy & Validation', 'Tested Before You Build', ['Discovery workshops: getting clear on the problem before designing a solution.', 'Market validation: testing assumptions with real feedback, not guesswork.', 'Roadmapping: a clear, phased plan from idea to launch.'], "We test the idea before committing to the build, so you're not spending months on something the market was never going to want.", '/images/services/software-product-strategy.webp'],
    ['MVP & Product Development', 'Built Around Your Business, Not a Template', ['MVP development: a lean, functional first version built to test and learn fast.', 'Product design: interfaces built around how real users will actually work with the product.', 'Full product development: taking a validated idea from MVP to a complete, polished platform.'], "No two products have exactly the same needs. We build around your users, objectives, and the problem you're trying to solve.", '/images/services/software-mvp-development.webp'],
    ['Bespoke Software & Integrations', 'Technology With a Purpose', ['Custom software: bespoke systems built around exact business requirements.', 'CRM solutions: tools built around how the business actually sells and serves customers.', 'Third-party integrations: connecting to the systems the business already relies on.'], 'The technology is only valuable if it solves a real problem, not complexity added for its own sake.', '/images/services/software-bespoke-integrations.webp'],
];

const softwareTools = [
    ['React', 'react'], ['Next.js', 'nextdotjs'], ['Node.js', 'nodedotjs'], ['TypeScript', 'typescript'], ['Figma', 'figma'], ['MongoDB', 'mongodb'], ['PostgreSQL', 'postgresql'],
].map(([name, slug]) => ({ name, src: `https://cdn.simpleicons.org/${slug}` })).concat({ name: 'AWS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' });

const softwareFaqs = [
    ['I have an idea but nothing written down, is that enough to start?', "Yes. Most projects start exactly there, we'll help shape it into something testable before any development begins."],
    ['How do you decide between an MVP and a full build?', "It depends on how validated the idea already is, an MVP is usually the right first step when there's still real uncertainty to test."],
    ['Can you integrate with software we already use?', "Yes, we build around what's already in place where it makes sense, rather than replacing something simply because we didn't build it."],
    ['What happens if user feedback says we need to change direction?', "That's exactly what early validation is for, better to learn that before a full build than after one."],
    ['Who owns the product once it is built?', "You do. It's built for your business, not licensed or shared."],
    ['Do you offer ongoing support after launch?', "Yes, where it makes sense. Some products need continued development as they grow, others are stable after launch, we'll talk through what fits."],
];

const relatedServices = [
    ['Web Development & UX', 'Websites and digital experiences built around how people actually use them.', '/services/web-development-ux'],
    ['Branding & Creative', 'Brand identities built from strategy through to logo, guidelines, and everything in between.', '/services/brand-creative'],
    ['AI & Automation', 'Chatbots, workflow automation, and training that save your team time.', '/services/ai-automation'],
    ['Strategy & Operations', 'Fixing the operations, processes, and systems behind the business.', '/services/strategy-operations'],
    ['Data & Analytics', 'Turning scattered information into dashboards and insight the team can actually use.', '/services/data-analytics'],
];

export default function SoftwareDigitalProductsPage({ Navbar, Footer, FinalCTA, workProjects = [] }) {
    const animationFrameRef = useRef(null);
    const [animationScale, setAnimationScale] = useState(1);

    useLayoutEffect(() => {
        const node = animationFrameRef.current;
        if (!node) return undefined;
        const updateScale = () => {
            const { width, height } = node.getBoundingClientRect();
            setAnimationScale(Math.min(width / 1300, height / 780));
        };
        updateScale();
        const observer = new ResizeObserver(updateScale);
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Navbar />
            <main className="page-shell web-development-page software-products-page">
                <ServicesCollageHero eyebrow="Software & Digital Products" title={<>Most ideas never make it past the whiteboard. We build the ones that <span>should.</span></>} subtitle="We design and build the software, digital products, and platforms those ideas actually need, from early thinking and validation through to something real, built to last. Because the right product isn't just a good idea brought to life, it's a new way to save time, win customers, or open up revenue you didn't have before." visual={<figure className="web-development-hero-animation software-products-hero-animation" ref={animationFrameRef}><iframe src="/animations/software-development.html" title="Animated software and digital product workspace" loading="eager" sandbox="allow-scripts" style={{ transform: `translate(-50%, -50%) scale(${animationScale})` }} /></figure>} />

                <ExploreMetricsSection title={<>From Idea to <span>Impact</span></>}>
                    <article className="stats-bento-primary"><SatisfactionScore value={97} /><div className="stats-bento-primary-meta"><span><span className="stats-bento-meta-value"><MetricCounter value={58} suffix="%" /></span> Projects Moving Beyond MVP to Full Build</span><span><span className="stats-bento-meta-value"><MetricCounter value={3} /></span> Integrations Built on Average per Project</span></div></article>
                    <article className="stats-bento-growth"><div className="stats-bento-value-first"><strong><MetricCounter value={36} /></strong><span>Products Delivered</span></div></article>
                    <article className="stats-bento-small"><strong><MetricCounter value={82} suffix="%" /></strong><span>Average User Adoption Rate Post-Launch</span></article>
                    <article className="stats-bento-rating stats-bento-rating-wide"><div><strong><MetricCounter value={6} suffix=" Weeks" /></strong><span>Average Concept to MVP</span></div></article>
                </ExploreMetricsSection>

                <ExploreServicesSection services={softwareServices} />
                <ExploreToolkitSection title={<>Our Software &amp; Product <span>Toolkit</span></>} subtitle="The tools and platforms we use to take products from idea to launch." items={softwareTools} />
                <ExploreSupportSection title="Venture" intro="When an idea has the potential to become something bigger than an internal tool." options={[{ icon: Rocket, title: 'Venture Development', description: 'Taking a validated product beyond the initial build, toward something that can stand on its own.' }, { icon: Search, title: 'Free Idea Validation Session', description: 'A working session to pressure-test a new idea before any development starts.' }]} />

                <HowItWorksBlock eyebrow="Why Choose Us" title={<>For Your Next <span className="consulting-project-script">Software Project</span></>} intro={null} secondaryIntro={null} steps={[
                    { icon: Lightbulb, title: 'Validated Before Built', copy: "We test the idea's assumptions before committing real development time to it." },
                    { icon: GitBranch, title: 'Designed to Evolve', copy: 'Built with the future in mind, so the product can adapt as the business grows.' },
                    { icon: Boxes, title: 'Built Around Your Business', copy: 'No generic templates, solutions shaped by your users and your problem specifically.' },
                    { icon: Settings2, title: 'Technology With Purpose', copy: "Complexity only where it earns its place, nothing added just because it's possible." },
                ]} />

                <ServiceWorkSection
                    title={<>Software &amp; Digital<br />Products <span>Projects</span></>}
                    intro="A look at some of the products and platforms we've built, real ideas, real businesses, real outcomes."
                    items={workProjects}
                />

                <FaqSplitSection items={softwareFaqs} />

                <ExploreRelatedServicesSection intro="A great product rarely works in isolation. Here's where else we might fit in." items={relatedServices} />

                <FinalCTA eyebrow={null} text="Let's Get This Moving" highlight="Moving" description="Book a free discovery call to talk through what you need, or send us a message and we'll get back to you as soon as we can." primaryLabel="Book a Conversation" secondaryLabel="Send a Message" />
            </main>
            <Footer />
        </>
    );
}
