import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ServicesCollageHero } from './ServicesCollageHero';

const filters = ['All', 'Websites', 'Products & Apps', 'Brand & Creative', 'Platforms & Data'];
const showPortfolioHero = false;

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

    const featuredProjects = projects.slice(0, 3);

    return (
        <>
            <Navbar />
            <main className="portfolio-page">
                {showPortfolioHero && <ServicesCollageHero
                    eyebrow="Portfolio"
                    title={<>Ideas made <span>real.</span></>}
                    subtitle="A collection of brands, products and digital experiences built to solve real problems—and create meaningful momentum."
                    images={featuredProjects.map((project) => ({
                        src: project.image,
                        alt: `${project.name} — ${project.industry}`,
                    }))}
                />}

                <section className="portfolio-index" id="portfolio-grid">
                    <div className="container">
                        <header className="portfolio-index-heading">
                            <div>
                                <p className="eyebrow">Selected work</p>
                                <h2>Some of what <em>we’ve built.</em></h2>
                            </div>
                            <p>A selection of our work across strategy, identity, websites, software and digital products.</p>
                        </header>

                        <div className="portfolio-filter-row" role="group" aria-label="Filter portfolio projects">
                            {filters.map((filter) => {
                                const count = filter === 'All'
                                    ? projects.length
                                    : projects.filter((project) => project.category === filter).length;

                                return (
                                    <button
                                        className={activeFilter === filter ? 'is-active' : ''}
                                        type="button"
                                        aria-pressed={activeFilter === filter}
                                        onClick={() => setActiveFilter(filter)}
                                        key={filter}
                                    >
                                        {filter} <span>{String(count).padStart(2, '0')}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="portfolio-grid" aria-live="polite">
                            {visibleProjects.map((project, index) => (
                                <article className="portfolio-card" tabIndex={0} aria-label={project.name} key={`${project.name}-${project.image}`}>
                                    <div className={`portfolio-card-media ${project.scrollOnHover ? 'is-vertical' : ''}`}>
                                        <img src={project.image} alt={`${project.name} — ${project.industry}`} loading={index < 4 ? 'eager' : 'lazy'} />
                                        <span className="portfolio-card-index">{String(index + 1).padStart(2, '0')}</span>
                                        <span className="portfolio-card-open" aria-hidden="true"><ArrowUpRight size={19} /></span>
                                    </div>
                                    <div className="portfolio-card-copy">
                                        <div className="portfolio-card-title-row">
                                            <div>
                                                <p>{project.industry}</p>
                                                <h3>{project.name}</h3>
                                            </div>
                                            <span>{project.category}</span>
                                        </div>
                                        <p className="portfolio-card-description">{project.description}</p>
                                        <ul aria-label={`Services delivered for ${project.name}`}>
                                            {project.services.map((service) => <li key={service}>{service}</li>)}
                                        </ul>
                                    </div>
                                </article>
                            ))}
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
