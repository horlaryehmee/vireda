import { Box, Compass, Rocket, Settings, Sparkles } from 'lucide-react';

const defaultSteps = [
    {
        icon: Compass,
        title: 'Discover',
        copy: "We begin by understanding your business, your goals, your current situation and what's getting in the way. Whether you're looking to improve a process, build a product, transform your digital presence or explore what's possible with AI, we start by asking the right questions.",
    },
    {
        icon: Settings,
        title: 'Define',
        copy: "We analyse what we've learned, identify opportunities and shape the right approach. This might mean defining a strategy, mapping a process, designing a brand, planning a digital product or determining where technology can create the most value.",
    },
    {
        icon: Box,
        title: 'Build',
        copy: "Once we know what we're solving and how we're going to approach it, we get to work. Depending on the project, that could mean designing a brand, developing a website, building software, creating dashboards, implementing automation or developing an AI-powered solution.",
    },
    {
        icon: Rocket,
        title: 'Launch',
        copy: "We don't consider the work finished when something technically works. We help get the solution ready for the people who will actually use it - from testing and refinement through to implementation, handover and adoption.",
    },
    {
        icon: Sparkles,
        title: 'Evolve',
        copy: "Make it better as your business changes. Businesses don't stand still, and neither should the solutions supporting them. We use feedback, data and real-world performance to identify improvements, optimise what's working and adapt as new opportunities emerge.",
    },
];

export function HowItWorksBlock({
    eyebrow = 'How We Work',
    title = 'From challenge to outcome.',
    intro = "Every project is different. Some start with a business problem, others with an idea, a digital opportunity or something that simply isn't working as well as it should.",
    secondaryIntro = 'Our approach stays consistent: we understand the challenge, find the right direction, build what matters, and keep improving it.',
    steps = defaultSteps,
}) {
    return (
        <section className="how-it-works-block" aria-labelledby="how-it-works-title">
            <div className="how-it-works-inner">
                <div className="how-it-works-heading">
                    <span className="how-it-works-badge">{eyebrow}</span>
                    <h2 id="how-it-works-title">{title}</h2>
                    <p>{intro}</p>
                    <p>{secondaryIntro}</p>
                </div>

                <ol className="how-it-works-steps">
                    {steps.map(({ icon: Icon, title: stepTitle, copy }, index) => {
                        const isLast = index === steps.length - 1;

                        return (
                            <li className="how-it-works-step" key={stepTitle}>
                                <div className="how-it-works-marker" aria-hidden="true">
                                    <span>
                                        <Icon size={18} strokeWidth={1.7} />
                                    </span>
                                    {!isLast && <i />}
                                </div>

                                <div className={`how-it-works-copy ${isLast ? 'is-last' : ''}`}>
                                    <h3>{stepTitle}</h3>
                                    <p>{copy}</p>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
