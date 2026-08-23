import { useCallback, useEffect, useRef } from 'react';

const CELL_SIZE = 55;
const INFLUENCE_RADIUS = 260;
const MAX_WARP = 24;
const DOT_SPACING = 28;
const LERP_SPEED = 0.08;
const LINE_BASE = { r: 255, g: 255, b: 255, a: 0.13 };
const NODE_BASE_RADIUS = 1.8;
const NODE_ACTIVE_RADIUS = 3.2;

function lerpNumber(start, end, factor) {
    return start + ((end - start) * factor);
}

function lerpColor(base, active, factor) {
    const red = Math.round(lerpNumber(base.r, active.r, factor));
    const green = Math.round(lerpNumber(base.g, active.g, factor));
    const blue = Math.round(lerpNumber(base.b, active.b, factor));
    const alpha = lerpNumber(base.a, active.a, factor);

    return `rgba(${red},${green},${blue},${alpha.toFixed(3)})`;
}

export function KineticGridBackground({ className = '', tone = 'gold' }) {
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const targetMouseRef = useRef({ x: -9999, y: -9999 });
    const ripplesRef = useRef([]);
    const animationRef = useRef(0);
    const sizeRef = useRef({ width: 0, height: 0 });

    const getTheme = useCallback(() => {
        if (tone === 'monochrome') {
            return {
                background: '#000000',
                lineActive: { r: 255, g: 255, b: 255, a: 0.9 },
                nodeActive: { r: 255, g: 255, b: 255, a: 1 },
                glow: '255,255,255',
                ripple: '255,255,255',
            };
        }

        return {
            background: '#000000',
            lineActive: { r: 216, g: 167, b: 58, a: 0.9 },
            nodeActive: { r: 242, g: 201, b: 92, a: 1 },
            glow: '216,167,58',
            ripple: '242,201,92',
        };
    }, [tone]);

    const getWarpedPoint = useCallback((gridX, gridY, col, row, mouse, ripples, cols, rows) => {
        const edgeMargin = 1.5;
        const colPin = Math.min(col / edgeMargin, (cols - 1 - col) / edgeMargin, 1);
        const rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1);
        const pinFactor = colPin * colPin * rowPin * rowPin;
        const dx = gridX - mouse.x;
        const dy = gridY - mouse.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));
        const proximity = Math.max(0, 1 - (distance / INFLUENCE_RADIUS)) * pinFactor;
        let rippleX = 0;
        let rippleY = 0;

        ripples.forEach((ripple) => {
            const rdx = gridX - ripple.x;
            const rdy = gridY - ripple.y;
            const rippleDistance = Math.sqrt((rdx * rdx) + (rdy * rdy));
            const waveWidth = 55;
            const diff = rippleDistance - ripple.radius;

            if (Math.abs(diff) < waveWidth) {
                const strength = (1 - (Math.abs(diff) / waveWidth)) * ripple.opacity * 18 * pinFactor;
                const angle = Math.atan2(rdy, rdx);
                const sign = diff < 0 ? -1 : 1;

                rippleX += Math.cos(angle) * strength * sign * -1;
                rippleY += Math.sin(angle) * strength * sign * -1;
            }
        });

        if (distance < INFLUENCE_RADIUS && distance > 0 && pinFactor > 0) {
            const progress = distance / INFLUENCE_RADIUS;
            const eased = progress < 0.01 ? 0 : (1 - progress) * (1 - progress) * Math.min(1, distance / 60);
            const warpAmount = eased * MAX_WARP * pinFactor;
            const angle = Math.atan2(dy, dx);

            return {
                point: {
                    x: gridX - (Math.cos(angle) * warpAmount) + rippleX,
                    y: gridY - (Math.sin(angle) * warpAmount) + rippleY,
                },
                proximity,
            };
        }

        return {
            point: { x: gridX + rippleX, y: gridY + rippleY },
            proximity,
        };
    }, []);

    const draw = useCallback((now) => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (!canvas || !context) {
            return;
        }

        const { width, height } = sizeRef.current;
        const mouse = mouseRef.current;
        const ripples = ripplesRef.current;
        const theme = getTheme();

        context.clearRect(0, 0, width, height);
        context.fillStyle = theme.background;
        context.fillRect(0, 0, width, height);

        context.fillStyle = 'rgba(255,255,255,0.05)';
        for (let x = DOT_SPACING / 2; x < width; x += DOT_SPACING) {
            for (let y = DOT_SPACING / 2; y < height; y += DOT_SPACING) {
                context.beginPath();
                context.arc(x, y, 0.7, 0, Math.PI * 2);
                context.fill();
            }
        }

        for (let index = ripples.length - 1; index >= 0; index -= 1) {
            const ripple = ripples[index];
            const age = (now - ripple.born) / 1000;

            ripple.radius = Math.max(0, age * 400);
            ripple.opacity = Math.max(0, 1 - (age * 1.2));

            if (ripple.opacity <= 0) {
                ripples.splice(index, 1);
            }
        }

        const cols = Math.max(2, Math.ceil(width / CELL_SIZE)) + 1;
        const rows = Math.max(2, Math.ceil(height / CELL_SIZE)) + 1;
        const cellWidth = width / (cols - 1);
        const cellHeight = height / (rows - 1);
        const points = [];
        const proximities = [];

        for (let row = 0; row < rows; row += 1) {
            points[row] = [];
            proximities[row] = [];
            for (let col = 0; col < cols; col += 1) {
                const { point, proximity } = getWarpedPoint(
                    col * cellWidth,
                    row * cellHeight,
                    col,
                    row,
                    mouse,
                    ripples,
                    cols,
                    rows,
                );

                points[row][col] = point;
                proximities[row][col] = proximity;
            }
        }

        const drawSegment = (first, second, firstProximity, secondProximity) => {
            const average = (firstProximity + secondProximity) / 2;
            const factor = average * average * (3 - (2 * average));

            context.beginPath();
            context.moveTo(first.x, first.y);
            context.lineTo(second.x, second.y);
            context.strokeStyle = lerpColor(LINE_BASE, theme.lineActive, factor);
            context.lineWidth = lerpNumber(0.8, 1.5, factor);
            context.stroke();
        };

        context.lineCap = 'butt';

        for (let row = 0; row < rows; row += 1) {
            for (let col = 0; col < cols - 1; col += 1) {
                drawSegment(points[row][col], points[row][col + 1], proximities[row][col], proximities[row][col + 1]);
            }
        }

        for (let col = 0; col < cols; col += 1) {
            for (let row = 0; row < rows - 1; row += 1) {
                drawSegment(points[row][col], points[row + 1][col], proximities[row][col], proximities[row + 1][col]);
            }
        }

        for (let row = 0; row < rows; row += 1) {
            for (let col = 0; col < cols; col += 1) {
                const point = points[row][col];
                const proximity = proximities[row][col];
                const factor = proximity * proximity * (3 - (2 * proximity));
                const radius = lerpNumber(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, factor);

                if (factor > 0.3) {
                    const glowRadius = radius + lerpNumber(0, 6, (factor - 0.3) / 0.7);
                    const gradient = context.createRadialGradient(point.x, point.y, radius * 0.5, point.x, point.y, glowRadius);

                    gradient.addColorStop(0, `rgba(${theme.glow},${(factor * 0.3).toFixed(3)})`);
                    gradient.addColorStop(1, `rgba(${theme.glow},0)`);
                    context.beginPath();
                    context.arc(point.x, point.y, glowRadius, 0, Math.PI * 2);
                    context.fillStyle = gradient;
                    context.fill();
                }

                context.beginPath();
                context.arc(point.x, point.y, radius, 0, Math.PI * 2);
                context.fillStyle = lerpColor({ r: 255, g: 255, b: 255, a: 0.2 }, theme.nodeActive, factor);
                context.fill();
            }
        }

        ripples.forEach((ripple) => {
            context.beginPath();
            context.arc(ripple.x, ripple.y, Math.max(0, ripple.radius), 0, Math.PI * 2);
            context.strokeStyle = `rgba(${theme.ripple},${(ripple.opacity * 0.28).toFixed(3)})`;
            context.lineWidth = 1.5;
            context.stroke();
        });
    }, [getTheme, getWarpedPoint]);

    const animate = useCallback((now) => {
        const mouse = mouseRef.current;
        const target = targetMouseRef.current;

        mouse.x = lerpNumber(mouse.x, target.x, LERP_SPEED);
        mouse.y = lerpNumber(mouse.y, target.y, LERP_SPEED);
        draw(now);
        animationRef.current = window.requestAnimationFrame(animate);
    }, [draw]);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const canvas = canvasRef.current;

        if (!wrapper || !canvas) {
            return undefined;
        }

        const setSize = () => {
            const rect = wrapper.getBoundingClientRect();
            const ratio = window.devicePixelRatio || 1;
            const width = Math.max(1, Math.round(rect.width));
            const height = Math.max(1, Math.round(rect.height));

            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            sizeRef.current = { width, height };

            const context = canvas.getContext('2d');
            context?.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        const updateMouse = (event) => {
            const rect = wrapper.getBoundingClientRect();
            const inside = event.clientX >= rect.left
                && event.clientX <= rect.right
                && event.clientY >= rect.top
                && event.clientY <= rect.bottom;

            if (!inside) {
                targetMouseRef.current = { x: -9999, y: -9999 };
                return;
            }

            targetMouseRef.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };
        };

        const addRipple = (event) => {
            const rect = wrapper.getBoundingClientRect();
            const inside = event.clientX >= rect.left
                && event.clientX <= rect.right
                && event.clientY >= rect.top
                && event.clientY <= rect.bottom;

            if (!inside) {
                return;
            }

            ripplesRef.current.push({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
                radius: 0,
                opacity: 1,
                born: performance.now(),
            });
        };

        const leave = () => {
            targetMouseRef.current = { x: -9999, y: -9999 };
        };

        const resizeObserver = new ResizeObserver(setSize);
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        setSize();
        resizeObserver.observe(wrapper);
        window.addEventListener('mousemove', updateMouse);
        window.addEventListener('click', addRipple);
        window.addEventListener('scroll', leave, { passive: true });

        if (!reduceMotion.matches) {
            animationRef.current = window.requestAnimationFrame(animate);
        } else {
            draw(performance.now());
        }

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('mousemove', updateMouse);
            window.removeEventListener('click', addRipple);
            window.removeEventListener('scroll', leave);
            window.cancelAnimationFrame(animationRef.current);
        };
    }, [animate, draw]);

    return (
        <div className={`kinetic-grid-background ${className}`} ref={wrapperRef}>
            <canvas ref={canvasRef} />
        </div>
    );
}
