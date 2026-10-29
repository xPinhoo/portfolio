// Languages: English is the default and lives at the root (/about); Portuguese lives under /pt (/pt/about).

export const langs = ['en', 'pt'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'en';

/** Per-language value, e.g. { en: 'Projects', pt: 'Projetos' }. */
export type L<T = string> = Record<Lang, T>;

export const htmlLang: L = { en: 'en', pt: 'pt-PT' };
export const ogLocale: L = { en: 'en_US', pt: 'pt_PT' };
export const langName: L = { en: 'English', pt: 'Português' };

/** getStaticPaths for pages served in every language, via a `[...lang]` rest param. */
export function langPaths() {
  return langs.map((lang) => ({ params: { lang: lang === defaultLang ? undefined : lang } }));
}

/** Language of the current page, from its URL. */
export const langOf = (url: URL): Lang => (/^\/pt(\/|$)/.test(url.pathname) ? 'pt' : 'en');

/** Prefix a root-relative path for `lang`: href('pt', '/about') → '/pt/about'. */
export function href(lang: Lang, path: string) {
  if (lang === defaultLang) return path;
  return path === '/' ? `/${lang}` : `/${lang}${path}`;
}

/** Strip the language prefix: '/pt/about' → '/about'. */
export function basePath(pathname: string) {
  const stripped = pathname.replace(/^\/pt(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

/** Same page in another language. */
export function switchPath(pathname: string, to: Lang) {
  return href(to, basePath(pathname).replace(/(.)\/$/, '$1'));
}

const months: L<string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
};

/** "Mar 2025" / "Mar 2025" */
export const formatMonth = (d: Date, lang: Lang) => `${months[lang][d.getUTCMonth()]} ${d.getUTCFullYear()}`;

// Strings shared by several components. Page-specific copy lives in the page itself.
export const ui = {
  en: {
    nav: { about: 'About', experience: 'Experience', projects: 'Projects', contact: 'Contact' },
    switchTo: 'Ler em português',
    present: 'Present',
    current: 'Current',
    client: 'client',
    completed: 'Completed',
    inProgress: 'In progress',
    tryLive: '▶ Try it live',
    readMore: 'Read more →',
    portraitOf: (name: string) => `Portrait of ${name}`,
    email: 'Email',
    dur: { yr: ['yr', 'yrs'], mo: ['mo', 'mos'] },
    team: {
      team: 'Team',
      teams: (n: number) => `${n} teams`,
      ledByMe: 'Led by me',
      people: (n: number) => `${n} people`,
      me: 'me',
      meDot: 'Me',
      roles: {
        frontend: ['front-end dev', 'front-end devs'],
        backend: ['back-end dev', 'back-end devs'],
        qa: ['QA', 'QAs'],
        po: ['product owner', 'product owners'],
        sm: ['scrum master', 'scrum masters'],
        'po-sm': ['product owner / scrum master', 'product owners / scrum masters'],
      },
      meRole: { frontend: 'front-end', backend: 'back-end', qa: 'QA', po: 'product owner', sm: 'scrum master', 'po-sm': 'PO / SM' },
      notes: {} as Record<string, string>,
      legend: { fe: 'Front-end', be: 'Back-end', qa: 'QA', pm: 'Product / Scrum' },
    },
    rec: { linkedin: 'View on LinkedIn ↗', original: '' },
    theme: { toLight: 'Switch to light theme', toDark: 'Switch to dark theme' },
  },
  pt: {
    nav: { about: 'Sobre mim', experience: 'Experiência', projects: 'Projetos', contact: 'Contacto' },
    switchTo: 'Read in English',
    present: 'Presente',
    current: 'Atual',
    client: 'cliente',
    completed: 'Concluído',
    inProgress: 'Em curso',
    tryLive: '▶ Experimente',
    readMore: 'Ler mais →',
    portraitOf: (name: string) => `Retrato de ${name}`,
    email: 'Email',
    dur: { yr: ['ano', 'anos'], mo: ['mês', 'meses'] },
    team: {
      team: 'Equipa',
      teams: (n: number) => `${n} equipas`,
      ledByMe: 'Liderada por mim',
      people: (n: number) => `${n} pessoas`,
      me: 'eu',
      meDot: 'Eu',
      roles: {
        frontend: ['dev front-end', 'devs front-end'],
        backend: ['dev back-end', 'devs back-end'],
        qa: ['QA', 'QAs'],
        po: ['product owner', 'product owners'],
        sm: ['scrum master', 'scrum masters'],
        'po-sm': ['product owner / scrum master', 'product owners / scrum masters'],
      },
      meRole: { frontend: 'front-end', backend: 'back-end', qa: 'QA', po: 'product owner', sm: 'scrum master', 'po-sm': 'PO / SM' },
      notes: { junior: 'júnior' } as Record<string, string>,
      legend: { fe: 'Front-end', be: 'Back-end', qa: 'QA', pm: 'Produto / Scrum' },
    },
    rec: { linkedin: 'Ver no LinkedIn ↗', original: 'Original em inglês, tal como no LinkedIn.' },
    theme: { toLight: 'Mudar para tema claro', toDark: 'Mudar para tema escuro' },
  },
} satisfies L<unknown>;

export const t = (lang: Lang) => ui[lang];
