import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function ProjectShowcase({ projects, autoplay = false }) {
    const [active, setActive] = useState(0);
    const touchStart = useRef(null);
    const project = projects[active];

    const changeProject = (direction) => {
        setActive((current) => (current + direction + projects.length) % projects.length);
    };

    useEffect(() => {
        if (!autoplay) return undefined;
        const interval = window.setInterval(() => changeProject(1), 5000);
        return () => window.clearInterval(interval);
    }, [autoplay, projects.length]);

    return (
        <div
            className="project-showcase"
            tabIndex="0"
            onKeyDown={(event) => {
                if (event.key === 'ArrowRight') changeProject(1);
                if (event.key === 'ArrowLeft') changeProject(-1);
            }}
            onTouchStart={(event) => {
                touchStart.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
                if (touchStart.current === null) return;
                const delta = event.changedTouches[0].clientX - touchStart.current;
                if (Math.abs(delta) > 42) changeProject(delta < 0 ? 1 : -1);
                touchStart.current = null;
            }}
        >
            <div className="project-showcase-stage" aria-live="polite">
                {projects.map((item, index) => {
                    const distance = (index - active + projects.length) % projects.length;
                    const isActive = index === active;
                    return (
                        <div
                            className="project-showcase-image"
                            key={item.name}
                            style={{
                                opacity: isActive ? 1 : distance < 3 ? 0.46 - distance * 0.1 : 0,
                                transform: `translate(${isActive ? 0 : distance * 14}px, ${isActive ? 0 : distance * 10}px) rotate(${isActive ? 0 : distance * 2.2}deg) scale(${isActive ? 1 : 1 - distance * 0.045})`,
                                zIndex: projects.length - distance,
                            }}
                        >
                            <img src={item.image} alt={item.name} draggable="false" loading="lazy" decoding="async" />
                            <div className="project-image-label">
                                <span>Viredá / {String(index + 1).padStart(2, '0')}</span>
                                <span>{item.industry}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="project-showcase-copy">
                <div className="project-copy-panel" key={project.name}>
                    <p className="project-industry">{project.industry}</p>
                    <h3>{project.name}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="tags">
                        {project.services.map((service) => <span key={service}>{service}</span>)}
                    </div>
                </div>

                <div className="project-showcase-controls" aria-label="Project controls">
                    <button type="button" onClick={() => changeProject(-1)} aria-label="Previous project" title="Previous project">
                        <ArrowLeft size={18} />
                    </button>
                    <span>{String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
                    <div className="project-showcase-dots" aria-label="Choose project">
                        {projects.map((item, index) => (
                            <button
                                className={index === active ? 'active' : ''}
                                key={item.name}
                                type="button"
                                onClick={() => setActive(index)}
                                aria-label={`Show ${item.name}`}
                                aria-current={index === active ? 'true' : undefined}
                            />
                        ))}
                    </div>
                    <button type="button" onClick={() => changeProject(1)} aria-label="Next project" title="Next project">
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export { ProjectShowcase };
export default ProjectShowcase;
