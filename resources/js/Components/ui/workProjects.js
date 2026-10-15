const caseStudyKeys = {
    'altura.webp': 'altura', 'kalm.webp': 'kalm',
    'luxe-beauty.webp': 'luxe', 'peakfuel.webp': 'peakfuel',
    'westbrook.webp': 'westbrook', 'westbrook-2.webp': 'westbrook',
    'north-studio.webp': 'north-web', 'north-studio-2.webp': 'north-brand',
    'pivot-up.webp': 'pivot-web', 'pivot-up-2.webp': 'pivot-app',
    'carebridge.webp': 'carebridge', 'carebridge-2.webp': 'carebridge',
    'flowt.webp': 'flowt', 'flowt-2.webp': 'flowt', 'flowt-reports-and-team.webp': 'flowt',
    'the-collective.webp': 'collective-brand', 'the-collective-2.webp': 'collective-app',
};

const preferredProjectImages = {
    carebridge: '/images/work/carebridge-2.webp',
    flowt: '/images/work/flowt-reports-and-team.webp',
};

const additionalProjectImages = {
    kalm: ['kalm-ui-1.webp', 'kalm-ui-2.webp', 'kalm-ui-3.webp'],
    luxe: ['luxe-beauty-ui-1.webp', 'luxe-beauty-ui-2.webp', 'luxe-beauty-ui-3.webp', 'luxe-beauty-mobile-showcase.webp'],
    peakfuel: ['peakfuel-storefront.webp', 'peakfuel-checkout.webp', 'peakfuel-orders.webp'],
    westbrook: ['westbrook-property-ui-1.webp', 'westbrook-property-ui-2.webp'],
    'north-web': ['north-studio-ui-1.webp', 'north-studio-ui-2.webp', 'north-studio-ui-3.webp'],
    'pivot-web': ['pivot-website-overview.webp', 'pivot-services-and-mobile.webp', 'pivot-student-portal.webp'],
    'pivot-app': ['pivot-course-dashboard.webp', 'pivot-student-dashboard.webp', 'pivot-student-mobile.webp'],
    carebridge: ['carebridge-operations.webp', 'carebridge-medication.webp', 'carebridge-mobile.webp'],
    flowt: ['flowt-project-workspace.webp'],
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
        const cover = preferredImage || group.image;
        const additionalImages = (additionalProjectImages[key] || []).map((name) => `/images/work/${name}`);
        return {
            ...group,
            image: cover,
            images: [cover, ...additionalImages, ...group.images.filter((image) => image !== cover && !additionalImages.includes(image))],
        };
    });
}
