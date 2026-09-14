import React, { useLayoutEffect, useRef, useState } from 'react';
import { BarChart3, Bot, Clock3, GraduationCap, Search, Sparkles } from 'lucide-react';
import { ServicesCollageHero } from './ServicesCollageHero';
import { HowItWorksBlock } from './HowItWorksBlock';
import { ServiceWorkSection } from './ServiceWorkSection';
import { MetricCounter, SatisfactionScore } from './WebDevelopmentUxPage';
import { FaqSplitSection } from './FaqSplitSection';
import { ExploreMetricsSection, ExploreRelatedServicesSection, ExploreServicesSection, ExploreSupportSection, ExploreToolkitSection } from './ExplorePageSections';

const aiServices = [
    ['AI Chatbots', "Working the Front Desk, So You Don't Have To", ['Natural language: understands context and intent, not just keyword matching.', 'Lead qualification: automatically qualifies and routes enquiries.', 'Multi-platform: deployed on websites, WhatsApp, and social media.', 'Analytics: tracks conversations and improves performance over time.'], "Trained on the business's own information, not a generic script.", '/images/services/ai-chatbots.webp'],
    ['Workflow Automation', 'Where Time Being Lost Is Removed', ['Process mapping: identifying bottlenecks and automation opportunities.', 'Tool integration: connecting CRM, email, and other business tools.', "Custom workflows: bespoke automation built around the business's actual processes.", 'Monitoring: real-time alerts and performance tracking, so nothing fails silently.'], 'We map the manual, repetitive work first, then automate it properly.', '/images/services/ai-workflow-automation.webp'],
    ['AI Training', 'Confidence, Not Just Access', ['Team workshops: hands-on, interactive sessions for the whole team.', 'Tool training: practical use of tools like ChatGPT and Claude.', 'Use cases: examples specific to the business, not generic demos.', 'Ongoing support: follow-up sessions and Q&A after the initial training.'], 'A tool is only useful if the team actually trusts it enough to use it.', '/images/services/ai-training.webp'],
];

const aiTools = [
    { name: 'OpenAI', src: 'https://img.icons8.com/color/96/chatgpt.png' },
    { name: 'Claude', src: 'https://cdn.simpleicons.org/anthropic' },
    { name: 'n8n', src: 'https://cdn.simpleicons.org/n8n' },
    { name: 'Make', src: 'https://cdn.simpleicons.org/make' },
    { name: 'Zapier', src: 'https://cdn.simpleicons.org/zapier' },
    { name: 'Slack', src: 'https://img.icons8.com/color/96/slack-new.png' },
    { name: 'Google Workspace', src: 'https://cdn.simpleicons.org/google' },
    { name: 'Airtable', src: 'https://cdn.simpleicons.org/airtable' },
];

const aiFaqs = [
    ['Do I need technical knowledge to use AI tools?', 'No, we build and explain everything in plain language, focused on what it means for the business, not the mechanics behind it.'],
    ['What kind of tasks can actually be automated?', 'Repetitive, rules-based work: data entry, email handling, scheduling, routine customer queries, anything eating time without needing real judgement.'],
    ['Is AI suitable for a smaller business?', "Yes, in fact it's often where it makes the biggest relative difference, freeing up time a small team doesn't have to spare."],
    ['How long does it take to set up AI automation?', "Depends on complexity, a single chatbot or workflow can be live in weeks, larger integrations take longer. We'll scope a realistic timeline upfront."],
    ['Do you use AI in every project?', "No. If it genuinely improves the outcome, we'll recommend it. If it doesn't, we won't add it just because it's fashionable."],
    ['Do you offer ongoing support after launch?', "Yes, where it makes sense. Some clients need occasional tuning as their processes evolve, others prefer a one-off setup, we'll talk through what fits."],
];

const relatedServices = [
    ['Web Development & UX', 'Websites and digital experiences built around how people actually use them.', '/services/web-development-ux'],
    ['Software & Digital Products', 'Custom software and platforms built around ideas that need more than a website.', '/services/software-digital-products'],
    ['Branding & Creative', 'Brand identities built from strategy through to logo, guidelines, and everything in between.', '/services/brand-creative'],
    ['Strategy & Operations', 'Fixing the operations, processes, and systems behind the business.', '/services/strategy-operations'],
    ['Data & Analytics', 'Turning scattered information into dashboards and insight the team can actually use.', '/services/data-analytics'],
];

