import { useEffect, useRef } from 'react';

const PATH_COUNT = 72;

function bezierPoint(t, start, controlOne, controlTwo, end) {
    const remaining = 1 - t;

    return {
        x: (remaining ** 3 * start.x) + (3 * remaining ** 2 * t * controlOne.x) + (3 * remaining * t ** 2 * controlTwo.x) + (t ** 3 * end.x),
        y: (remaining ** 3 * start.y) + (3 * remaining ** 2 * t * controlOne.y) + (3 * remaining * t ** 2 * controlTwo.y) + (t ** 3 * end.y),
    };
}

export function GatewayFlow({ className = '' }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (!canvas || !context) return undefined;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let width = 0;
        let height = 0;
        let animationFrame = 0;
        let lastTime = performance.now();
        let pulses = [];
        let paths = [];

        const createPaths = () => {
            paths = Array.from({ length: PATH_COUNT }, (_, index) => ({
                fromLeft: index % 2 === 0,
                startY: ((index + 0.5) / PATH_COUNT) * height * 1.45 - (height * 0.22),
                progress: Math.random(),
                speed: 0.00007 + Math.random() * 0.00009,
            }));
        };

        const resize = () => {
            const bounds = canvas.getBoundingClientRect();
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            width = bounds.width;
            height = bounds.height;
            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            createPaths();
        };

        const draw = (time) => {
            const elapsed = Math.min(time - lastTime, 32);
            lastTime = time;
            context.clearRect(0, 0, width, height);

            const destination = {
                x: width * 0.5,
                y: height * 0.5,
            };

            pulses = pulses
                .map((pulse) => ({ ...pulse, radius: pulse.radius + elapsed * 0.45, life: pulse.life - elapsed * 0.0015 }))
                .filter((pulse) => pulse.life > 0);

            paths.forEach((path) => {
                const start = { x: path.fromLeft ? 0 : width, y: path.startY };
                const controlOne = {
                    x: path.fromLeft ? destination.x * 0.34 : width - ((width - destination.x) * 0.34),
                    y: path.startY,
                };
                const controlTwo = {
                    x: path.fromLeft ? destination.x * 0.7 : width - ((width - destination.x) * 0.7),
                    y: destination.y,
                };

                context.beginPath();
                context.moveTo(start.x, start.y);
                context.bezierCurveTo(controlOne.x, controlOne.y, controlTwo.x, controlTwo.y, destination.x, destination.y);
                context.strokeStyle = 'rgba(216, 167, 58, 0.28)';
                context.lineWidth = 1;
                context.setLineDash([1, 5]);
                context.stroke();
                context.setLineDash([]);

                if (!reduceMotion.matches) {
                    path.progress += path.speed * elapsed;
                    if (path.progress > 1) path.progress = 0;
                }

                const particle = bezierPoint(path.progress, start, controlOne, controlTwo, destination);
                let offsetX = 0;
                let offsetY = 0;

                pulses.forEach((pulse) => {
                    const deltaX = particle.x - pulse.x;
                    const deltaY = particle.y - pulse.y;
                    const distance = Math.hypot(deltaX, deltaY) || 1;
                    const distanceFromWave = Math.abs(distance - pulse.radius);

                    if (distanceFromWave < 90) {
                        const force = (1 - distanceFromWave / 90) * pulse.life * 52;
                        offsetX += (deltaX / distance) * force;
                        offsetY += (deltaY / distance) * force;
                    }
                });

                context.fillStyle = 'rgba(255, 236, 185, 0.78)';
                context.fillRect(particle.x + offsetX - 1.25, particle.y + offsetY - 1.25, 2.5, 2.5);
            });

            animationFrame = window.requestAnimationFrame(draw);
        };

        const addPulse = (event) => {
            const bounds = canvas.getBoundingClientRect();
            pulses.push({
                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top,
                radius: 0,
                life: 1,
            });
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);
        canvas.addEventListener('pointerdown', addPulse);
        resize();
        animationFrame = window.requestAnimationFrame(draw);

        return () => {
            resizeObserver.disconnect();
            canvas.removeEventListener('pointerdown', addPulse);
            window.cancelAnimationFrame(animationFrame);
        };
    }, []);

    return <canvas ref={canvasRef} className={`gateway-flow ${className}`.trim()} aria-hidden="true" />;
}
