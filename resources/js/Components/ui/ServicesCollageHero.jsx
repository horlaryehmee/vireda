import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ParticlesBackground } from './ParticlesBackground';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.16 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.84 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.58, ease: 'easeOut' },
    },
};

export function ServicesCollageHero({ eyebrow = 'Services', title, subtitle, images = [], visual }) {
    const reduceMotion = useReducedMotion() === true;
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    const initial = reduceMotion ? false : 'hidden';

    useEffect(() => {
        const handleThemeChange = (event) => setIsDark(event.detail === 'dark');
        window.addEventListener('vireda-theme-change', handleThemeChange);
        return () => window.removeEventListener('vireda-theme-change', handleThemeChange);
    }, []);

    return (
        <section className="services-collage-hero" id="top" data-nav-theme={isDark ? 'dark' : 'light'}>
            <ParticlesBackground />
            <div className="container services-collage-grid">
                <motion.div
                    animate="visible"
                    className="services-collage-copy"
                    initial={initial}
                    variants={containerVariants}
                >
                    <motion.p className="eyebrow" variants={itemVariants}>{eyebrow}</motion.p>
                    <motion.h1 variants={itemVariants}>{title}</motion.h1>
                    <motion.p className="services-collage-subtitle" variants={itemVariants}>{subtitle}</motion.p>
                </motion.div>

                <motion.div
                    animate="visible"
                    className="services-collage-visual"
                    initial={initial}
                    variants={containerVariants}
                >
                    <motion.span
                        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                        className="services-collage-shape shape-one"
                        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
                    />
                    <motion.span
                        animate={reduceMotion ? undefined : { y: [0, 8, 0], rotate: [8, 12, 8] }}
                        className="services-collage-shape shape-two"
                        transition={{ duration: 3.8, ease: 'easeInOut', repeat: Infinity }}
                    />
                    <motion.span
                        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                        className="services-collage-shape shape-three"
                        transition={{ duration: 3.4, ease: 'easeInOut', repeat: Infinity }}
                    />

                    {visual || images.map((image, index) => (
                        <motion.figure
                            className={`services-collage-image image-${index + 1}`}
                            key={image.src}
                            variants={imageVariants}
                        >
                            <img src={image.src} alt={image.alt} />
                        </motion.figure>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default ServicesCollageHero;
