import { useEffect, useRef } from 'react';

export function ConstellationGrid({ className = '' }) {
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        const context = canvas?.getContext('2d', { alpha: false });

        if (!canvas || !wrapper || !context) {
            return undefined;
        }

        let animationFrame = 0;
        let width = 0;
        let height = 0;
        let nodes = [];
        let lastTime = performance.now();
        let isDarkMode = document.documentElement.classList.contains('dark');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mouse = {
            x: -1000,
            y: -1000,
            previousX: -1000,
            previousY: -1000,
            velocityX: 0,
            velocityY: 0,
            radius: 220,
        };

        const initialiseNodes = () => {
            const spacing = 55;
            const columns = Math.ceil(width / spacing) + 1;
            const rows = Math.ceil(height / spacing) + 1;

            nodes = [];

            for (let column = 0; column < columns; column += 1) {
                for (let row = 0; row < rows; row += 1) {
                    const x = column * spacing;
                    const y = row * spacing;

                    nodes.push({
                        x,
                        y,
                        velocityX: 0,
                        velocityY: 0,
                        baseX: x,
                        baseY: y,
                        radius: Math.random() * 1.2 + 1.2,
                        label: `${(column * 7).toString(16).toUpperCase()}:${(row * 11).toString(16).toUpperCase()}`,
                        pulse: Math.random() * Math.PI * 2,
                    });
                }
            }
        };

        const resize = () => {
            const rect = wrapper.getBoundingClientRect();
            const ratio = Math.min(window.devicePixelRatio || 1, 2);

            width = Math.max(1, Math.round(rect.width));
            height = Math.max(1, Math.round(rect.height));
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            initialiseNodes();
        };

        const updateMouse = (event) => {
            const rect = wrapper.getBoundingClientRect();

            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
                mouse.x = -1000;
                mouse.y = -1000;
                mouse.previousX = -1000;
                mouse.previousY = -1000;
                return;
            }

            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        };

        const updateTheme = (event) => {
            isDarkMode = event.detail === 'dark';
        };

        const render = (now) => {
            const delta = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;
            mouse.velocityX = (mouse.x - mouse.previousX) / (delta * 1000 || 1);
            mouse.velocityY = (mouse.y - mouse.previousY) / (delta * 1000 || 1);
            mouse.previousX = mouse.x;
            mouse.previousY = mouse.y;

            const speed = Math.hypot(mouse.velocityX, mouse.velocityY);

            const background = isDarkMode ? '#030303' : '#f6f3eb';
            const nodeColor = isDarkMode ? '255, 248, 230' : '24, 25, 28';
            const accentColor = isDarkMode ? '216, 167, 58' : '184, 137, 40';

            context.fillStyle = background;
            context.fillRect(0, 0, width, height);

            nodes.forEach((node) => {
                node.pulse += delta * 3;

                const distanceX = mouse.x - node.x;
                const distanceY = mouse.y - node.y;
                const distance = Math.hypot(distanceX, distanceY);

                if (!reduceMotion && distance < mouse.radius && distance > 0) {
                    const power = 1 - (distance / mouse.radius);
                    const force = power * (1500 + speed * 150);
                    const angle = Math.atan2(distanceY, distanceX);

                    node.velocityX -= Math.cos(angle) * force * delta;
                    node.velocityY -= Math.sin(angle) * force * delta;
                }

                node.velocityX += (node.baseX - node.x) * 18 * delta;
                node.velocityY += (node.baseY - node.y) * 18 * delta;
                node.velocityX *= 0.82;
                node.velocityY *= 0.82;
                node.x += node.velocityX * delta * 60;
                node.y += node.velocityY * delta * 60;
            });

            const connectionDistance = 75;

            for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
                const first = nodes[firstIndex];

                for (let secondIndex = firstIndex + 1; secondIndex < nodes.length; secondIndex += 1) {
                    const second = nodes[secondIndex];
                    const distance = Math.hypot(first.x - second.x, first.y - second.y);

                    if (distance >= connectionDistance) {
                        continue;
                    }

                    context.strokeStyle = `rgba(${nodeColor}, ${(1 - distance / connectionDistance) * (isDarkMode ? 0.14 : 0.09)})`;
                    context.lineWidth = 0.7;
                    context.beginPath();
                    context.moveTo(first.x, first.y);
                    context.lineTo(second.x, second.y);
                    context.stroke();
                }
            }

            nodes.forEach((node) => {
                const distance = Math.hypot(mouse.x - node.x, mouse.y - node.y);
                const isNear = distance < mouse.radius;
                const alpha = isNear ? 0.95 : 0.22 + Math.sin(node.pulse) * 0.08;
                const radius = isNear ? node.radius * 2.2 : node.radius + Math.sin(node.pulse) * 0.3;

                context.fillStyle = isNear ? `rgba(${accentColor}, ${alpha})` : `rgba(${nodeColor}, ${alpha})`;
                context.beginPath();
                context.arc(node.x, node.y, Math.max(0.5, radius), 0, Math.PI * 2);
                context.fill();

                if (distance < 90) {
                    const ring = ((node.pulse * 20) % 30) + 4;
                    context.strokeStyle = `rgba(${accentColor}, ${(1 - ring / 34) * 0.4})`;
                    context.lineWidth = 1;
                    context.beginPath();
                    context.arc(node.x, node.y, ring, 0, Math.PI * 2);
                    context.stroke();
                    context.font = '8px ui-monospace, SFMono-Regular, Consolas, monospace';
                    context.fillStyle = `rgba(${accentColor}, 0.85)`;
                    context.fillText(node.label, node.x + 10, node.y - 10);
                }
            });

            if (!reduceMotion) {
                animationFrame = window.requestAnimationFrame(render);
            }
        };

        const resizeObserver = new ResizeObserver(resize);

        resize();
        resizeObserver.observe(wrapper);
        window.addEventListener('mousemove', updateMouse);
        window.addEventListener('vireda-theme-change', updateTheme);
        animationFrame = window.requestAnimationFrame(render);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('mousemove', updateMouse);
            window.removeEventListener('vireda-theme-change', updateTheme);
            window.cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <div className={`constellation-grid ${className}`} ref={wrapperRef} aria-hidden="true">
            <canvas ref={canvasRef} />
        </div>
    );
}
