import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GetStartedButton } from './GetStartedButton';
import { ParticlesBackground } from './ParticlesBackground';

const containerVariants = {
    hidden: {},
    visible: { transition: { delayChildren: 0.08, staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { filter: 'blur(6px)', opacity: 0, y: 14 },
    visible: { filter: 'blur(0px)', opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }, y: 0 },
};

const mediaVariants = {
    hidden: { filter: 'blur(8px)', opacity: 0, y: 26 },
    visible: { filter: 'blur(0px)', opacity: 1, transition: { delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }, y: 0 },
};

export function ContactCollageHero({
    eyebrow = 'Contact Viredá',
    title = <>Got something in mind?<br /><span>Let's talk.</span></>,
    description = "Whether you have a clear brief, a problem you're trying to solve, or an idea you're not sure how to bring to life, start with a useful conversation about what's possible.",
    primaryHref = '/book',
    primaryLabel = 'Book a conversation',
    secondaryHref = '/book',
    secondaryLabel = 'Book a discovery call',
    images = {
        background: { src: '/images/contact-hero-office.png', alt: '' },
        primary: {
            src: '/images/contact-discovery-conversation-v2.png',
            alt: 'A consultant and prospective clients having an open discovery conversation',
        },
        secondary: {
            src: '/images/contact-project-notes-v2.png',
            alt: 'Collaborators turning an initial conversation into a clear project plan',
        },
    },
} = {}) {
    const reduceMotion = useReducedMotion();
    const animationProps = reduceMotion ? {} : { animate: 'visible', initial: 'hidden' };

    return (
        <section className="contact-collage-hero" id="top" data-nav-theme="dark">
            <ParticlesBackground />
            <div className="contact-collage-wash" aria-hidden="true">
                <img src={images.background.src} alt={images.background.alt ?? ''} />
            </div>

            <motion.div className="container contact-collage-grid" variants={containerVariants} {...animationProps}>
                <motion.div className="contact-collage-copy" variants={itemVariants}>
                    <p className="eyebrow">{eyebrow}</p>
                    <h1>{title}</h1>
                    <p className="contact-collage-description">
                        {description}
                    </p>
                    <div className="contact-collage-actions">
                        <GetStartedButton href={primaryHref}>{primaryLabel}</GetStartedButton>
                        <a className="contact-collage-secondary" href={secondaryHref}>{secondaryLabel}</a>
                    </div>
                </motion.div>

                <motion.div className="contact-art-collage" variants={mediaVariants}>
                    <figure className="contact-art-primary">
                        <img src={images.primary.src} alt={images.primary.alt} decoding="async" />
                    </figure>
                    <figure className="contact-art-secondary">
                        <img src={images.secondary.src} alt={images.secondary.alt} decoding="async" />
                    </figure>
                </motion.div>
            </motion.div>
        </section>
    );
}

export default ContactCollageHero;
