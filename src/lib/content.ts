import { getCollection } from 'astro:content';

/** Projects sorted by `order`; drafts only appear in dev. */
export async function getProjects() {
  const all = await getCollection('projects', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Experience, most recent first. */
export async function getExperience() {
  const all = await getCollection('experience');
  return all.sort((a, b) => b.data.start.getTime() - a.data.start.getTime());
}

const fmt = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export function formatPeriod(start: Date, end?: Date) {
  return `${fmt.format(start)} — ${end ? fmt.format(end) : 'Present'}`;
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

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** "3 yrs 9 mos" */
export function formatDuration(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && plural(y, 'yr'), m && plural(m, 'mo')].filter(Boolean).join(' ') || '1 mo';
}

/** "5+ yrs" style rounding for skills. */
export function formatYears(months: number) {
  if (months < 12) return plural(months, 'mo');
  const y = Math.floor(months / 12);
  return `${y}${months % 12 ? '+' : ''} ${y === 1 ? 'yr' : 'yrs'}`;
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
