import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FaqSplitSection({ items }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="web-development-section web-development-faq" aria-labelledby="web-development-faq-title">
            <div className="container web-development-faq-layout">
                <div className="web-development-faq-content">
                    <h2 id="web-development-faq-title">FAQs</h2>
                </div>
                <div className="web-development-faq-list">
                    {items.map(([question, answer], index) => {
                        const isOpen = openIndex === index;
                        return (
                            <article className={isOpen ? 'is-open' : ''} key={question}>
                                <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} aria-expanded={isOpen} aria-controls={`web-faq-answer-${index}`}>
                                    <span>{question}</span>
                                    <ChevronDown size={19} aria-hidden="true" />
                                </button>
                                <div className="web-development-faq-answer" id={`web-faq-answer-${index}`}>
                                    <div><p>{answer}</p></div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default FaqSplitSection;
