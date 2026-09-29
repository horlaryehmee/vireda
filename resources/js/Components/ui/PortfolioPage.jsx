import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import caseStudies from './portfolioCaseStudies.json';
import { ContactCollageHero } from './ContactCollageHero';

const filters = ['All', 'Websites', 'Products & Apps', 'Brand & Creative', 'Platforms & Data'];

const portfolioTestimonial = {
    quote: "They took the time to actually understand the business before proposing anything — that's rarer than it should be.",
    name: 'Ronke Adeyemi',
    role: 'Operations Director, Fieldstone Group',
};

const caseStudyKeys = {
    'altura.png': 'altura', 'kalm.png': 'kalm',
    'luxe-beauty.png': 'luxe', 'luxe-mobile.png': 'luxe',
    'peakfuel.png': 'peakfuel', 'peakfuel-mobile.png': 'peakfuel',
    'westbrook.png': 'westbrook', 'westbrook-2.png': 'westbrook',
    'north-studio.png': 'north-web', 'north-studio-2.png': 'north-brand',
    'pivot-up.png': 'pivot-web', 'pivot-up-2.png': 'pivot-app',
    'carebridge.png': 'carebridge', 'carebridge-2.png': 'carebridge',
    'flowt.png': 'flowt', 'flowt-2.png': 'flowt',
    'the-collective.png': 'collective-brand', 'the-collective-2.png': 'collective-app',
};

const getCaseStudyKey = (project) => caseStudyKeys[project.image.split('/').pop()];
const relatedStudies = {
    'north-web': 'north-brand', 'north-brand': 'north-web',
    'pivot-web': 'pivot-app', 'pivot-app': 'pivot-web',
    'collective-brand': 'collective-app', 'collective-app': 'collective-brand',
};

function ProjectGallery({ project, eager = false }) {
    const trackRef = useRef(null);
    const gesture = useRef(null);
    const suppressClickUntil = useRef(0);
    const [active, setActive] = useState(0);
    const images = project.images || [project.image, project.mobileImage].filter(Boolean);
    const showImage = (index) => {
        const next = (index + images.length) % images.length;
        trackRef.current.scrollTo({ left: next * trackRef.current.clientWidth, behavior: 'smooth' });
    };
    return (
        <div className="portfolio-image-gallery" onClickCapture={(event) => {
            if (performance.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation(); }
        }} onTouchStart={(event) => { gesture.current = event.touches[0].clientX; }} onTouchMove={(event) => {
            if (gesture.current !== null && Math.abs(event.touches[0].clientX - gesture.current) > 10) suppressClickUntil.current = performance.now() + 500;
        }}>
            <div className="portfolio-image-track" ref={trackRef} onScroll={() => setActive(Math.round(trackRef.current.scrollLeft / trackRef.current.clientWidth))}>
                {images.map((src, index) => <img key={src} src={src} alt={`${project.name} ? project image ${index + 1}`} loading={eager && index === 0 ? 'eager' : 'lazy'} draggable="false" />)}
            </div>
            {images.length > 1 && <div className="portfolio-image-controls" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                <button type="button" aria-label={`Previous image for ${project.name}`} onClick={() => showImage(active - 1)}><ChevronLeft size={18} /></button>
                <span>{active + 1} / {images.length}</span>
                <button type="button" aria-label={`Next image for ${project.name}`} onClick={() => showImage(active + 1)}><ChevronRight size={18} /></button>
            </div>}
        </div>
    );
}