export default function AiAutomationPage({ Navbar, Footer, FinalCTA, workProjects = [] }) {
    const animationFrameRef = useRef(null);
    const [animationScale, setAnimationScale] = useState(1);

    useLayoutEffect(() => {
        const node = animationFrameRef.current;
        if (!node) return undefined;
        const updateScale = () => {
            const { width, height } = node.getBoundingClientRect();
            setAnimationScale(Math.min(width / 1320, height / 800));
        };
        updateScale();
        const observer = new ResizeObserver(updateScale);
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Navbar />
            <main className="page-shell web-development-page ai-automation-page">
                <ServicesCollageHero eyebrow="AI & Automation" title={<>AI only earns its place if it actually saves you <span>time.</span></>} subtitle="AI isn't just about the AI-generated images and videos you see on social media, it's for any business tired of spending hours on work a system could handle instead. We focus on three things: chatbots that actually help, automation that removes real admin, and making sure your team knows how to use what we build." visual={<figure className="web-development-hero-animation ai-automation-hero-animation" ref={animationFrameRef}><iframe src="/animations/ai-automation.html" title="Animated AI and automation workspace" loading="eager" sandbox="allow-scripts" style={{ transform: `translate(-50%, -50%) scale(${animationScale})` }} /></figure>} />

                <ExploreMetricsSection title={<>Time Given <span>Back</span></>}>
                    <article className="stats-bento-primary">
                        <SatisfactionScore value={96} />
                        <div className="stats-bento-primary-meta"><span><span className="stats-bento-meta-value"><MetricCounter value={45} suffix="%" /></span> Reduction in Response Time</span><span><span className="stats-bento-meta-value"><MetricCounter value={6} /></span> Workflows Automated on Average per Project</span></div>
                    </article>
                    <article className="stats-bento-growth"><div className="stats-bento-value-first"><strong><MetricCounter value={51} /></strong><span>Automation Projects Completed</span></div></article>
                    <article className="stats-bento-small"><strong><MetricCounter value={12} suffix=" hrs/week" /></strong><span>Average Time Saved</span></article>
                    <article className="stats-bento-rating stats-bento-rating-wide"><div><strong><MetricCounter value={3} suffix=" Weeks" /></strong><span>Average Setup to Launch</span></div></article>
                </ExploreMetricsSection>

                <ExploreServicesSection services={aiServices} />
                <ExploreToolkitSection title={<>Our AI &amp; Automation <span>Toolkit</span></>} subtitle="The tools and platforms we use to make automation practical." items={aiTools} />
                <ExploreSupportSection title="AI Audit & Strategy" intro="Sometimes the answer isn't more automation, it's knowing where to start." options={[{ icon: Sparkles, title: 'AI Strategy Session', description: 'A working session to identify where AI or automation could genuinely create value in the business.' }, { icon: Search, title: 'Free Automation Audit', description: "A quick review of manual, repetitive processes to see what's actually worth automating first." }]} />

                <HowItWorksBlock eyebrow="Why Choose Us" title={<>For Your Next <span className="consulting-project-script">AI &amp; Automation Project</span></>} intro={null} secondaryIntro={null} steps={[
                    { icon: Clock3, title: 'Time Saved, Not Just Automated', copy: 'Every automation solves a specific bottleneck, not automation for its own sake.' },
                    { icon: Bot, title: 'Available Beyond Office Hours', copy: "Chatbots and workflows that keep working when your team isn't." },
                    { icon: BarChart3, title: 'Insight, Not Just Output', copy: 'AI-powered analytics that surface patterns a person might miss.' },
                    { icon: GraduationCap, title: 'Built to Last', copy: "Adopted properly, with training included, not bolted on because it's trending." },
                ]} />

                <ServiceWorkSection
                    title={<>AI &amp;<br />Automation <span>Projects</span></>}
                    intro="A look at some of the systems we've built, real time saved, real businesses, real results."
                    items={workProjects}
                />

                <FaqSplitSection items={aiFaqs} />

                <ExploreRelatedServicesSection intro="AI and automation rarely solve everything on their own. Here's where else we might fit in." items={relatedServices} />

                <FinalCTA eyebrow={null} text="Let's Get This Moving" highlight="Moving" description="Book a free discovery call to talk through what you need, or send us a message and we'll get back to you as soon as we can." primaryLabel="Book a Conversation" secondaryLabel="Send a Message" />
            </main>
            <Footer />
        </>
    );
}
