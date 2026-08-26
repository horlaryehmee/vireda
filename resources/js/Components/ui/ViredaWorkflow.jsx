import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Compass, Settings2 } from 'lucide-react';

const workflowSteps = [
    {
        type: 'Discover',
        title: 'Business clarity',
        description: 'Define the real problem, priorities and opportunity.',
        icon: Compass,
        tone: 'gold',
    },
    {
        type: 'Build',
        title: 'Digital systems',
        description: 'Design useful products, data and automation.',
        icon: Settings2,
        tone: 'ivory',
    },
    {
        type: 'Measure',
        title: 'Meaningful outcomes',
        description: 'Create measurable value for the business.',
        icon: BarChart3,
        tone: 'green',
    },
];

export function ViredaWorkflow() {
    return (
        <motion.aside
            className="vireda-workflow"
            aria-label="Viredá transformation workflow"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="workflow-free-flow">
                {workflowSteps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                        <motion.article
                            className={`workflow-node workflow-node-${step.tone}`}
                            key={step.type}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.4 + index * 0.13 }}
                            whileHover={{ y: -3 }}
                            aria-label={`${step.type}: ${step.title}`}
                        >
                            <div className="workflow-node-topline">
                                <span className="workflow-node-icon" aria-hidden="true">
                                    <Icon size={16} strokeWidth={1.7} />
                                </span>
                                <div>
                                    <span className="workflow-node-label">{step.type}</span>
                                    <h2>{step.title}</h2>
                                </div>
                            </div>
                            <p>{step.description}</p>
                            <div className="workflow-connected">
                                <ArrowRight size={11} aria-hidden="true" /> Connected
                            </div>
                        </motion.article>
                    );
                })}
            </div>
        </motion.aside>
    );
}
