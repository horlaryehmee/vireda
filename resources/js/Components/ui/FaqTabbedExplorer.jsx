import React, { useState } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {
    ChevronDown,
    Cpu,
    CreditCard,
    LayoutGrid,
    MessageSquare,
    Workflow,
} from 'lucide-react';

const FAQ_DATA = [
    {
        id: 'general',
        label: 'General',
        icon: LayoutGrid,
        items: [
            {
                id: 'general-1',
                question: 'What does Viredá do?',
                answer: 'We help businesses with strategy and operations, websites, software and product development, data and analytics, AI and automation, and branding. We bring whichever mix of these a business actually needs to solve its problem.',
            },
            {
                id: 'general-2',
                question: 'Who do you work with?',
                answer: 'We work with businesses at different stages, from organisations looking to improve what already exists to businesses ready to build something new.',
            },
            {
                id: 'general-3',
                question: 'Do I need to know exactly what I need before contacting you?',
                answer: "No. You don't need to arrive with a finished brief or a solution in mind. Tell us what you're trying to achieve or what's not working, and we'll help work out where to start.",
            },
            {
                id: 'general-4',
                question: 'What makes Viredá different?',
                answer: "We don't start with a service and try to fit your problem into it. We start with the problem, understand the wider context, and bring together the right capabilities to solve it.",
            },
        ],
    },
    {
        id: 'pricing',
        label: 'Pricing',
        icon: CreditCard,
        items: [
            {
                id: 'pricing-1',
                question: 'How much does a Viredá project cost?',
                answer: "It depends on what we're solving and the scope of the work. We don't use a one-size-fits-all price because a website, a data project and a bespoke digital product require very different levels of work.",
            },
            {
                id: 'pricing-2',
                question: 'Do you offer fixed packages?',
                answer: "Where a clearly defined project makes sense as a fixed scope, we'll price it that way. For more complex or evolving work, we'll recommend an approach that gives enough flexibility without losing clarity around cost.",
            },
            {
                id: 'pricing-3',
                question: 'Can you work with a smaller budget?',
                answer: "We'll always look at what can realistically be achieved within your budget. Sometimes the right answer is to start with a focused piece of work and build from there, rather than trying to do everything at once.",
            },
            {
                id: 'pricing-4',
                question: 'Do you require a long-term commitment?',
                answer: 'No. The engagement depends on what you need. Some clients come to us for a specific project; others continue with us as they develop and improve what we’ve built together.',
            },
            {
                id: 'pricing-5',
                question: 'How do payments work?',
                answer: "We keep payment flexible, typically a deposit up front, with the rest split across milestones as the work progresses. We'll agree the specifics with you before anything starts, so cost is spread in a way that works for both sides.",
            },
        ],
    },
    {
        id: 'process',
        label: 'Process',
        icon: Workflow,
        items: [
            {
                id: 'process-1',
                question: 'How do you decide what solution we need?',
                answer: "We start with the problem. From there, we look at what's already in place, what isn't working, what the desired outcome is, and what options make sense before recommending an approach.",
            },
            {
                id: 'process-2',
                question: 'What do you need from us to get started?',
                answer: "Just a conversation to begin with. Once we understand the problem and agree on the right approach, we'll tell you exactly what we need from you, whether that's access to existing systems, relevant documents, or the right people to talk to. You won't be handed a form to fill in before we've even spoken.",
            },
            {
                id: 'process-3',
                question: 'How long does a project take?',
                answer: "Every project is different. A focused website or brand project may take considerably less time than a bespoke software or transformation project. We'll give you a realistic timeline once we understand the scope.",
            },
            {
                id: 'process-4',
                question: 'Can we start small and expand later?',
                answer: "Absolutely. In fact, for some projects that's the better approach. We can start with the most important problem, learn from it, and build from there.",
            },
            {
                id: 'process-5',
                question: 'What happens after the project launches?',
                answer: "Launch isn't necessarily the end. Where it makes sense, we can continue supporting, improving, developing or extending what we've built.",
            },
        ],
    },
    {
        id: 'technical',
        label: 'Technical',
        icon: Cpu,
        items: [
            {
                id: 'technical-1',
                question: 'Can you work with technology we already use?',
                answer: "Yes. We can work around existing platforms, systems and tools where they make sense. We don't recommend replacing something simply because we didn't build it.",
            },
            {
                id: 'technical-2',
                question: 'Can you integrate different systems?',
                answer: 'Yes. Where systems need to share information or work together, we can explore integrations and connected workflows to reduce duplication and unnecessary manual work.',
            },
            {
                id: 'technical-3',
                question: 'Can you build custom software or internal tools?',
                answer: "Yes. Where an off-the-shelf solution doesn't fit the way your business operates, we can design and build bespoke software, dashboards, portals, internal tools and digital products.",
            },
            {
                id: 'technical-4',
                question: 'Can you improve an existing website rather than build a new one?',
                answer: 'Yes. Sometimes a rebuild is unnecessary. We can audit an existing website and identify opportunities around performance, UX, conversion, SEO, content and functionality.',
            },
            {
                id: 'technical-5',
                question: 'Will I be able to update the website myself?',
                answer: "Absolutely. We build websites with content management systems that let you update text, images and content yourself, without needing to code. We'll also walk you through how to use it, so you're not stuck waiting on us for every small change.",
            },
        ],
    },
    {
        id: 'communication',
        label: 'Communication',
        icon: MessageSquare,
        items: [
            {
                id: 'communication-1',
                question: "How will I know what's happening with my project?",
                answer: "We'll agree how we'll work together at the start and keep communication clear throughout the project. You shouldn't have to chase us to find out what's happening.",
            },
            {
                id: 'communication-2',
                question: 'Can we work remotely?',
                answer: 'Yes. We can work remotely with businesses across the UK and beyond, using the communication and collaboration tools that suit the project.',
            },
            {
                id: 'communication-3',
                question: 'Do you sign NDAs or handle confidential information?',
                answer: "Protecting your data is central to how we work. GDPR compliance isn't an afterthought; it's built into every project, whether or not an NDA is in place. On top of that, we're happy to sign an NDA before any detailed conversation if you'd like the extra formality. Just let us know early and we'll get it sorted.",
            },
            {
                id: 'communication-4',
                question: "What if I don't understand the technical side?",
                answer: "That's fine. You shouldn't need to be technical to work with us. We'll explain what matters in clear language and focus conversations on decisions, outcomes and what the work means for your business.",
            },
            {
                id: 'communication-5',
                question: "What if Viredá isn't the right fit for us?",
                answer: "We'll tell you. The first conversation is about understanding the problem and seeing whether we can genuinely help, not trying to force a project where one doesn't make sense.",
            },
        ],
    },
];

