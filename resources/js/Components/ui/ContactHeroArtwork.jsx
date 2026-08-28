import React, { useId } from 'react';

export function ContactHeroArtwork() {
    const maskId = useId().replace(/:/g, '');

    return (
        <figure className="contact-hero-artwork" aria-hidden="true">
            <svg className="contact-hero-artwork-desktop" viewBox="0 0 1600 780" role="presentation" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="780">
                        <rect width="1600" height="780" rx="28" fill="white" />

                        {/* The image wraps around the actual site header controls. */}
                        <rect x="0" y="0" width="246" height="92" rx="0" fill="black" />
                        <rect x="548" y="0" width="504" height="92" rx="0" fill="black" />
                        <rect x="1162" y="0" width="438" height="92" rx="0" fill="black" />

                        <rect x="0" y="724" width="176" height="56" fill="black" />
                        <rect x="1262" y="694" width="338" height="86" fill="black" />
                    </mask>
                    <linearGradient id={`${maskId}-shade`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#030302" stopOpacity="0.12" />
                        <stop offset="0.56" stopColor="#030302" stopOpacity="0" />
                        <stop offset="1" stopColor="#030302" stopOpacity="0.3" />
                    </linearGradient>
                </defs>

                <g mask={`url(#${maskId})`}>
                    <image
                        href="/images/vireda-office-building.png"
                        width="1600"
                        height="780"
                        preserveAspectRatio="xMidYMid slice"
                    />
                    <rect width="1600" height="780" fill={`url(#${maskId}-shade)`} />
                </g>
            </svg>

            <svg className="contact-hero-artwork-mobile" viewBox="0 0 900 760" role="presentation" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <mask id={`${maskId}-mobile`} maskUnits="userSpaceOnUse" x="0" y="0" width="900" height="760">
                        <rect width="900" height="760" rx="22" fill="white" />
                        <rect x="0" y="0" width="244" height="96" fill="black" />
                        <rect x="646" y="0" width="254" height="96" fill="black" />
                        <rect x="0" y="710" width="120" height="50" fill="black" />
                        <rect x="718" y="682" width="182" height="78" fill="black" />
                    </mask>
                    <linearGradient id={`${maskId}-mobile-shade`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#030302" stopOpacity="0.1" />
                        <stop offset="1" stopColor="#030302" stopOpacity="0.3" />
                    </linearGradient>
                </defs>
                <g mask={`url(#${maskId}-mobile)`}>
                    <image href="/images/vireda-office-building.png" width="900" height="760" preserveAspectRatio="xMidYMid slice" />
                    <rect width="900" height="760" fill={`url(#${maskId}-mobile-shade)`} />
                </g>
            </svg>
        </figure>
    );
}
