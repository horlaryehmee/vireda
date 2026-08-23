import React from 'react';

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

function TextRevealByWord({
    as: Element = 'p',
    highlight,
    keepTogether = [],
    text,
    className,
    textClassName,
}) {
    const words = text.split(' ');
    const highlightParts = highlight
        ? highlight.split(' ').map((part) => part.replace(/[.,!?]/g, ''))
        : [];

    return (
        <div className={cn('text-reveal-by-word', className)}>
            <Element className={cn('text-reveal-copy', textClassName)}>
                {words.map((word, i) => {
                    const highlighted = highlightParts.length > 0 && highlightParts.every((part, partIndex) => {
                        const targetWord = words[i + partIndex]?.replace(/[.,!?]/g, '');

                        return targetWord === part;
                    });
                    const groupedPhrase = keepTogether.find((phrase) => {
                        const parts = phrase.split(' ');

                        return parts.every((part, partIndex) => words[i + partIndex] === part);
                    });
                    const insideGroupedPhrase = !groupedPhrase && keepTogether.some((phrase) => {
                        const parts = phrase.split(' ');

                        return Array.from({ length: parts.length - 1 }, (_, offset) => i - offset - 1)
                            .some((candidateStart) => candidateStart >= 0 && parts.every((part, partIndex) => (
                                words[candidateStart + partIndex] === part
                            )));
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

                    if (insideGroupedPhrase) {
                        return null;
                    }

                    return (
                        <Word
                            className={highlighted ? 'editorial-italic text-reveal-highlight' : null}
                            key={`${word}-${i}`}
                        >
                            {highlighted ? words.slice(i, i + highlightParts.length).join(' ') : groupedPhrase || word}
                        </Word>
                    );
                })}
            </Element>
        </div>
    );
}

function Word({ children, className }) {
    return (
        <span className={cn('text-reveal-word', className)}>
            <span className="text-reveal-word-shadow">{children}</span>
            <span className="text-reveal-word-front">
                {children}
            </span>
        </span>
    );
}

export { TextRevealByWord };
