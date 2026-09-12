import React, { useLayoutEffect, useRef, useState } from 'react';
import { BadgeCheck, Building2, Clock3, HeartPulse, Search, Sparkles } from 'lucide-react';
import { ServicesCollageHero } from './ServicesCollageHero';
import { HowItWorksBlock } from './HowItWorksBlock';
import { ServiceWorkSection } from './ServiceWorkSection';
import { MetricCounter, SatisfactionScore } from './WebDevelopmentUxPage';
import { FaqSplitSection } from './FaqSplitSection';
import { ExploreMetricsSection, ExploreRelatedServicesSection, ExploreServicesSection, ExploreSupportSection, ExploreToolkitSection } from './ExplorePageSections';

const dataServices = [
    ['Dashboards & Reporting', "Numbers You Don't Have to Second-Guess", ['Custom dashboards: built around the metrics that actually matter to the business.', 'Automated reporting: fewer hours spent compiling numbers, more time spent using them.', "KPI tracking: clear visibility on what's working and what isn't, at a glance."], 'Replacing manual, error-prone reporting with systems that update themselves and are actually right.', '/images/services/data-dashboards.webp'],
    ['Data Strategy & Integration', 'One Source of Truth, Finally', ['Data strategy: a clear plan for what data matters and how it should be used.', 'API & system integration: connecting the tools and platforms already in use.', 'Data cleansing: fixing the inconsistencies that quietly undermine trust in the numbers.'], 'Bringing scattered data together into one place, so decisions are based on the full picture, not whichever report someone pulled last.', '/images/services/data-integration.webp'],
    ['Custom Tools & Analysis', 'Built to Be Used, Not Just Built', ['Internal tools: dashboards, portals, and systems tailored to the business.', "Deep-dive analysis: uncovering patterns and opportunities a standard report wouldn't surface.", "Training: making sure the team actually knows how to use what's been built."], "When standard software isn't enough, we create tools that fit how the business actually works.", '/images/services/data-custom-analysis.webp'],
];

