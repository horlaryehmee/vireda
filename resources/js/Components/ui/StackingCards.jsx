import React, { createContext, useContext, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const StackingCardsContext = createContext(null);

export function StackingCards({ children, className = '', scrollOptions, scaleMultiplier = 0.025, totalCards }) {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        offset: ['start start', 'end end'],
        ...scrollOptions,
        target: targetRef,
    });

    return (
        <StackingCardsContext.Provider value={{ progress: scrollYProgress, scaleMultiplier, totalCards }}>
            <div className={`stacking-cards ${className}`.trim()} ref={targetRef}>
                {children}
            </div>
        </StackingCardsContext.Provider>
    );
}

export function StackingCardItem({ children, className = '', index, topPosition }) {
    const context = useContext(StackingCardsContext);
    const reduceMotion = useReducedMotion();

    if (!context) {
        throw new Error('StackingCardItem must be used within StackingCards');
    }

    const { progress, scaleMultiplier, totalCards } = context;
    const scaleTo = 1 - (totalCards - index - 1) * scaleMultiplier;
    const scale = useTransform(progress, [index / totalCards, 1], [1, scaleTo]);

    return (
        <div className={`stacking-card-item ${className}`.trim()}>
            <motion.div
                className="stacking-card-motion"
                style={{
                    scale: reduceMotion ? 1 : scale,
                    top: topPosition || `calc(18px + ${index * 12}px)`,
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}

export default StackingCards;
