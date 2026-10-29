import { getCollection, type CollectionEntry } from 'astro:content';
import { formatMonth, t, type Lang } from '../i18n';

// Entries keep the English data and get the Portuguese text merged in; `source` is the entry to render().

/** Projects sorted by `order`; drafts only appear in dev. */
export async function getProjects(lang: Lang = 'en') {
  const all = await getCollection('projects', ({ data }) => import.meta.env.DEV || !data.draft);
  const pt = lang === 'pt' ? await getCollection('projectsPt') : [];
  return all
    .sort((a, b) => a.data.order - b.data.order)
    .map((p) => {
      const tr = pt.find((x) => x.id === p.id);
      const data = tr ? { ...p.data, ...strip(tr.data) } : p.data;
      return { ...p, data, source: (tr ?? p) as CollectionEntry<'projects' | 'projectsPt'> };
    });
}
export type Project = Awaited<ReturnType<typeof getProjects>>[number];

/** Experience, most recent first. */
export async function getExperience(lang: Lang = 'en') {
  const all = await getCollection('experience');
  const pt = lang === 'pt' ? await getCollection('experiencePt') : [];
  return all
    .sort((a, b) => b.data.start.getTime() - a.data.start.getTime())
    .map((job) => {
      const tr = pt.find((x) => x.id === job.id);
      if (!tr) return { ...job, source: job as CollectionEntry<'experience' | 'experiencePt'> };
      const { recommendations, teams, ...text } = strip(tr.data);
      const data = {
        ...job.data,
        ...text,
        recommendations: job.data.recommendations.map((r, i) => ({ ...r, ...recommendations?.[i] })),
        teams: job.data.teams.map((team, i) => ({ ...team, ...strip(teams?.[i] ?? {}) })),
      };
      return { ...job, data, source: tr as CollectionEntry<'experience' | 'experiencePt'> };
    });
}
export type Job = Awaited<ReturnType<typeof getExperience>>[number];

/** Drop undefined keys so they don't overwrite the English values. */
function strip<T extends object>(o: T) {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
}

export function formatPeriod(start: Date, end: Date | undefined, lang: Lang = 'en') {
  return `${formatMonth(start, lang)} — ${end ? formatMonth(end, lang) : t(lang).present}`;
}

// --- Durations -----------------------------------------------------------------
// Jobs are tracked by month; both the start and end months count (Jul 2019 – Jun 2021 = 24 months).

const monthIndex = (d: Date) => d.getUTCFullYear() * 12 + d.getUTCMonth();

/** Inclusive list of month indexes a job covers; ongoing jobs run to the current month. */
export function jobMonthRange(start: Date, end?: Date) {
  const from = monthIndex(start);
  const to = monthIndex(end ?? new Date());
  return Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
}

export function monthsBetween(start: Date, end?: Date) {
  return jobMonthRange(start, end).length;
}

const plural = (n: number, [one, many]: string[]) => `${n} ${n === 1 ? one : many}`;

/** "3 yrs 9 mos" / "3 anos 9 meses" */
export function formatDuration(months: number, lang: Lang = 'en') {
  const { yr, mo } = t(lang).dur;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && plural(y, yr), m && plural(m, mo)].filter(Boolean).join(' ') || plural(1, mo);
}

/** "5+ yrs" style rounding for skills. */
export function formatYears(months: number, lang: Lang = 'en') {
  const { yr, mo } = t(lang).dur;
  if (months < 12) return plural(months, mo);
  const y = Math.floor(months / 12);
  return `${y}${months % 12 ? '+' : ''} ${y === 1 ? yr[0] : yr[1]}`;
}

/** Months of experience with any of `techs`, without double-counting overlapping jobs. */
export function skillMonths(jobs: { data: { start: Date; end?: Date; technologies: string[] } }[], techs: string[]) {
  const months = new Set<number>();
  for (const job of jobs) {
    if (job.data.technologies.some((t) => techs.includes(t))) {
      jobMonthRange(job.data.start, job.data.end).forEach((m) => months.add(m));
    }
  }
  return months.size;
}