function ProjectDetails({ project, onClose, onNext }) {
    const panelRef = useRef(null);
    const study = caseStudies[getCaseStudyKey(project)];

    useEffect(() => {
        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        panelRef.current.querySelector('button').focus();
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
            if (event.key !== 'Tab') return;
            const buttons = panelRef.current.querySelectorAll('button, a[href]');
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault(); last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault(); first.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
            previousFocus?.focus();
        };
    }, [onClose]);

    return createPortal(
        <div className="client-result-modal" role="dialog" aria-modal="true" aria-labelledby="portfolio-project-title" onMouseDown={onClose}>
            <article className="client-result-modal-panel" ref={panelRef} onMouseDown={(event) => event.stopPropagation()}>
                <button className="client-result-modal-close" type="button" aria-label="Close project details" onClick={onClose}><X size={20} strokeWidth={1.8} /></button>
                <figure className="client-result-modal-media portfolio-modal-gallery">
                    <ProjectGallery project={project} eager />
                    <figcaption><span>{project.category}</span><strong>{study.name}</strong></figcaption>
                </figure>
                <div className="client-result-modal-content">
                    <header className="client-result-modal-header">
                        <span>{study.tag}</span>
                        <h3 id="portfolio-project-title">{study.name}</h3>
                        <p>{study.headline}</p>
                    </header>
                    <div className="client-result-modal-outcome">
                        <span className="client-result-label">Result</span>
                        <strong>{study.resultLead}</strong><p>{study.result}</p>
                    </div>
                    <div className="client-result-modal-grid">
                        <div className="client-result-section"><span className="client-result-label">The problem</span><p>{study.problem}</p></div>
                        <div className="client-result-section"><span className="client-result-label">What we did</span>
                            <ul className="client-result-changes">{study.changes.map((change) => <li key={change}>{change}</li>)}</ul>
                        </div>
                    </div>
                    <div><span className="client-result-label">{study.ideaLabel}</span><blockquote>{study.idea}</blockquote></div>
                    <button type="button" className="portfolio-project-next" onClick={onNext}>{study.linkLabel} <ArrowUpRight size={18} /></button>
                </div>
            </article>
        </div>, document.body,
    );
}

function ProjectCard({ project, index, onOpen }) {
    return (
        <article className="portfolio-card" tabIndex={0} role="button" aria-haspopup="dialog" aria-label={`View ${project.name}: ${project.industry}`} onClick={() => onOpen(project)} onKeyDown={(event) => {
            if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onOpen(project); }
        }}>
            <div className={`portfolio-card-media ${project.scrollOnHover ? 'is-vertical' : ''}`}>
                <ProjectGallery project={project} eager={index < 4} />
                <div className="portfolio-card-tags" aria-hidden="true">
                    {project.services.map((service) => <span key={service}>{service}</span>)}
                </div>
                <span className="portfolio-card-open" aria-hidden="true"><ArrowUpRight size={21} /></span>
            </div>
            <div className="portfolio-card-caption">
                <p>{project.name}</p>
                <h3>{project.description}</h3>
            </div>
        </article>
    );
}

function PortfolioTestimonial() {
    return (
        <aside className="portfolio-testimonial">
            <span className="portfolio-quote-mark" aria-hidden="true">“</span>
            <blockquote>{portfolioTestimonial.quote}</blockquote>
            <div className="portfolio-testimonial-author">
                <span aria-hidden="true">{portfolioTestimonial.name.charAt(0)}</span>
                <p><strong>{portfolioTestimonial.name}</strong><small>{portfolioTestimonial.role}</small></p>
            </div>
        </aside>
    );
}

function PortfolioMidCta() {
    return (
        <aside className="portfolio-mid-cta">
            <h2>You&apos;re still here?</h2>
            <p>You must really like us...</p>
            <a href="/contact">Start a Conversation <ArrowUpRight size={17} /></a>
        </aside>
    );
}

function PortfolioAddProject() {
    return (
        <a className="portfolio-add-project" href="/contact">
            <span aria-hidden="true">+</span>
            <strong>Add your project — Start a Conversation</strong>
        </a>
    );
}

