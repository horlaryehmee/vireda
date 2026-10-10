import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Pause, Play, X } from 'lucide-react';
import '../../../css/team.css';

const members = [
    {
        name: 'David Babatope', role: 'Founder & CEO', image: '/images/vireda-ceo.webp',
        headline: 'Building better ways forward.',
        bio: [
            'David has spent several years working in management consulting across a range of industries, helping businesses fix their operations, understand their markets and work through strategic decisions. Alongside that, his technical background covers data analysis, data engineering and business intelligence.',
            'That combination gives him a close-up view of how a business actually runs, not just how it says it runs, and the technical ability to build what fixes it.',
        ],
    },
    {
        name: 'Olatunde', role: 'Strategy & Insight Lead', image: '/images/team/olatunde.webp',
        headline: 'Where research meets commercial strategy.',
        bio: [
            'Olatunde works where research meets commercial strategy. He leads business development, partnerships and sales strategy, grounding every decision in a clear view of the market.',
            'His expertise spans market and customer research, competitor intelligence and trend analysis. He turns that research into practical insight that helps organisations spot opportunities early. His business development and sales background means the insight is always tied to what will actually win business.',
        ],
    },
    {
        name: 'Mike', role: 'Senior AI Engineer', image: '/images/team/mike.webp',
        headline: 'Turning messy problems into simple, useful solutions.',
        bio: [
            'Mike builds production ready LLM systems, intelligent agents and automations, from voice AI to multi-agent applications and RAG pipelines.',
            'His path runs through data analytics, data science and machine learning, and he has worked with everything from millions of rows of banking data to custom-trained models. He turns messy problems into simple, useful solutions, always asking one question: can this solve the problem better?',
        ],
    },
    {
        name: 'John Patrick', role: 'Swift Developer', image: '/images/team/john-patrick.webp',
        headline: 'Polished apps that are built to last.',
        bio: [
            'John is a Swift developer with more than a decade of experience. He writes code that is clear, concise and easy to maintain.',
            'His own app was featured as the number one new app in the UK App Store in two categories, and he is the maker of pushtri and several open source projects. He turns complex product ideas into polished apps that are built to last.',
        ],
    },
    {
        name: 'Bakare Olayemi', role: 'Full Stack Developer', image: '/images/team/bakare-olayemi.webp',
        headline: 'He builds things that solve real problems.',
        bio: [
            'Olayemi works across the frontend and backend of web applications, turning ideas into working products. He enjoys figuring out how things should work, tackling technical challenges, and finding practical solutions when the obvious approach isn\'t always the best one.',
            'People call him a full stack developer, but he prefers to think of himself as a problem solver. For him, the interesting part of development is understanding the problem behind the code and building something that solves it properly.',
            'He believes good software should do more than work. It should make sense to the people using it and make the task it was built for easier.',
        ],
    },
];

function TeamDetails({ member, onClose }) {
    const dialogRef = useRef(null);
    useEffect(() => {
        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const closeButton = dialogRef.current.querySelector('button');
        closeButton.focus();
        const handleKey = (event) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'Tab') { event.preventDefault(); closeButton.focus(); }
        };
        window.addEventListener('keydown', handleKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKey);
            previousFocus?.focus();
        };
    }, [onClose]);

    return createPortal(
        <div className="client-result-modal" role="dialog" aria-modal="true" aria-labelledby="team-member-title" onMouseDown={onClose}>
            <article className="client-result-modal-panel team-details-panel" ref={dialogRef} onMouseDown={(event) => event.stopPropagation()}>
                <button className="client-result-modal-close" type="button" aria-label="Close team member details" onClick={onClose}><X size={20} /></button>
                <figure className="client-result-modal-media team-details-photo"><img src={member.image} alt={member.name} /></figure>
                <div className="client-result-modal-content team-details-content">
                    <header className="client-result-modal-header"><span>{member.role}</span><h3 id="team-member-title">{member.name}</h3><p>{member.headline}</p></header>
                    {member.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
            </article>
        </div>, document.body,
    );
}

export default function TeamCarousel() {
    const [selectedMember, setSelectedMember] = useState(null);
    const [paused, setPaused] = useState(false);
    const marqueeRef = useRef(null);
    const interactionUntil = useRef(0);
    const closeDetails = React.useCallback(() => setSelectedMember(null), []);
    useEffect(() => {
        const viewport = marqueeRef.current;
        const mobile = window.matchMedia('(max-width: 767px)');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frame;
        let lastTime;
        let position = viewport.scrollLeft;
        const tick = (time) => {
            const elapsed = lastTime === undefined ? 0 : Math.min(time - lastTime, 50);
            lastTime = time;
            const interacting = time < interactionUntil.current || viewport.matches(':hover, :focus-within, :active');
            if (mobile.matches && !reducedMotion.matches && !paused && !selectedMember && !interacting) {
                const loopWidth = viewport.querySelector('.team-mobile-marquee-group').offsetWidth;
                position += elapsed * 0.025;
                if (loopWidth && position >= loopWidth) position -= loopWidth;
                viewport.scrollLeft = position;
            } else {
                position = viewport.scrollLeft;
            }
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [paused, selectedMember]);
    const renderMember = (member, duplicate = false) => (
        <article className="team-image-accordion-card" key={member.name}>
            <button className="team-image-accordion-overlay" type="button" tabIndex={duplicate ? -1 : 0} aria-haspopup="dialog" aria-label={`About ${member.name}, ${member.role}`} onClick={() => setSelectedMember(member)}>
                <span className="team-image-accordion-arrow" aria-hidden="true"><ArrowUpRight size={22} strokeWidth={1.8} /></span>
                <h3>{member.name}</h3><span>{member.role}</span>
            </button>
            <img src={member.image} alt={duplicate ? '' : member.name} loading="lazy" />
        </article>
    );
    return (
        <section className="team-reference-section" id="team" aria-label="The people behind Viredá">
            <div className="container about-founder-header">
                <p className="eyebrow">The People Behind It</p>
                <h2>A small team <span>by design.</span></h2>
                <p>Big enough to bring real depth across strategy, technology, data and creative, small enough that nothing gets lost between departments or handed off along the way.</p>
            </div>
            <div className={`team-image-accordion ${paused || selectedMember ? 'is-paused' : ''}`} role="group" aria-label="Meet the team" ref={marqueeRef} onTouchStart={() => { interactionUntil.current = Infinity; }} onTouchEnd={() => { interactionUntil.current = performance.now() + 2500; }} onTouchCancel={() => { interactionUntil.current = performance.now() + 2500; }} onWheel={() => { interactionUntil.current = performance.now() + 2500; }}>
                <div className="team-mobile-marquee-track">
                    <div className="team-mobile-marquee-group">{members.map((member) => renderMember(member))}</div>
                    <div className="team-mobile-marquee-group team-mobile-marquee-copy" aria-hidden="true">{members.map((member) => renderMember(member, true))}</div>
                </div>
            </div>
            <div className="team-mobile-controls">
                <button type="button" aria-label={paused ? 'Play team marquee' : 'Pause team marquee'} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? <Play size={18} /> : <Pause size={18} />}</button>
            </div>
            {selectedMember && <TeamDetails member={selectedMember} onClose={closeDetails} />}
        </section>
    );
}

