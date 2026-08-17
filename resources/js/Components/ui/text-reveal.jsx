import React, { useRef } from 'react';
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion';

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

function TextRevealByWord({
    as: Element = 'p',
    highlight,
    revealEnd = 1,
    text,
    className,
    progress,
    progressRange = [0, 1],
    textClassName,
}) {
    const targetRef = useRef(null);
    const sectionProgress = useMotionValue(typeof progress === 'number' ? progress : 0);
    const { scrollYProgress: elementProgress } = useScroll({
        target: targetRef,
        offset: ['start 0.94', 'start 0.45'],
    });
    const start = progressRange[0];
    const end = progressRange[1];
    const scrollYProgress = typeof progress === 'number'
        ? sectionProgress
        : elementProgress;
    const words = text.split(' ');
    const highlightParts = highlight
        ? highlight.split(' ').map((part) => part.replace(/[.,!?]/g, ''))
        : [];

    React.useEffect(() => {
        if (typeof progress !== 'number') {
            return;
        }

        const normalizedProgress = Math.max(0, Math.min(1, (progress - start) / Math.max(0.001, end - start)));
        sectionProgress.set(normalizedProgress);
    }, [end, progress, sectionProgress, start]);

    return (
        <div ref={targetRef} className={cn('text-reveal-by-word', className)}>
            <Element className={cn('text-reveal-copy', textClassName)}>
                {words.map((word, i) => {
                    const start = (i / words.length) * revealEnd;
                    const end = start + Math.max(0.04, revealEnd / words.length);
                    const highlighted = highlightParts.length > 0 && highlightParts.every((part, partIndex) => {
                        const targetWord = words[i + partIndex]?.replace(/[.,!?]/g, '');

                        return targetWord === part;
                    });
                    const insideHighlightedPhrase = !highlighted && highlightParts.length > 0
                        && Array.from({ length: highlightParts.length - 1 }, (_, offset) => i - offset - 1)
                            .some((candidateStart) => candidateStart >= 0 && highlightParts.every((part, partIndex) => {
                                const targetWord = words[candidateStart + partIndex]?.replace(/[.,!?]/g, '');

                                return targetWord === part;
                            }));

                    if (insideHighlightedPhrase) {
                        return null;
                    }

                    return (
                        <Word
                            className={highlighted ? 'editorial-italic text-reveal-highlight' : null}
                            key={`${word}-${i}`}
                            progress={scrollYProgress}
                            range={[start, end]}
                        >
                            {highlighted ? words.slice(i, i + highlightParts.length).join(' ') : word}
                        </Word>
                    );
                })}
            </Element>
        </div>
    );
}

function Word({ children, className, progress, range }) {
    const opacity = useTransform(progress, range, [0, 1]);

    return (
        <span className={cn('text-reveal-word', className)}>
            <span className="text-reveal-word-shadow">{children}</span>
            <motion.span style={{ opacity }} className="text-reveal-word-front">
                {children}
            </motion.span>
        </span>
    );
}

export { TextRevealByWord };