export function FaqTabbedExplorer() {
    const [activeCategory, setActiveCategory] = useState(FAQ_DATA[0].id);
    const category = FAQ_DATA.find((item) => item.id === activeCategory) || FAQ_DATA[0];

    return (
        <section className="faq-section section" id="faqs">
            <div className="container">
                <header className="faq-section-heading">
                    <p className="eyebrow">FAQs</p>
                    <h2>Frequently Asked <span>Questions</span></h2>
                </header>

                <div className="faq-explorer">
                    <aside className="faq-categories" aria-label="FAQ categories">
                        <nav role="tablist">
                            {FAQ_DATA.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.id === activeCategory;

                                return (
                                    <button
                                        aria-controls={`faq-panel-${item.id}`}
                                        aria-selected={isActive}
                                        className={isActive ? 'is-active' : ''}
                                        id={`faq-tab-${item.id}`}
                                        key={item.id}
                                        onClick={() => setActiveCategory(item.id)}
                                        role="tab"
                                        type="button"
                                    >
                                        <Icon aria-hidden="true" size={18} strokeWidth={1.7} />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    <div
                        aria-labelledby={`faq-tab-${category.id}`}
                        className="faq-panel"
                        id={`faq-panel-${category.id}`}
                        role="tabpanel"
                    >
                        <AccordionPrimitive.Root
                            className="faq-accordion"
                            defaultValue={category.items[0]?.id}
                            key={category.id}
                            type="single"
                            collapsible
                        >
                            {category.items.map((item) => (
                                <AccordionPrimitive.Item className="faq-item" key={item.id} value={item.id}>
                                    <AccordionPrimitive.Header className="faq-item-header">
                                        <AccordionPrimitive.Trigger className="faq-trigger">
                                            <span>{item.question}</span>
                                            <span className="faq-trigger-icon" aria-hidden="true">
                                                <ChevronDown size={17} strokeWidth={1.8} />
                                            </span>
                                        </AccordionPrimitive.Trigger>
                                    </AccordionPrimitive.Header>
                                    <AccordionPrimitive.Content className="faq-content">
                                        <div><p>{item.answer}</p></div>
                                    </AccordionPrimitive.Content>
                                </AccordionPrimitive.Item>
                            ))}
                        </AccordionPrimitive.Root>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FaqTabbedExplorer;
