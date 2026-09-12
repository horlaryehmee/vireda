import React, { useLayoutEffect, useRef, useState } from 'react';
import { Activity, FileCheck2, Hammer, Network, Search, Target } from 'lucide-react';
import { ServicesCollageHero } from './ServicesCollageHero';
import { HowItWorksBlock } from './HowItWorksBlock';
import { ServiceWorkSection } from './ServiceWorkSection';
import { MetricCounter, SatisfactionScore } from './WebDevelopmentUxPage';
import { FaqSplitSection } from './FaqSplitSection';
import { ExploreMetricsSection, ExploreRelatedServicesSection, ExploreServicesSection, ExploreSupportSection, ExploreToolkitSection } from './ExplorePageSections';

const strategyServices = [
    ['Operations & Process Improvement', "Fixing What's Quietly Costing You Time", ['Process mapping: identifying bottlenecks, duplication, and unnecessary steps.', 'Workflow redesign: clearer, leaner ways of working that hold up as the business grows.', 'Documentation: turning tribal knowledge into process anyone on the team can follow.', 'Change support: helping the team actually adopt the new way of working, not just agree to it.'], 'We map how work actually moves through the business, then remove what is slowing it down.', '/images/services/strategy-process-improvement.webp'],
    ['Lead & Sales Systems', 'Stopping Good Opportunities From Slipping Through', ['Lead pipelines: a clear, trackable path from enquiry to booking.', 'CRM setup: configured around how the business actually sells.', 'Follow-up systems: automated where it helps, personal where it matters.', 'Conversion review: identifying exactly where opportunities are being lost.'], 'We build the structure that turns enquiries into customers, consistently.', '/images/services/strategy-sales-systems.webp'],
    ['Operating Models & Structure', 'Built to Support Growth, Not Slow It Down', ['Operating model design: a clear structure for who does what and how decisions get made.', 'Role clarity: removing the overlap and gaps that cause friction.', "Scalable systems: processes that don't need reinventing every time the business gets bigger."], 'As a business grows, roles, responsibilities, and decision-making need to grow with it.', '/images/services/strategy-operating-model.webp'],
];

const strategyFaqs = [
    ["Do I need to know exactly what's wrong before contacting you?", "No. Most clients come to us knowing something isn't working, not exactly what or why. That's what the first conversation is for."],
    ['How long does a consulting engagement take?', "Depends on scope, a focused process fix can take a few weeks, a full operating model review takes longer. We'll give a realistic timeline once we understand what's involved."],
    ['Will you just hand us a report, or actually help implement changes?', "We stay involved through implementation where it's wanted, a plan nobody acts on doesn't change anything."],
    ['Can you work alongside our existing team, not replace them?', 'Yes, most engagements work best that way, we bring outside perspective and specific expertise, your team brings the day-to-day context.'],
    ['What if the problem turns out to be bigger than we thought?', "We'll tell you honestly, and help you prioritise what to tackle first, rather than trying to fix everything at once."],
    ['Do you offer ongoing support after the engagement ends?', 'Yes, where it makes sense. Some clients need a one-off fix, others want continued support as the business keeps changing.'],
];

const relatedServices = [
    ['Web Development & UX', 'Websites and digital experiences built around how people actually use them.', '/services/web-development-ux'],
    ['Software & Digital Products', 'Custom software and platforms built around ideas that need more than a website.', '/services/software-digital-products'],
    ['Branding & Creative', 'Brand identities built from strategy through to logo, guidelines, and everything in between.', '/services/brand-creative'],
    ['AI & Automation', 'Chatbots, workflow automation, and training that save your team time.', '/services/ai-automation'],
    ['Data & Analytics', 'Turning scattered information into dashboards and insight the team can actually use.', '/services/data-analytics'],
];

const diagnosticOptions = [
    {
        icon: Activity,
        title: 'Business Health Check',
        description: 'A structured review of where time, money, and opportunity are being lost.',
    },
    {
        icon: Search,
        title: 'Free Process Audit',
        description: "A quick look at one specific process to identify fast, practical wins.",
    },
];

const whyChooseReasons = [
    { icon: Target, title: 'We Start With the Problem', copy: 'No predetermined solution, no fixed package, just what the business actually needs.' },
    { icon: FileCheck2, title: 'Built to Last Beyond the Engagement', copy: 'Documented, repeatable processes the team can run without us.' },
    { icon: Hammer, title: 'Practical, Not Theoretical', copy: 'Recommendations that get implemented, not filed away.' },
    { icon: Network, title: 'Whole-Business View', copy: 'We consider how a fix in one area affects everything connected to it.' },
];

