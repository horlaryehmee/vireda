import React, { useId } from 'react';
import { ArrowRight } from 'lucide-react';

export function GridFeatureCard({ icon: Icon, title, description, href, linkLabel }) {
    const patternId = useId();

    return (
        <article className="grid-feature-card">
            <div className="grid-feature-pattern" aria-hidden="true">
                <svg width="100%" height="100%">
                    <defs>
                        <pattern id={patternId} width="22" height="22" patternUnits="userSpaceOnUse" x="-12" y="4">
                            <path d="M.5 22V.5H22" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#${patternId})`} />
                    <rect x="176" y="26" width="23" height="23" />
                    <rect x="220" y="70" width="23" height="23" />
                    <rect x="264" y="48" width="23" height="23" />
                    <rect x="308" y="114" width="23" height="23" />
                </svg>
            </div>
            <Icon className="grid-feature-icon" size={28} strokeWidth={1.25} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{description}</p>
            <a href={href}>{linkLabel} <ArrowRight size={16} /></a>
        </article>
    );
}

export default GridFeatureCard;
