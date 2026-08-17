import React, { useEffect, useRef } from 'react';

function NeonMesh({ className = '' }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return undefined;

        let cleanupMesh = null;
        let hasStarted = false;
        let animationFrame = null;
        let isVisible = false;
        let width = 0;
        let height = 0;
        let points = [];
        let constraints = [];
        let time = 0;

        const mouse = {
            x: -1000,
            y: -1000,
            targetAngleX: 0.18,
            targetAngleY: 0,
            angleX: 0.18,
            angleY: 0,
            radius: 170,
        };

        const startMesh = () => {
            if (hasStarted) {
                return;
            }

            hasStarted = true;

            const context = canvas.getContext('2d', { alpha: false });
            if (!context) return;

        const initialiseMesh = () => {
            points = [];
            constraints = [];
            const spacing = 48;
            const columns = Math.ceil((width * 1.15) / spacing) + 1;
            const rows = Math.ceil((height * 1.15) / spacing) + 1;
            const grid = [];
            const startX = -(columns * spacing) / 2;
            const startY = -(rows * spacing) / 2;

            for (let row = 0; row < rows; row += 1) {
                grid[row] = [];
                for (let column = 0; column < columns; column += 1) {
                    const baseX = startX + column * spacing;
                    const baseY = startY + row * spacing;
                    const point = {
                        x: baseX,
                        y: baseY,
                        z: 0,
                        oldX: baseX,
                        oldY: baseY,
                        oldZ: 0,
                        baseX,
                        baseY,
                        projX: 0,
                        projY: 0,
                        projScale: 1,
                        pinned: column === 0 || column === columns - 1 || row === 0 || row === rows - 1,
                    };
                    points.push(point);
                    grid[row][column] = point;
                }
            }

            for (let row = 0; row < rows; row += 1) {
                for (let column = 0; column < columns; column += 1) {
                    if (column < columns - 1) constraints.push({ p1: grid[row][column], p2: grid[row][column + 1], length: spacing });
                    if (row < rows - 1) constraints.push({ p1: grid[row][column], p2: grid[row + 1][column], length: spacing });
                }
            }
        };

        const resize = () => {
            const rect = container.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.max(1, Math.round(width * dpr));
            canvas.height = Math.max(1, Math.round(height * dpr));
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            initialiseMesh();
        };

        const handlePointerMove = (event) => {
            const rect = container.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
                mouse.x = -1000;
                mouse.y = -1000;
                mouse.targetAngleX = 0.18;
                mouse.targetAngleY = 0;
                return;
            }
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
            mouse.targetAngleY = ((mouse.x / width - 0.5) * 2) * 0.35;
            mouse.targetAngleX = -((mouse.y / height - 0.5) * 2) * 0.24 + 0.18;
        };

        const render = () => {
            if (!isVisible) {
                animationFrame = null;
                return;
            }
            time += 0.018;
            mouse.angleX += (mouse.targetAngleX - mouse.angleX) * 0.045;
            mouse.angleY += (mouse.targetAngleY - mouse.angleY) * 0.045;

            const cosX = Math.cos(mouse.angleX);
            const sinX = Math.sin(mouse.angleX);
            const cosY = Math.cos(mouse.angleY);
            const sinY = Math.sin(mouse.angleY);
            const background = '#000000';
            const meshRgb = '242, 201, 92';
            const activeGold = '#f2c95c';

            context.fillStyle = background;
            context.fillRect(0, 0, width, height);

            points.forEach((point) => {
                if (point.pinned) return;
                const velocityX = (point.x - point.oldX) * 0.93;
                const velocityY = (point.y - point.oldY) * 0.93;
                const velocityZ = (point.z - point.oldZ) * 0.93;
                point.oldX = point.x;
                point.oldY = point.y;
                point.oldZ = point.z;
                point.x += velocityX + (point.baseX - point.x) * 0.04;
                point.y += velocityY + (point.baseY - point.y) * 0.04;
                point.z += velocityZ + (Math.sin(point.baseX * 0.014 + point.baseY * 0.014 + time) * 16 - point.z) * 0.04;
            });

            const perspective = 620;
            points.forEach((point) => {
                const rotatedX = point.x * cosY + point.z * sinY;
                const rotatedZ = -point.x * sinY + point.z * cosY;
                const pitchedY = point.y * cosX - rotatedZ * sinX;
                const depth = point.y * sinX + rotatedZ * cosX + 430;
                const scale = perspective / Math.max(1, depth);
                point.projScale = scale;
                point.projX = width / 2 + rotatedX * scale;
                point.projY = height / 2 + pitchedY * scale;

                if (!point.pinned) {
                    const deltaX = point.projX - mouse.x;
                    const deltaY = point.projY - mouse.y;
                    const distance = Math.hypot(deltaX, deltaY);
                    if (distance < mouse.radius && distance > 0) {
                        const force = (1 - distance / mouse.radius) * 18;
                        const angle = Math.atan2(deltaY, deltaX);
                        point.x += (Math.cos(angle) * force) / scale;
                        point.y += (Math.sin(angle) * force) / scale;
                        point.z -= (force * 1.35) / scale;
                    }
                }
            });

            for (let iteration = 0; iteration < 3; iteration += 1) {
                constraints.forEach((constraint) => {
                    const deltaX = constraint.p2.x - constraint.p1.x;
                    const deltaY = constraint.p2.y - constraint.p1.y;
                    const deltaZ = constraint.p2.z - constraint.p1.z;
                    const distance = Math.hypot(deltaX, deltaY, deltaZ) || 1;
                    const correction = (distance - constraint.length) / distance;
                    if (!constraint.p1.pinned) {
                        constraint.p1.x += deltaX * 0.5 * correction;
                        constraint.p1.y += deltaY * 0.5 * correction;
                        constraint.p1.z += deltaZ * 0.5 * correction;
                    }
                    if (!constraint.p2.pinned) {
                        constraint.p2.x -= deltaX * 0.5 * correction;
                        constraint.p2.y -= deltaY * 0.5 * correction;
                        constraint.p2.z -= deltaZ * 0.5 * correction;
                    }
                });
            }

            constraints.forEach((constraint) => {
                const midpointX = (constraint.p1.projX + constraint.p2.projX) / 2;
                const midpointY = (constraint.p1.projY + constraint.p2.projY) / 2;
                const distance = Math.hypot(mouse.x - midpointX, mouse.y - midpointY);
                const isActive = distance < mouse.radius;
                const scale = (constraint.p1.projScale + constraint.p2.projScale) / 2;
                context.strokeStyle = isActive ? activeGold : `rgba(${meshRgb}, ${Math.max(0.08, Math.min(0.24, 0.16 * scale))})`;
                context.lineWidth = isActive ? 1.6 * scale : 0.65 * scale;
                context.beginPath();
                context.moveTo(constraint.p1.projX, constraint.p1.projY);
                context.lineTo(constraint.p2.projX, constraint.p2.projY);
                context.stroke();
            });

            animationFrame = window.requestAnimationFrame(render);
        };

        const resizeObserver = new ResizeObserver(resize);
        const visibilityObserver = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible && animationFrame === null) {
                animationFrame = window.requestAnimationFrame(render);
            } else if (!isVisible && animationFrame !== null) {
                window.cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        }, { rootMargin: '200px 0px' });
        resizeObserver.observe(container);
        visibilityObserver.observe(container);
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        resize();

        cleanupMesh = () => {
            if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
            window.removeEventListener('pointermove', handlePointerMove);
            resizeObserver.disconnect();
            visibilityObserver.disconnect();
        };
        };

        const startupObserver = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                return;
            }

            startupObserver.disconnect();
            startMesh();
        }, { rootMargin: '600px 0px' });

        startupObserver.observe(container);

        return () => {
            startupObserver.disconnect();

            if (cleanupMesh) {
                cleanupMesh();
            }
        };
    }, []);

    return (
        <div ref={containerRef} className={`neon-mesh-background ${className}`.trim()} aria-hidden="true">
            <canvas ref={canvasRef} />
        </div>
    );
}

export { NeonMesh };
export default NeonMesh;
