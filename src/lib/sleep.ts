// Sleep diary calculations, ported from the "Fazer o Que Importa" app (SleepDetailView.js / TimeSelect.js)
// so the portfolio demo gives exactly the same results as the real app.

export type Time = { hour: number; min: number };

export interface SleepEntry {
  bed: Time; // went to bed
  tryToSleep: Time; // started trying to sleep
  latencyMin: number; // time to fall asleep
  awakenings: number; // times woken during the night (excluding the final awakening)
  awakeMin: number; // duration of those awakenings
  finalWake: Time;
  outOfBed: Time;
  naps: number;
  medication: boolean; // non-prescribed sleep medication
  quality: number; // 0 (very poor) – 4 (very good)
}

export const qualityLabels = ['Very poor', 'Poor', 'Fair', 'Good', 'Very good'];

/** Minutes from `from` to `to`, wrapping past midnight when the hour goes backwards (same rule as the app). */
function span(from: Time, to: Time) {
  const hours = from.hour > to.hour ? 24 - from.hour + to.hour : to.hour - from.hour;
  return hours * 60 - from.min + to.min;
}

/** Same rule as the app: a time is valid if it's later, or more than 12h "earlier" (i.e. it crossed midnight). */
export function isTimeAfterOrEqual(sel: Time, min: Time) {
  const s = sel.hour * 60 + sel.min;
  const m = min.hour * 60 + min.min;
  return s >= m || m - s > 12 * 60;
}

export function sleepReport(e: SleepEntry) {
  const timeInBed = span(e.bed, e.outOfBed);
  const bedToTry = span(e.bed, e.tryToSleep);
  const wakeToUp = span(e.finalWake, e.outOfBed);
  // Mirrors the app: awakenings × awake duration.
  const awakeInNight = e.awakenings * e.awakeMin;
  const sleepTime = timeInBed - wakeToUp - e.latencyMin - bedToTry - awakeInNight;
  const efficiency = timeInBed === 0 ? 0 : Number(((sleepTime / timeInBed) * 100).toFixed(1));
  const rating: 'good' | 'fair' | 'low' = efficiency >= 85 ? 'good' : efficiency >= 70 ? 'fair' : 'low';
  return { timeInBed, bedToTry, wakeToUp, sleepTime, efficiency, rating };
}

/** "07h 30m", like the app. */
export function formatHM(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.abs(Math.round(minutes % 60));
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
}

export const formatClock = (t: Time) => `${String(t.hour).padStart(2, '0')}:${String(t.min).padStart(2, '0')}`;
