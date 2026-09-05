import { useCallback, useEffect } from 'react';

const PARTICLES_SCRIPT_ID = 'vireda-particles-script';
const PARTICLES_SCRIPT_URL = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';

export function ParticlesBackground() {
    const initParticles = useCallback((isDark) => {
        const root = document.getElementById('particles-js');
        if (!root || typeof window.particlesJS !== 'function') return;

        root.querySelector('canvas')?.remove();

        if (window.pJSDom?.length) {
            window.pJSDom.forEach((instance) => instance?.pJS?.fn?.vendors?.destroypJS?.());
            window.pJSDom = [];
        }

        const colors = isDark
            ? { particles: '#f2c95c', lines: '#d8a73a', accent: '#9a6b16' }
            : { particles: '#9a6b16', lines: '#b98522', accent: '#d8a73a' };

        window.particlesJS('particles-js', {
            particles: {
                number: { value: 140, density: { enable: true, value_area: 800 } },
                color: { value: colors.particles },
                shape: { type: 'circle', stroke: { width: 0.5, color: colors.accent } },
                opacity: { value: 0.7, random: true, anim: { enable: true, speed: 1, opacity_min: 0.3 } },
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 1 } },
                line_linked: { enable: true, distance: 160, color: colors.lines, opacity: 0.4, width: 1.2 },
                move: { enable: true, speed: 2, random: true, out_mode: 'bounce' },
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true,
                },
                modes: {
                    grab: { distance: 220, line_linked: { opacity: 0.8 } },
                    push: { particles_nb: 4 },
                    repulse: { distance: 180, duration: 0.4 },
                },
            },
            retina_detect: true,
        });
    }, []);

    useEffect(() => {
        const html = document.documentElement;
        const detectDark = () => html.classList.contains('dark') || html.dataset.theme === 'dark';
        const start = () => initParticles(detectDark());

        let script = document.getElementById(PARTICLES_SCRIPT_ID);
        if (typeof window.particlesJS === 'function') {
            start();
        } else if (script) {
            script.addEventListener('load', start, { once: true });
        } else {
            script = document.createElement('script');
            script.id = PARTICLES_SCRIPT_ID;
            script.src = PARTICLES_SCRIPT_URL;
            script.async = true;
            script.addEventListener('load', start, { once: true });
            document.body.appendChild(script);
        }

        const observer = new MutationObserver(start);
        observer.observe(html, { attributes: true, attributeFilter: ['class', 'data-theme'] });

        return () => {
            observer.disconnect();
            script?.removeEventListener('load', start);
            const root = document.getElementById('particles-js');
            root?.querySelector('canvas')?.remove();
        };
    }, [initParticles]);

    return <div id="particles-js" className="about-particles-background" aria-hidden="true" />;
}
