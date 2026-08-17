const dots = [
    { cx: 2, cy: 2, delay: 0 },
    { cx: 5, cy: 5, delay: 0.05 },
    { cx: 8, cy: 8, delay: 0.1 },
    { cx: 5, cy: 11, delay: 0.15 },
    { cx: 2, cy: 14, delay: 0.2 },
    { cx: 6, cy: 2, delay: 0.05 },
    { cx: 9, cy: 5, delay: 0.1 },
    { cx: 12, cy: 8, delay: 0.15 },
    { cx: 9, cy: 11, delay: 0.2 },
    { cx: 6, cy: 14, delay: 0.25 },
];

function DoubleChevron({ index }) {
    const baseDelay = index * 0.12;

    return (
        <svg className="anti-metal-chevron" width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
            <g fill="currentColor">
                {dots.map((dot, dotIndex) => (
                    <circle
                        className="anti-metal-dot"
                        cx={dot.cx}
                        cy={dot.cy}
                        key={dotIndex}
                        r="1"
                        style={{ animationDelay: `${baseDelay + dot.delay}s` }}
                    />
                ))}
            </g>
        </svg>
    );
}

export function GetStartedButton({
    children = 'Start a conversation',
    href,
    className = '',
    size = 'default',
    ...props
}) {
    const Component = href ? 'a' : 'button';

    return (
        <Component
            className={`get-started-button anti-metal-button ${size === 'sm' ? 'is-small' : ''} ${className}`}
            href={href}
            type={href ? undefined : 'button'}
            {...props}
        >
            <span className="anti-metal-label">{children}</span>
            <span className="anti-metal-accent" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((index) => (
                    <DoubleChevron index={index} key={index} />
                ))}
            </span>
        </Component>
    );
}
