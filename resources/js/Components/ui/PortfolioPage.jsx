import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ContactCollageHero } from './ContactCollageHero';

const filters = ['All', 'Websites', 'Products & Apps', 'Brand & Creative', 'Platforms & Data'];

const portfolioTestimonial = {
    quote: "They took the time to actually understand the business before proposing anything — that's rarer than it should be.",
    name: 'Ronke Adeyemi',
    role: 'Operations Director, Fieldstone Group',
};

function ProjectCard({ project, index }) {
    return (
        <article className="portfolio-card" tabIndex={0} aria-label={project.name}>
            <div className={`portfolio-card-media ${project.scrollOnHover ? 'is-vertical' : ''}`}>
                <img src={project.image} alt={`${project.name} — ${project.industry}`} loading={index < 4 ? 'eager' : 'lazy'} />
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

    useEffect(() => {
        const previousTitle = document.title;
        document.title = 'Portfolio | Viredá';
        window.scrollTo(0, 0);

        return () => {
            document.title = previousTitle;
        };
    }, []);

    const visibleProjects = useMemo(() => (
        activeFilter === 'All'
            ? projects
            : projects.filter((project) => project.category === activeFilter)
    ), [activeFilter, projects]);

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

        return <ProjectCard project={item.project} index={item.index} key={`${item.project.name}-${item.project.image}`} />;
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
        </>
    );
}

export default PortfolioPage;
