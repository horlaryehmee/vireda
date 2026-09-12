import React, { useLayoutEffect, useRef, useState } from 'react';
import { Quote } from 'lucide-react';
import { InfiniteMovingCards } from './InfiniteMovingCards';

const TESTIMONIALS = [
    {
        id: 1,
        quote: "The best part was probably how easy they made the whole thing. I'm not particularly technical, so I appreciated being able to explain what we needed without having to understand how everything worked behind the scenes.",
        name: 'Grace Mensah',
        role: 'Founder, The Collective',
    },
    {
        id: 2,
        quote: "I wasn't looking for a complete rebrand. We just needed to look more established. They understood that straight away.",
        name: 'Farah Ahmed',
        role: 'Director, Bloom & Co.',
    },
    {
        id: 3,
        quote: "The dashboard has been the biggest change for us. I can finally see what's going on without asking someone to pull a report together every time.",
        name: 'Rebecca Morgan',
        role: 'Operations Director, Hartwell Services',
    },
    {
        id: 4,
        quote: "The old website was doing the job, but it wasn't really helping us win work. The new one feels much more like the business we are now.",
        name: 'Nadia Khan',
        role: 'Founder, Studio North',
    },
    {
        id: 5,
        quote: "They challenged a few of our assumptions, which I actually appreciated. We ended up with a much better solution than the one we'd originally asked for.",
        name: 'Tom Edwards',
        role: 'Founder, Field & Form',
    },
    {
        id: 6,
        quote: "What started as a website conversation ended up improving parts of the business we hadn't even considered. That was the most valuable part.",
        name: 'Nathan Williams',
        role: 'Founder, Westbrook Property',
    },
    {
        id: 7,
        quote: "What we have now is much easier for our staff to use. That sounds simple, but it's made a genuine difference to how the team works every day.",
        name: 'Linda Mensah',
        role: 'Operations Manager, CareBridge',
    },
    {
        id: 8,
        quote: 'Really happy with the website Viredá built for me. They understood what I wanted, and were great to work with.',
        name: 'Shaun Barker',
    },
    {
        id: 9,
        quote: "We'd heard a lot about AI, especially with ChatGPT and all the videos online, but we never realised it could actually help our business. VIREDÁ showed us how we could use it to cut down repetitive work and even answer customers out of hours.",
        name: 'Amara Collins',
        role: 'Founder, Naya Collective',
    },
    {
        id: 10,
        quote: 'Really happy with the CRM. Everything feels so much more organised now.',
        name: 'James Adeyemi',
        role: 'Oak & Stone',
    },
];

function TestimonialCard({ testimonial, duplicate = false }) {
    const [expanded, setExpanded] = useState(false);
    const [canExpand, setCanExpand] = useState(false);
    const quoteRef = useRef(null);

    useLayoutEffect(() => {
        if (expanded || !quoteRef.current) return undefined;

        const quote = quoteRef.current;
        const measure = () => setCanExpand(quote.scrollHeight > quote.clientHeight + 1);
        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(quote);

        return () => observer.disconnect();
    }, [expanded, testimonial.quote]);

    return (
        <article className="testimonial-card">
            <Quote className="testimonial-quote-icon" size={28} strokeWidth={1.35} aria-hidden="true" />
            <blockquote className={!expanded ? 'is-collapsed' : ''} ref={quoteRef}>“{testimonial.quote}”</blockquote>
            {canExpand && (
                <button
                    aria-expanded={expanded}
                    className="testimonial-read-more"
                    onClick={() => setExpanded((current) => !current)}
                    tabIndex={duplicate ? -1 : undefined}
                    type="button"
                >
                    {expanded ? 'Show less' : 'Read more'}
                </button>
            )}
            <footer>
                <span className="testimonial-avatar" aria-hidden="true">
                    <span>{testimonial.name.charAt(0)}</span>
                </span>
                <span className="testimonial-person">
                    <strong>{testimonial.name}</strong>
                    {testimonial.role && <span>{testimonial.role}</span>}
                </span>
            </footer>
        </article>
    );
}

export function TestimonialsSection() {
    return (
        <section className="testimonials-section section" aria-labelledby="testimonials-title">
            <div className="container testimonials-heading">
                <p className="eyebrow">Testimonials</p>
                <h2 id="testimonials-title">What Clients Are <span>Saying</span></h2>
            </div>
            <InfiniteMovingCards
                items={TESTIMONIALS}
                gap={16}
                speed="slow"
                renderItem={(testimonial, index) => (
                    <TestimonialCard
                        duplicate={index >= TESTIMONIALS.length}
                        testimonial={testimonial}
                    />
                )}
            />
        </section>
    );
}

export default TestimonialsSection;