function PortfolioPage({ Navbar, Footer, FinalCTA, projects = [] }) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);
    const closeProject = React.useCallback(() => setSelectedProject(null), []);
    const openNextProject = () => {
        const keys = Object.keys(caseStudies);
        const currentKey = getCaseStudyKey(selectedProject);
        const nextKey = relatedStudies[currentKey] || keys[(keys.indexOf(currentKey) + 1) % keys.length];
        setSelectedProject(groupedProjects.find((project) => getCaseStudyKey(project) === nextKey));
    };

    useEffect(() => {
        const previousTitle = document.title;
        document.title = 'Portfolio | Viredá';
        window.scrollTo(0, 0);

        return () => {
            document.title = previousTitle;
        };
    }, []);

    const groupedProjects = useMemo(() => {
        const groups = new Map();
        projects.forEach((project) => {
            const key = getCaseStudyKey(project) || project.name;
            const images = [project.image, project.mobileImage].filter(Boolean);
            if (groups.has(key)) {
                const group = groups.get(key);
                group.images = [...new Set([...group.images, ...images])];
                group.categories = [...new Set([...group.categories, project.category])];
            } else {
                groups.set(key, { ...project, images, categories: [project.category] });
            }
        });
        return [...groups.values()];
    }, [projects]);
    const visibleProjects = useMemo(() => (
        activeFilter === 'All' ? groupedProjects : groupedProjects.filter((project) => project.categories.includes(activeFilter))
    ), [activeFilter, groupedProjects]);

    const portfolioSequence = useMemo(() => {
        const sequence = visibleProjects.map((project, index) => ({ type: 'project', project, index }));

        sequence.splice(Math.min(1, sequence.length), 0, { type: 'testimonial' });

        if (activeFilter === 'All' && sequence.length > 4) {
            sequence.splice(Math.ceil(sequence.length / 2), 0, { type: 'mid-cta' });
        }

        sequence.push({ type: 'add-project' });

        return sequence;
    }, [activeFilter, visibleProjects]);

    const portfolioColumns = useMemo(() => ([
        portfolioSequence.filter((_, index) => index % 2 === 0),
        portfolioSequence.filter((_, index) => index % 2 === 1),
    ]), [portfolioSequence]);

    const renderPortfolioItem = (item) => {
        if (item.type === 'testimonial') return <PortfolioTestimonial key="testimonial" />;
        if (item.type === 'mid-cta') return <PortfolioMidCta key="mid-cta" />;
        if (item.type === 'add-project') return <PortfolioAddProject key="add-project" />;

        return <ProjectCard project={item.project} index={item.index} onOpen={setSelectedProject} key={`${item.project.name}-${item.project.image}`} />;
    };

    return (
        <>
            <Navbar />
            <main className="portfolio-page">
                <ContactCollageHero
                    eyebrow="Selected work"
                    title={<>Ideas we've helped<br /><span>take shape.</span></>}
                    description="A selection of what we build, across strategy, software, AI, data, brand and the web."
                    primaryHref="/contact"
                    primaryLabel="Start a conversation"
                    secondaryLabel={null}
                    images={{
                        background: { src: '/images/work/altura.png', alt: '' },
                        primary: {
                            src: '/images/work/flowt-2.png',
                            alt: 'Flowt operations dashboard project screenshot',
                        },
                        secondary: {
                            src: '/images/work/westbrook.png',
                            alt: 'Westbrook Property website project screenshot',
                        },
                    }}
                />

                <section className="portfolio-index" id="portfolio-grid" aria-label="Selected projects">
                    <div className="container">
                        <div className="portfolio-filter-row" role="group" aria-label="Filter portfolio projects">
                            {filters.map((filter) => {
                                return (
                                    <button
                                        className={activeFilter === filter ? 'is-active' : ''}
                                        type="button"
                                        aria-pressed={activeFilter === filter}
                                        onClick={() => setActiveFilter(filter)}
                                        key={filter}
                                    >
                                        {filter}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="portfolio-grid" aria-live="polite">
                            {portfolioColumns.map((column, columnIndex) => (
                                <div className="portfolio-grid-column" key={columnIndex}>
                                    {column.map(renderPortfolioItem)}
                                </div>
                            ))}
                        </div>
                        <div className="portfolio-grid-mobile" aria-live="polite">
                            {portfolioSequence.map(renderPortfolioItem)}
                        </div>
                    </div>
                </section>

                <FinalCTA />
            </main>
            <Footer />
            {selectedProject && <ProjectDetails key={getCaseStudyKey(selectedProject)} project={selectedProject} onClose={closeProject} onNext={openNextProject} />}
        </>
    );
}

export default PortfolioPage;