export default function StrategyOperationsPage({ Navbar, Footer, FinalCTA }) {
    const animationFrameRef = useRef(null);
    const [animationScale, setAnimationScale] = useState(1);

    useLayoutEffect(() => {
        const node = animationFrameRef.current;
        if (!node) return undefined;
        const updateScale = () => {
            const { width, height } = node.getBoundingClientRect();
            setAnimationScale(Math.min(width / 1300, height / 810));
        };
        updateScale();
        const observer = new ResizeObserver(updateScale);
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Navbar />
            <main className="page-shell web-development-page strategy-operations-page">
                <ServicesCollageHero eyebrow="Strategy & Operations" title={<>Most businesses don't fail. They just <span>outgrow the way they work.</span></>} subtitle="Growth exposes what a smaller version of the business never had to deal with, inefficient processes, unclear ownership, admin that eats the day, and systems held together by habit rather than design. We fix the operations behind the business, not just the symptoms sitting on top of it." visual={<figure className="web-development-hero-animation strategy-operations-hero-animation" ref={animationFrameRef}><iframe src="/animations/operations.html" title="Animated strategy and operations workspace" loading="eager" sandbox="allow-scripts" style={{ transform: `translate(-50%, -50%) scale(${animationScale})` }} /></figure>} />

                <ExploreMetricsSection title={<>Less Friction, More <span>Progress</span></>}>
                    <article className="stats-bento-primary"><SatisfactionScore value={95} /><div className="stats-bento-primary-meta"><span><span className="stats-bento-meta-value"><MetricCounter value={31} suffix="%" /></span> Avg. Reduction in Admin Time</span><span><span className="stats-bento-meta-value"><MetricCounter value={22} suffix="%" /></span> Avg. Increase in Lead Conversion</span></div></article>
                    <article className="stats-bento-growth"><div className="stats-bento-value-first"><strong><MetricCounter value={4} /></strong><span>Processes Redesigned on Average per Project</span></div></article>
                    <article className="stats-bento-small stats-bento-align-start"><strong><MetricCounter value={42} /></strong><span>Engagements Completed</span></article>
                    <article className="stats-bento-rating stats-bento-rating-wide"><div><strong><MetricCounter value={2} suffix=" Weeks" /></strong><span>Average Diagnosis to First Result</span></div></article>
                </ExploreMetricsSection>

                <ExploreServicesSection services={strategyServices} />
                <ExploreToolkitSection title={<>Our Consulting <span>Toolkit</span></>} subtitle="The frameworks and methods we bring to every engagement." items={['Process Mapping', 'Root-Cause Analysis', 'Operating Model Design', 'Workflow Automation', 'CRM Strategy', 'Change Management'].map((name) => ({ name }))} />
                <ExploreSupportSection title="Diagnostic & Health" accentTitle="Check Support" intro="Sometimes the answer isn't a full overhaul, it's knowing exactly where to start." options={diagnosticOptions} />

                <HowItWorksBlock eyebrow="Why Choose Us" title={<>For Your Next <span className="consulting-project-script">Consulting Project</span></>} intro={null} secondaryIntro={null} steps={whyChooseReasons} />

                <ServiceWorkSection
                    title={<>Strategy &amp;<br />Operations <span>Projects</span></>}
                    intro="A look at some of the businesses we've helped run leaner, real problems, real fixes, real results."
                    items={[
                        { image: '/images/about-strategy-workshop.jpg', name: 'Business strategy workshop', description: 'A focused strategy session that turned competing priorities into a practical plan.' },
                        { image: '/images/homepage-about-vireda-team.jpg', name: 'Operations team collaboration', description: 'Clearer roles and leaner workflows that helped the team move work forward faster.' },
                        { image: '/images/strategy-transformation-visual.jpeg', name: 'Strategy transformation project', description: 'An operating model redesigned to support growth without adding unnecessary complexity.' },
                    ]}
                />

                <FaqSplitSection items={strategyFaqs} />

                <ExploreRelatedServicesSection intro="Operational problems rarely stay contained to one area. Here's where else we might fit in." items={relatedServices} />

                <FinalCTA eyebrow={null} text="Let's Get This Moving" highlight="Moving" description="Book a free discovery call to talk through what you need, or send us a message and we'll get back to you as soon as we can." primaryLabel="Book a Conversation" secondaryLabel="Send a Message" />
            </main>
            <Footer />
        </>
    );
}
