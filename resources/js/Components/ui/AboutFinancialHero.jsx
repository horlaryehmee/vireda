import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GetStartedButton } from './GetStartedButton';
import { ParticlesBackground } from './ParticlesBackground';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const cardsVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.24 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
};

export function AboutFinancialHero({ title, description, buttonText, buttonLink, imageUrl1, imageUrl2 }) {
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

    useEffect(() => {
        const handleThemeChange = (event) => setIsDark(event.detail === 'dark');
        window.addEventListener('vireda-theme-change', handleThemeChange);
        return () => window.removeEventListener('vireda-theme-change', handleThemeChange);
    }, []);

    return (
        <section className="about-financial-hero" id="top" data-nav-theme={isDark ? 'dark' : 'light'}>
            <ParticlesBackground />
            <div className="about-financial-fade" aria-hidden="true" />

            <motion.div
                className="container about-financial-inner"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="about-financial-copy">
                    <motion.p className="eyebrow" variants={itemVariants}>About Viredá</motion.p>
                    <motion.h1 variants={itemVariants}>{title}</motion.h1>
                    <motion.p className="about-financial-description" variants={itemVariants}>{description}</motion.p>
                    <motion.div variants={itemVariants}>
                        <GetStartedButton className="about-financial-theme-button" href={buttonLink}>
                            {buttonText}
                        </GetStartedButton>
                    </motion.div>
                </div>

                <motion.div className="about-financial-cards" variants={cardsVariants}>
                    <div className="about-financial-card is-back">
                        <motion.img
                            className="about-financial-card-image"
                            src={imageUrl2}
                            alt="Viredá computer workstation in a modern office"
                            variants={cardVariants}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                        />
                    </div>
                    <div className="about-financial-card is-front">
                        <motion.img
                            className="about-financial-card-image"
                            src={imageUrl1}
                            alt="Viredá team collaborating in a modern office"
                            variants={cardVariants}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
