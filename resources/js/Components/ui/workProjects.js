const caseStudyKeys = {
    'altura.png': 'altura', 'kalm.png': 'kalm',
    'luxe-beauty.png': 'luxe', 'peakfuel.png': 'peakfuel',
    'westbrook.png': 'westbrook', 'westbrook-2.png': 'westbrook',
    'north-studio.png': 'north-web', 'north-studio-2.png': 'north-brand',
    'pivot-up.png': 'pivot-web', 'pivot-up-2.png': 'pivot-app',
    'carebridge.png': 'carebridge', 'carebridge-2.png': 'carebridge',
    'flowt.png': 'flowt', 'flowt-2.png': 'flowt',
    'the-collective.png': 'collective-brand', 'the-collective-2.png': 'collective-app',
};

const preferredProjectImages = {
    carebridge: '/images/work/carebridge-2.png',
    flowt: '/images/work/flowt-2.png',
};

export const getCaseStudyKey = (project) => caseStudyKeys[project.image.split('/').pop()];

export function groupWorkProjects(projects) {
    const groups = new Map();
    projects.forEach((project) => {
        const key = getCaseStudyKey(project) || `${project.name}-${project.category}`;
        const images = [project.image, project.mobileImage].filter(Boolean);
        if (groups.has(key)) {
            const group = groups.get(key);
            group.images = [...new Set([...group.images, ...images])];
            group.categories = [...new Set([...group.categories, project.category])];
        } else {
            groups.set(key, { ...project, images, categories: [project.category] });
        }
    });
    return [...groups.entries()].map(([key, group]) => {
        const preferredImage = preferredProjectImages[key];
        if (!preferredImage || !group.images.includes(preferredImage)) return group;
        return {
            ...group,
            image: preferredImage,
            images: [preferredImage, ...group.images.filter((image) => image !== preferredImage)],
        };
    });
}
