// Single source of truth for personal info shown across the site.

// First day of my professional career; years of experience are derived from it at build time.
const careerStart = new Date('2019-07-01');
const now = new Date();
export const yearsOfExperience = Math.floor(
  ((now.getUTCFullYear() - careerStart.getUTCFullYear()) * 12 + now.getUTCMonth() - careerStart.getUTCMonth()) / 12,
);

export const profile = {
  name: 'Francisco Pinho Oliveira',
  shortName: 'Francisco Oliveira',
  role: 'Front-End Developer',
  location: 'Figueira da Foz, Portugal',
  headline: `Front-End Developer with ${yearsOfExperience}+ years building scalable web applications with Vue.js, Angular, TypeScript and Adobe Experience Manager.`,
  summary:
    'I design and develop enterprise-grade web applications, with a focus on reusable component architectures, close collaboration with UI/UX designers, and clean, maintainable codebases. I have worked across fleet management, telecom e-commerce and CRM platforms, from project inception to large-scale, customer-facing products.',
  email: 'franciscopinho96@gmail.com',
  // Set to true once public/cv.pdf exists (without phone number) to show the download button.
  hasCv: false,
};

export const links = {
  linkedin: 'https://www.linkedin.com/in/francisco-pinho',
  github: 'https://github.com/xPinhoo',
};

export type Skill = {
  name: string;
  // Technology names as written in the experience files; defaults to [name].
  // Used to compute years of use and to filter jobs by skill.
  match?: string[];
  // false keeps a skill out of the "Filter by skill" chips (no years badge), e.g. occasional use.
  filter?: boolean;
};

export const skills: { group: string; items: Skill[] }[] = [
  {
    group: 'Frontend',
    items: [
      { name: 'Vue.js', match: ['Vue.js', 'Vue.js 3'] },
      { name: 'Angular' },
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'HTML5', match: ['HTML', 'HTML5'] },
      { name: 'CSS / SCSS', match: ['CSS', 'SCSS'] },
    ],
  },
  { group: 'CMS & Platforms', items: [{ name: 'AEM', match: ['AEM'] }] },
  { group: 'Backend', items: [{ name: 'Java', filter: false }, { name: 'Node.js' }, { name: 'REST APIs' }] },
  { group: 'Databases', items: [{ name: 'PostgreSQL' }, { name: 'MySQL' }, { name: 'MongoDB' }] },
  { group: 'Tools', items: [{ name: 'Git' }, { name: 'Postman' }, { name: 'Jenkins' }, { name: 'Jira' }] },
];

export const certifications = [
  { name: 'Adobe Certified Expert — AEM Sites Business Practitioner', issuer: 'Adobe', date: '2024' },
];

export const education = [
  { degree: "Bachelor's Degree in Computer Science", school: 'University of Aveiro', period: '2014 — 2019', location: 'Aveiro, Portugal' },
];

export const languages = [
  { name: 'Portuguese', level: 'Native' },
  { name: 'English', level: 'Proficient (C1)' },
  { name: 'Spanish', level: 'Independent (B2)' },
];

export const highlights = [
  { value: `${yearsOfExperience}+`, label: 'years in enterprise front-end' },
  { value: '3', label: 'companies: Frotcom, Celfocus (for Vodafone), Altice Labs' },
  { value: 'ACE', label: 'Adobe Certified Expert, AEM Sites' },
];