const dataTools = [
    { name: 'Power BI', src: 'https://img.icons8.com/color/96/power-bi.png' },
    { name: 'Excel', src: 'https://img.icons8.com/color/96/microsoft-excel-2019.png' },
    { name: 'SQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg' },
    { name: 'Python', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
    { name: 'Looker Studio', src: 'https://cdn.simpleicons.org/looker' },
    { name: 'Tableau', src: 'https://img.icons8.com/color/96/tableau-software.png' },
    { name: 'Azure', src: 'https://img.icons8.com/color/96/azure-1.png' },
];

const dataFaqs = [
    ["We don't have clean data, is that a problem?", "No, that's a common starting point. Part of the work is bringing scattered or messy data into something usable."],
    ['Do you work with the tools we already use?', 'Yes, we build around your existing systems where possible, rather than requiring a full switch.'],
    ['How long does a dashboard project take?', "Depends on scope and how many data sources are involved, we'll give a realistic timeline once we understand what's needed."],
    ['Will our team be able to update the dashboards themselves?', 'Yes, we build with usability in mind and walk your team through how everything works.'],
    ['Can you automate reports we currently do manually?', "In most cases, yes, that's often where the biggest time savings come from."],
    ['Do you offer ongoing support after delivery?', "Yes, where it makes sense. Some clients need occasional updates as their data changes, others prefer a one-off build, we'll talk through what fits."],
];

const relatedServices = [
    ['Web Development & UX', 'Websites and digital experiences built around how people actually use them.', '/services/web-development-ux'],
    ['Software & Digital Products', 'Custom software and platforms built around ideas that need more than a website.', '/services/software-digital-products'],
    ['Branding & Creative', 'Brand identities built from strategy through to logo, guidelines, and everything in between.', '/services/brand-creative'],
    ['AI & Automation', 'Chatbots, workflow automation, and training that save your team time.', '/services/ai-automation'],
    ['Strategy & Operations', 'Fixing the operations, processes, and systems behind the business.', '/services/strategy-operations'],
];

export default function DataAnalyticsPage({ Navbar, Footer, FinalCTA }) {
    const animationFrameRef = useRef(null);
    const [animationScale, setAnimationScale] = useState(1);

    useLayoutEffect(() => {
        const node = animationFrameRef.current;
        if (!node) return undefined;
        const updateScale = () => {
            const { width, height } = node.getBoundingClientRect();
            setAnimationScale(Math.min(width / 1300, height / 1000));
        };
        updateScale();
        const observer = new ResizeObserver(updateScale);
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Navbar />
            <main className="page-shell web-development-page data-analytics-page">
                <ServicesCollageHero eyebrow="Data & Analytics" title={<>Your business already has data. The challenge is making it work for <span>you.</span></>} subtitle="Most businesses aren't short on information, they're short on time to make sense of it. We bring data together, build reporting people actually trust, and create tools that turn numbers into decisions." visual={<figure className="web-development-hero-animation data-analytics-hero-animation" ref={animationFrameRef}><iframe src="/animations/data-analytics.html" title="Animated data and analytics workspace" loading="eager" sandbox="allow-scripts" style={{ transform: `translate(-50%, -50%) scale(${animationScale})` }} /></figure>} />

                <ExploreMetricsSection title={<>Facts Over <span>Assumptions</span></>}>
                    <article className="stats-bento-primary"><SatisfactionScore value={98} /><div className="stats-bento-primary-meta"><span><span className="stats-bento-meta-value"><MetricCounter value={5} /></span> Data Sources Connected on Average</span><span><span className="stats-bento-meta-value"><MetricCounter value={3} suffix=" hrs/week" /></span> Average Time Saved on Manual Reporting</span></div></article>
                    <article className="stats-bento-growth"><div className="stats-bento-value-first"><strong><MetricCounter value={47} /></strong><span>Dashboards &amp; Reports Delivered</span></div></article>
                    <article className="stats-bento-small"><strong><MetricCounter value={38} suffix="%" /></strong><span>Average Reduction in Reporting Time</span></article>
                    <article className="stats-bento-rating stats-bento-rating-wide"><div><strong><MetricCounter value={2} suffix=" Weeks" /></strong><span>Average Scoping to First Dashboard</span></div></article>
                </ExploreMetricsSection>

                <ExploreServicesSection services={dataServices} />
                <ExploreToolkitSection title={<>Our Data &amp; Analytics <span>Toolkit</span></>} subtitle="The tools and platforms we use to turn information into clear decisions." items={dataTools} />
                <ExploreSupportSection title="Data Health" intro="Sometimes the answer isn't more data, it's trusting the data you already have." options={[{ icon: HeartPulse, title: 'Data Health Check', description: 'A review of current reporting to identify gaps, errors, or duplication.' }, { icon: Search, title: 'Free Dashboard Audit', description: "A quick look at an existing dashboard or report to see what's actually working." }]} />

                <HowItWorksBlock eyebrow="Why Choose Us" title={<>For Your Next <span className="consulting-project-script">Data Project</span></>} intro={null} secondaryIntro={null} steps={[
                    { icon: Sparkles, title: 'Clarity Over Complexity', copy: 'Dashboards built to be understood at a glance, not admired for their complexity.' },
                    { icon: Building2, title: 'Built Around Your Business', copy: 'No generic templates, reporting shaped by the decisions the business actually needs to make.' },
                    { icon: Clock3, title: 'Automated Where It Helps', copy: 'Less manual compiling, more time spent acting on what the data shows.' },
                    { icon: BadgeCheck, title: 'Trusted Numbers', copy: 'Consistent, accurate reporting the whole team can rely on.' },
                ]} />

                <ServiceWorkSection
                    title={<>Data &amp;<br />Analytics <span>Projects</span></>}
                    intro="A look at some of the dashboards and systems we've built, real data, real businesses, real clarity."
                    items={[
                        { image: '/images/strategy-transformation-visual.jpeg', name: 'Business intelligence dashboard', description: 'A decision-ready dashboard that brought the most important measures into one trusted view.' },
                        { image: '/images/vireda-office-mockup.png', name: 'Data reporting workspace', description: 'Automated reporting that replaced repetitive manual updates and conflicting spreadsheets.' },
                        { image: '/images/about-strategy-workshop.jpg', name: 'Data strategy workshop', description: 'A focused workshop that clarified what to measure, where it lives, and how it should be used.' },
                    ]}
                />

                <FaqSplitSection items={dataFaqs} />

                <ExploreRelatedServicesSection intro="Good data rarely solves everything on its own. Here's where else we might fit in." items={relatedServices} />

                <FinalCTA eyebrow={null} text="Let's Get This Moving" highlight="Moving" description="Book a free discovery call to talk through what you need, or send us a message and we'll get back to you as soon as we can." primaryLabel="Book a Conversation" secondaryLabel="Send a Message" />
            </main>
            <Footer />
        </>
    );
}
