import React, { useEffect, useRef } from 'react';

const originFromOffset = (offset, cell) => ({
    x: -(((offset.x % cell) + cell) % cell),
    y: -(((offset.y % cell) + cell) % cell),
});

function setHiDPICanvas(canvas, context) {
    const parent = canvas.parentElement;
    const width = Math.max(1, parent?.clientWidth ?? window.innerWidth);
    const height = Math.max(1, parent?.clientHeight ?? window.innerHeight);
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    return { width, height };
}

export function HeroGridBackground() {
    const canvasRef = useRef(null);
    const mouseRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        const context = canvas.getContext('2d', { alpha: true });
        if (!context) return undefined;

        const squareSize = 44;
        let dimensions = setHiDPICanvas(canvas, context);
        let frameId;
        let frame = 0;

        const resize = () => {
            dimensions = setHiDPICanvas(canvas, context);
        };

        const handlePointerMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };
        };

        const handlePointerLeave = () => {
            mouseRef.current = null;
        };

        const drawNoise = (width, height) => {
            if (frame % 3 !== 0) return;

            const density = Math.max(900, Math.floor((width * height) / 1000));
            context.save();
            context.globalAlpha = 0.075;

            for (let index = 0; index < density; index += 1) {
                const value = 150 + Math.random() * 90;
                context.fillStyle = `rgb(${value}, ${value * 0.78}, ${value * 0.32})`;
                context.fillRect(Math.random() * width, Math.random() * height, 1, 1);
            }

            context.restore();
        };

        const draw = () => {
            const { width, height } = dimensions;
            const offset = offsetRef.current;
            offset.x = (offset.x - 0.42 + squareSize) % squareSize;
            offset.y = (offset.y - 0.42 + squareSize) % squareSize;

            context.clearRect(0, 0, width, height);

            const spotlight = context.createRadialGradient(
                width * 0.58,
                Math.min(height * 0.32, 260),
                0,
                width * 0.58,
                Math.min(height * 0.32, 260),
                Math.max(width, height) * 0.55,
            );
            spotlight.addColorStop(0, 'rgba(216, 167, 58, 0.32)');
            spotlight.addColorStop(0.52, 'rgba(216, 167, 58, 0.085)');
            spotlight.addColorStop(1, 'rgba(0, 0, 0, 0)');
            context.fillStyle = spotlight;
            context.fillRect(0, 0, width, height);

            const origin = originFromOffset(offset, squareSize);
            context.save();
            context.strokeStyle = 'rgba(216, 167, 58, 0.22)';
            context.lineWidth = 1;

            for (let x = origin.x; x < width + squareSize; x += squareSize) {
                context.beginPath();
                context.moveTo(x + 0.5, 0);
                context.lineTo(x + 0.5, height);
                context.stroke();
            }

            for (let y = origin.y; y < height + squareSize; y += squareSize) {
                context.beginPath();
                context.moveTo(0, y + 0.5);
                context.lineTo(width, y + 0.5);
                context.stroke();
            }
            context.restore();

            const mouse = mouseRef.current;
            if (mouse) {
                const gx = Math.floor((mouse.x - origin.x) / squareSize);
                const gy = Math.floor((mouse.y - origin.y) / squareSize);
                const cellX = origin.x + gx * squareSize;
                const cellY = origin.y + gy * squareSize;

                context.save();
                context.shadowBlur = 22;
                context.shadowColor = 'rgba(216, 167, 58, 0.46)';
                context.fillStyle = 'rgba(216, 167, 58, 0.08)';
                context.fillRect(cellX, cellY, squareSize, squareSize);
                context.restore();

                context.lineWidth = 1.25;
                context.strokeStyle = 'rgba(255, 218, 132, 0.5)';
                context.strokeRect(cellX + 0.5, cellY + 0.5, squareSize - 1, squareSize - 1);

                const sheen = context.createLinearGradient(cellX, cellY, cellX, cellY + squareSize);
                sheen.addColorStop(0, 'rgba(255, 248, 225, 0.16)');
                sheen.addColorStop(1, 'rgba(216, 167, 58, 0.03)');
                context.fillStyle = sheen;
                context.fillRect(cellX, cellY, squareSize, squareSize);
            }

            const vignette = context.createRadialGradient(
                width / 2,
                height / 2,
                0,
                width / 2,
                height / 2,
                Math.sqrt(width * width + height * height) / 2,
            );
            vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
            vignette.addColorStop(1, 'rgba(0, 0, 0, 0.48)');
            context.fillStyle = vignette;
            context.fillRect(0, 0, width, height);

            drawNoise(width, height);

            frame += 1;
            frameId = window.requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerleave', handlePointerLeave);
        frameId = window.requestAnimationFrame(draw);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerleave', handlePointerLeave);
        };
    }, []);

    return <canvas className="hero-grid-background" ref={canvasRef} aria-hidden="true" />;
}
