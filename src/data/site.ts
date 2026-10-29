// Single source of truth for personal info shown across the site.
import type { L } from '../i18n';

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
  headline: {
    en: `Front-End Developer with ${yearsOfExperience}+ years building scalable web applications with Vue.js, Angular, TypeScript and Adobe Experience Manager.`,
    pt: `Front-End Developer com mais de ${yearsOfExperience} anos de experiência a desenvolver aplicações web escaláveis com Vue.js, Angular, TypeScript e Adobe Experience Manager.`,
  } satisfies L,
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

export const skills: { group: L; items: Skill[] }[] = [
  {
    group: { en: 'Frontend', pt: 'Frontend' },
    items: [
      { name: 'Vue.js', match: ['Vue.js', 'Vue.js 3'] },
      { name: 'Angular' },
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'HTML5', match: ['HTML', 'HTML5'] },
      { name: 'CSS / SCSS', match: ['CSS', 'SCSS'] },
    ],
  },
  { group: { en: 'CMS & Platforms', pt: 'CMS e plataformas' }, items: [{ name: 'AEM', match: ['AEM'] }] },
  { group: { en: 'Backend', pt: 'Backend' }, items: [{ name: 'Java', filter: false }, { name: 'Node.js' }, { name: 'REST APIs' }] },
  { group: { en: 'Databases', pt: 'Bases de dados' }, items: [{ name: 'PostgreSQL' }, { name: 'MySQL' }, { name: 'MongoDB' }] },
  { group: { en: 'Tools', pt: 'Ferramentas' }, items: [{ name: 'Git' }, { name: 'Postman' }, { name: 'Jenkins' }, { name: 'Jira' }] },
];

export const certifications = [
  { name: 'Adobe Certified Expert — AEM Sites Business Practitioner', issuer: 'Adobe', date: '2024' },
];

export const education = [
  {
    degree: { en: "Bachelor's Degree in Computer Science", pt: 'Licenciatura em Engenharia Informática' } satisfies L,
    school: { en: 'University of Aveiro', pt: 'Universidade de Aveiro' } satisfies L,
    period: '2014 — 2019',
  },
];

export const languages: { name: L; level: L }[] = [
  { name: { en: 'Portuguese', pt: 'Português' }, level: { en: 'Native', pt: 'Nativo' } },
  { name: { en: 'English', pt: 'Inglês' }, level: { en: 'Proficient (C1)', pt: 'Proficiente (C1)' } },
  { name: { en: 'Spanish', pt: 'Espanhol' }, level: { en: 'Independent (B2)', pt: 'Independente (B2)' } },
];

export const highlights: { value: string; label: L }[] = [
  { value: `${yearsOfExperience}+`, label: { en: 'years in enterprise front-end', pt: 'anos em front-end empresarial' } },
  {
    value: '3',
    label: { en: 'companies: Frotcom, Celfocus (for Vodafone), Altice Labs', pt: 'empresas: Frotcom, Celfocus (para a Vodafone), Altice Labs' },
  },
  { value: 'ACE', label: { en: 'Adobe Certified Expert, AEM Sites', pt: 'Adobe Certified Expert, AEM Sites' } },
];
