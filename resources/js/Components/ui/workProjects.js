const caseStudyKeys = {
    'altura.webp': 'altura', 'kalm.webp': 'kalm',
    'luxe-beauty.webp': 'luxe', 'peakfuel.webp': 'peakfuel',
    'westbrook.webp': 'westbrook', 'westbrook-2.webp': 'westbrook',
    'north-studio.webp': 'north-web', 'north-studio-2.webp': 'north-brand',
    'pivot-up.webp': 'pivot-web', 'pivot-up-2.webp': 'pivot-app',
    'carebridge.webp': 'carebridge', 'carebridge-2.webp': 'carebridge',
    'flowt.webp': 'flowt', 'flowt-2.webp': 'flowt',
    'the-collective.webp': 'collective-brand', 'the-collective-2.webp': 'collective-app',
};

const preferredProjectImages = {
    carebridge: '/images/work/carebridge-2.webp',
    flowt: '/images/work/flowt-2.webp',
};

const additionalProjectImages = {
    kalm: ['kalm-ui-1.webp', 'kalm-ui-2.webp', 'kalm-ui-3.webp'],
    luxe: ['luxe-beauty-ui-1.webp', 'luxe-beauty-ui-2.webp', 'luxe-beauty-ui-3.webp'],
    westbrook: ['westbrook-property-ui-1.webp', 'westbrook-property-ui-2.webp'],
    'north-web': ['north-studio-ui-1.webp', 'north-studio-ui-2.webp', 'north-studio-ui-3.webp'],
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
        const cover = preferredImage && group.images.includes(preferredImage) ? preferredImage : group.image;
        const additionalImages = (additionalProjectImages[key] || []).map((name) => `/images/work/${name}`);
        return {
            ...group,
            image: cover,
            images: [cover, ...additionalImages, ...group.images.filter((image) => image !== cover && !additionalImages.includes(image))],
        };
    });
}
