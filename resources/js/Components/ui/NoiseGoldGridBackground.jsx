import { useEffect, useRef } from 'react';

function setHiDPICanvas(canvas, ctx) {
    const parent = canvas.parentElement;
    const width = Math.floor(parent?.clientWidth || window.innerWidth);
    const height = Math.floor(parent?.clientHeight || window.innerHeight);
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function originFromOffset(offset, cell) {
    return {
        x: -((offset.x % cell) + cell) % cell,
        y: -((offset.y % cell) + cell) % cell,
    };
}

function Noise({ alpha = 16, refresh = 3 }) {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas?.getContext('2d', { alpha: true });

        if (!canvas || !ctx) {
            return undefined;
        }

        let frame = 0;
        let animationFrame = 0;
        const size = 640;

        const resize = () => {
            canvas.width = size;
            canvas.height = size;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
        };

        const draw = () => {
            const image = ctx.createImageData(size, size);
            const data = image.data;

            for (let index = 0; index < data.length; index += 4) {
                const value = Math.random() * 255;
                data[index] = value;
                data[index + 1] = value * 0.82;
                data[index + 2] = value * 0.42;
                data[index + 3] = alpha;
            }

            ctx.putImageData(image, 0, 0);
        };

        const loop = () => {
            if (frame % refresh === 0) {
                draw();
            }

            frame += 1;
            animationFrame = window.requestAnimationFrame(loop);
        };

        resize();
        loop();

        return () => window.cancelAnimationFrame(animationFrame);
    }, [alpha, refresh]);

    return <canvas className="noise-gold-layer" ref={ref} aria-hidden="true" />;
}

function MovingGrid({ gridOffsetRef, squareSize = 46 }) {
    const ref = useRef(null);
    const frameRef = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) {
            return undefined;
        }

        const draw = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const origin = originFromOffset(gridOffsetRef.current, squareSize);

            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(216, 167, 58, 0.16)';

            for (let x = origin.x; x < width + squareSize; x += squareSize) {
                ctx.beginPath();
                ctx.moveTo(x + 0.5, 0);
                ctx.lineTo(x + 0.5, height);
                ctx.stroke();
            }

            for (let y = origin.y; y < height + squareSize; y += squareSize) {
                ctx.beginPath();
                ctx.moveTo(0, y + 0.5);
                ctx.lineTo(width, y + 0.5);
                ctx.stroke();
            }

            const vignette = ctx.createRadialGradient(
                width * 0.58,
                height * 0.34,
                0,
                width * 0.58,
                height * 0.34,
                Math.sqrt(width * width + height * height) * 0.58,
            );
            vignette.addColorStop(0, 'rgba(0,0,0,0)');
            vignette.addColorStop(1, '#000');
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, width, height);

            frameRef.current = window.requestAnimationFrame(draw);
        };

        const resize = () => setHiDPICanvas(canvas, ctx);

        resize();
        draw();
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            window.cancelAnimationFrame(frameRef.current);
        };
    }, [gridOffsetRef, squareSize]);

    return <canvas className="noise-gold-grid" ref={ref} aria-hidden="true" />;
}

export function NoiseGoldGridBackground({
    direction = 'diagonal',
    speed = 0.32,
    squareSize = 46,
}) {
    const gridOffsetRef = useRef({ x: 0, y: 0 });
    const frameRef = useRef(null);

    useEffect(() => {
        const tick = () => {
            const size = squareSize;
            const velocity = Math.max(speed, 0.08);

            if (direction === 'left' || direction === 'diagonal') {
                gridOffsetRef.current.x = (gridOffsetRef.current.x + velocity + size) % size;
            } else if (direction === 'right') {
                gridOffsetRef.current.x = (gridOffsetRef.current.x - velocity + size) % size;
            }

            if (direction === 'up' || direction === 'diagonal') {
                gridOffsetRef.current.y = (gridOffsetRef.current.y + velocity + size) % size;
            } else if (direction === 'down') {
                gridOffsetRef.current.y = (gridOffsetRef.current.y - velocity + size) % size;
            }

            frameRef.current = window.requestAnimationFrame(tick);
        };

        frameRef.current = window.requestAnimationFrame(tick);

        return () => window.cancelAnimationFrame(frameRef.current);
    }, [direction, speed, squareSize]);

    return (
        <div className="noise-gold-background" aria-hidden="true">
            <div className="noise-gold-spotlight" />
            <MovingGrid gridOffsetRef={gridOffsetRef} squareSize={squareSize} />
            <Noise />
            <div className="noise-gold-vignette" />
        </div>
    );
}
