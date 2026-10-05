import React from 'react';
import blocks from './privacyPolicyContent.json';
import '../../../css/privacy-policy.css';

function linkedText(text) {
    return text.split(/(hello@vireda\.co\.uk|www\.vireda\.co\.uk|ico\.org\.uk|07443 121210|0303 123 1113)/g).map((part, index) => {
        const targets = {
            'hello@vireda.co.uk': 'mailto:hello@vireda.co.uk',
            'www.vireda.co.uk': 'https://www.vireda.co.uk',
            'ico.org.uk': 'https://ico.org.uk',
            '07443 121210': 'tel:+447443121210',
            '0303 123 1113': 'tel:+443031231113',
        };
        return targets[part] ? <a key={index} href={targets[part]}>{part}</a> : part;
    });
}

export default function PrivacyPolicyContent() {
    const content = [];
    for (let index = 0; index < blocks.length; index += 1) {
        const block = blocks[index];
        if (block.type === 'listItem') {
            const items = [];
            const start = index;
            while (blocks[index]?.type === 'listItem') { items.push(blocks[index].text); index += 1; }
            index -= 1;
            content.push(<ul className="privacy-policy-list" key={start}>{items.map((text) => <li key={text}>{linkedText(text)}</li>)}</ul>);
        } else if (block.type === 'table') {
            content.push(<div className="privacy-policy-table-wrap" key={index}>
                <table className="privacy-policy-table">
                    <thead><tr>{block.rows[0].map((cell) => <th scope="col" key={cell}>{cell}</th>)}</tr></thead>
                    <tbody>{block.rows.slice(1).map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{linkedText(cell)}</td>)}</tr>)}</tbody>
                </table>
            </div>);
        } else if (block.type === 'heading') {
            content.push(<h2 key={index}>{block.text}</h2>);
        } else {
            content.push(<p key={index} className={block.type === 'updated' ? 'privacy-updated' : undefined}>{linkedText(block.text)}</p>);
        }
    }
    return <>{content}</>;
}
