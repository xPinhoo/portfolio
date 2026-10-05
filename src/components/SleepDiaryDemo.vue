<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue';
import {
  formatClock,
  formatHM,
  isTimeAfterOrEqual,
  qualityLabels,
  sleepReport,
  type SleepEntry,
  type Time,
} from '../lib/sleep';

// Interactive copy of the app's 10-step sleep diary. Nothing is stored.

type Kind = 'time' | 'duration' | 'number' | 'boolean' | 'scale';
type Step = {
  key: keyof SleepEntry;
  kind: Kind;
  question: string;
  after?: keyof SleepEntry; // time must be after this answer
};

const steps: Step[] = [
  { key: 'bed', kind: 'time', question: 'What time did you go to bed?' },
  { key: 'tryToSleep', kind: 'time', question: 'What time did you start trying to fall asleep?', after: 'bed' },
  { key: 'latencyMin', kind: 'duration', question: 'How long did it take you to fall asleep?' },
  {
    key: 'awakenings',
    kind: 'number',
    question: 'How many times did you wake up during the night (not counting your final awakening)?',
  },
  { key: 'awakeMin', kind: 'duration', question: 'In total, how long did those awakenings last?' },
  { key: 'finalWake', kind: 'time', question: 'What time was your final awakening?', after: 'tryToSleep' },
  { key: 'outOfBed', kind: 'time', question: 'What time did you get out of bed to start the day?', after: 'finalWake' },
  { key: 'naps', kind: 'number', question: 'How many naps did you take?' },
  { key: 'medication', kind: 'boolean', question: 'Did you take any non-prescribed medication to sleep?' },
  { key: 'quality', kind: 'scale', question: 'How would you rate the quality of your sleep?' },
];

const defaults = (): SleepEntry => ({
  bed: { hour: 23, min: 0 },
  tryToSleep: { hour: 23, min: 15 },
  latencyMin: 20,
  awakenings: 1,
  awakeMin: 15,
  finalWake: { hour: 7, min: 0 },
  outOfBed: { hour: 7, min: 20 },
  naps: 0,
  medication: false,
  quality: 3,
});

const example = (): SleepEntry => ({
  bed: { hour: 23, min: 30 },
  tryToSleep: { hour: 23, min: 45 },
  latencyMin: 35,
  awakenings: 2,
  awakeMin: 20,
  finalWake: { hour: 6, min: 50 },
  outOfBed: { hour: 7, min: 30 },
  naps: 1,
  medication: false,
  quality: 2,
});

const entry = reactive<SleepEntry>(defaults());
const step = ref(-1); // -1 intro, 0..9 questions, 10 report
const direction = ref<'fwd' | 'back'>('fwd');
const error = ref('');
const card = ref<HTMLElement | null>(null);

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
const durations = Array.from({ length: 25 }, (_, i) => i * 5); // 0–120 min, like the app

const current = computed(() => steps[step.value]);
const timeValue = computed(() => entry[current.value.key] as Time);
const isReport = computed(() => step.value === steps.length);
const progress = computed(() => (isReport.value ? 100 : (step.value / steps.length) * 100));
const report = computed(() => sleepReport(entry));

const pad = (n: number) => String(n).padStart(2, '0');

function go(to: number) {
  direction.value = to > step.value ? 'fwd' : 'back';
  error.value = '';
  step.value = to;
  nextTick(() => card.value?.querySelector<HTMLElement>('[data-focus]')?.focus({ preventScroll: true }));
}

function start() {
  Object.assign(entry, defaults());
  go(0);
}

function showExample() {
  Object.assign(entry, example());
  go(steps.length);
}

function next() {
  const s = current.value;
  if (s.kind === 'time' && s.after) {
    if (!isTimeAfterOrEqual(entry[s.key] as Time, entry[s.after] as Time)) {
      error.value = `Invalid time: please pick a time after ${formatClock(entry[s.after] as Time)}.`;
      return;
    }
  }
  // Like the app: no awakenings means no awakening duration, so skip that question.
  if (s.key === 'awakenings' && entry.awakenings === 0) {
    entry.awakeMin = 0;
    return go(step.value + 2);
  }
  go(step.value + 1);
}

function back() {
  let to = Math.max(0, step.value - 1);
  if (steps[to]?.key === 'awakeMin' && entry.awakenings === 0) to -= 1;
  go(to);
}

function setNumber(key: 'awakenings' | 'naps', delta: number) {
  entry[key] = Math.max(0, Math.min(20, entry[key] + delta));
}

// Efficiency ring
const R = 52;
const circumference = 2 * Math.PI * R;
const ringOffset = computed(() => circumference * (1 - Math.max(0, Math.min(100, report.value.efficiency)) / 100));
const ratingText = computed(
  () =>
    ({
      good: 'Good efficiency. A common target is 85% or more.',
      fair: 'Room to improve. A common target is 85% or more.',
      low: 'Low efficiency: a lot of time in bed was spent awake.',
    })[report.value.rating],
);
</script>

<template>
  <div ref="card" class="diary">
    <!-- Intro -->
    <div v-if="step === -1" class="intro">
      <div class="moon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
      </div>
      <h3>Sleep diary</h3>
      <p>Log last night's sleep and get the same report patients see in the app. It takes about a minute.</p>
      <div class="intro-actions">
        <button type="button" class="primary" @click="start">Start</button>
        <button type="button" class="ghost" @click="showExample">See an example night</button>
      </div>
      <small>Nothing you enter is saved or sent anywhere.</small>
    </div>

    <template v-else>
      <!-- Progress -->
      <div class="progress">
        <div class="progress-head">
          <button type="button" class="back" :class="{ hidden: step === 0 }" aria-label="Previous step" @click="back">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <span>{{ isReport ? 'Your report' : `Step ${step + 1} of ${steps.length}` }}</span>
          <span class="spacer"></span>
        </div>
        <div class="track"><div class="fill" :style="{ width: `${progress}%` }"></div></div>
      </div>

      <Transition :name="direction" mode="out-in">
        <!-- Question -->
        <form v-if="!isReport" :key="step" class="question" @submit.prevent="next">
          <h4 tabindex="-1" data-focus>{{ current.question }}</h4>

          <div v-if="current.kind === 'time'" class="time">
            <select v-model.number="timeValue.hour" aria-label="Hour">
              <option v-for="h in hours" :key="h" :value="h">{{ pad(h) }}</option>
            </select>
            <span class="colon">:</span>
            <select v-model.number="timeValue.min" aria-label="Minutes">
              <option v-for="m in minutes" :key="m" :value="m">{{ pad(m) }}</option>
            </select>
          </div>

          <div v-else-if="current.kind === 'duration'" class="time">
            <select v-model.number="entry[current.key]" aria-label="Minutes">
              <option v-for="d in durations" :key="d" :value="d">{{ d }}</option>
            </select>
            <span class="unit">min</span>
          </div>

          <div v-else-if="current.kind === 'number'" class="stepper">
            <button
              type="button"
              aria-label="Decrease"
              :disabled="(entry[current.key] as number) === 0"
              @click="setNumber(current.key as 'awakenings' | 'naps', -1)"
            >
              −
            </button>
            <output aria-live="polite">{{ entry[current.key] }}</output>
            <button type="button" aria-label="Increase" @click="setNumber(current.key as 'awakenings' | 'naps', 1)">+</button>
          </div>

          <div v-else-if="current.kind === 'boolean'" class="choices" role="radiogroup">
            <button
              v-for="opt in [true, false]"
              :key="String(opt)"
              type="button"
              role="radio"
              :aria-checked="entry.medication === opt"
              :class="{ on: entry.medication === opt }"
              @click="entry.medication = opt"
            >
              {{ opt ? 'Yes' : 'No' }}
            </button>
          </div>

          <div v-else-if="current.kind === 'scale'" class="scale" role="radiogroup">
            <button
              v-for="(label, i) in qualityLabels"
              :key="i"
              type="button"
              role="radio"
              :aria-checked="entry.quality === i"
              :class="{ on: entry.quality === i }"
              @click="entry.quality = i"
            >
              <strong>{{ i }}</strong>
              <span>{{ label }}</span>
            </button>
          </div>

          <p v-if="error" class="error" role="alert">{{ error }}</p>

          <button type="submit" class="primary next">
            {{ step === steps.length - 1 ? 'See my report' : 'Next' }}
          </button>
        </form>

        <!-- Report -->
        <div v-else key="report" class="report">
          <h4 tabindex="-1" data-focus class="visually-hidden">Your sleep report</h4>
          <div class="summary">
            <div class="ring" :class="report.rating">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle class="ring-bg" cx="60" cy="60" :r="R" />
                <circle
                  class="ring-fg"
                  cx="60"
                  cy="60"
                  :r="R"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="ringOffset"
                />
              </svg>
              <div class="ring-label">
                <strong>{{ report.efficiency }}%</strong>
                <span>efficiency</span>
              </div>
            </div>
            <div class="stats">
              <div class="stat">
                <span class="label">Time in bed</span>
                <strong>{{ formatHM(report.timeInBed) }}</strong>
              </div>
              <div class="stat">
                <span class="label">Time asleep</span>
                <strong>{{ formatHM(report.sleepTime) }}</strong>
              </div>
              <p class="rating" :class="report.rating">{{ ratingText }}</p>
            </div>
          </div>

          <h5>Timeline</h5>
          <ol class="timeline">
            <li>
              <span class="dot start"></span><b>{{ formatClock(entry.bed) }}</b> Went to bed
            </li>
            <li class="gap">{{ formatHM(report.bedToTry) }}</li>
            <li><span class="dot"></span><b>{{ formatClock(entry.tryToSleep) }}</b> Tried to fall asleep</li>
            <li class="gap">{{ formatHM(entry.latencyMin) }} to fall asleep</li>
            <li><span class="dot sleep"></span><b>{{ formatClock(entry.finalWake) }}</b> Final awakening</li>
            <li class="gap">{{ formatHM(report.wakeToUp) }} until getting up</li>
            <li><span class="dot end"></span><b>{{ formatClock(entry.outOfBed) }}</b> Got up</li>
          </ol>

          <h5>During the night</h5>
          <div class="night">
            <div>
              <strong>{{ entry.awakenings }}</strong><span>times woke up</span>
            </div>
            <div>
              <strong>{{ entry.awakeMin }} min</strong><span>awake in total</span>
            </div>
            <div>
              <strong>{{ entry.naps }}</strong><span>naps</span>
            </div>
          </div>

          <h5>Extra</h5>
          <div class="extra">
            <div>
              <span>Non-prescribed medication</span>
              <span class="pill" :class="{ yes: entry.medication }">{{ entry.medication ? 'Yes' : 'No' }}</span>
            </div>
            <div>
              <span>Sleep quality</span>
              <span class="dots" :aria-label="`${entry.quality} of 4`">
                <i v-for="i in 5" :key="i" :class="{ on: entry.quality >= i - 1 }"></i>
                <em>{{ qualityLabels[entry.quality] }}</em>
              </span>
            </div>
          </div>

          <div class="report-actions">
            <button type="button" class="primary" @click="start">Log another night</button>
            <a class="ghost" href="https://saber-o-que-importa.web.app" target="_blank" rel="noopener">Open the real app ↗</a>
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style scoped lang="scss">
.diary {
  --good: #2f9e6e;
  --fair: #c98a12;
  --low: #d4473f;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background:
    radial-gradient(circle at 100% 0%, color-mix(in srgb, #7c6cf2 14%, transparent), transparent 55%),
    var(--surface);
  padding: 1.5rem;
  min-height: 360px;
}
@mixin dark-ratings {
  --good: #4cc38a;
  --fair: #e0a83a;
  --low: #f0716a;
}
@media (prefers-color-scheme: dark) {
  :global(:root:not([data-theme='light'])) .diary {
    @include dark-ratings;
  }
}
:global(:root[data-theme='dark']) .diary {
  @include dark-ratings;
}

button {
  font: inherit;
  cursor: pointer;
}
.primary,
.ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  transition:
    transform 0.15s,
    border-color 0.2s;
}
.primary {
  border: 0;
  background: var(--accent);
  color: var(--bg);
}
.primary:active {
  transform: scale(0.97);
}
.ghost {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
}
.ghost:hover {
  border-color: var(--accent);
}

/* Intro */
.intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  padding: 1.5rem 0.5rem;
  h3 {
    margin: 0.5rem 0 0;
  }
  p {
    color: var(--muted);
    max-width: 420px;
    margin: 0;
  }
  small {
    color: var(--muted);
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }
}
.moon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, #7c6cf2 18%, transparent);
  animation: float 4s ease-in-out infinite;
  svg {
    width: 30px;
    height: 30px;
    fill: #8f82f7;
  }
}
@keyframes float {
  50% {
    transform: translateY(-5px) rotate(-6deg);
  }
}
.intro-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 1rem;
}

/* Progress */
.progress {
  margin-bottom: 1.5rem;
}
.progress-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 0.5rem;
  span:not(.spacer) {
    flex: 1;
    text-align: center;
  }
  .spacer {
    width: 32px;
  }
}
.back {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  &.hidden {
    visibility: hidden;
  }
  svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}
.track {
  height: 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--muted) 18%, transparent);
  overflow: hidden;
}
.fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #8f82f7, var(--accent));
  transition: width 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
}

/* Question */
.question {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  h4 {
    font-size: 1.2rem;
    line-height: 1.35;
    margin: 0;
    max-width: 460px;
    outline: none;
  }
}
.time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  select {
    appearance: none;
    font: inherit;
    font-family: var(--mono);
    font-size: 2rem;
    font-weight: 500;
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.4rem 0.9rem;
    text-align: center;
    cursor: pointer;
    &:focus-visible {
      border-color: var(--accent);
    }
  }
  .colon {
    font-size: 2rem;
    font-weight: 600;
  }
  .unit {
    font-size: 1.25rem;
    color: var(--muted);
  }
}
.stepper {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text);
    font-size: 1.5rem;
    line-height: 1;
    &:disabled {
      opacity: 0.35;
      cursor: default;
    }
    &:not(:disabled):hover {
      border-color: var(--accent);
    }
  }
  output {
    font-family: var(--mono);
    font-size: 2.5rem;
    font-weight: 600;
    min-width: 2ch;
  }
}
.choices,
.scale {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  button {
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text);
    border-radius: 12px;
    transition:
      background 0.2s,
      border-color 0.2s,
      color 0.2s;
    &.on {
      background: var(--accent);
      border-color: var(--accent);
      color: var(--bg);
    }
  }
}
.choices button {
  min-width: 96px;
  padding: 0.7rem 1rem;
  font-weight: 500;
}
.scale button {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 78px;
  padding: 0.6rem 0.25rem;
  strong {
    font-size: 1.25rem;
  }
  span {
    font-size: 0.72rem;
    line-height: 1.2;
  }
}
.error {
  margin: 0;
  color: var(--low);
  font-size: 0.9rem;
}
.next {
  min-width: 160px;
}

/* Report */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.summary {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.ring {
  position: relative;
  width: 132px;
  height: 132px;
  flex-shrink: 0;
  color: var(--good);
  &.fair {
    color: var(--fair);
  }
  &.low {
    color: var(--low);
  }
  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  circle {
    fill: none;
    stroke-width: 10;
  }
  .ring-bg {
    stroke: color-mix(in srgb, var(--muted) 18%, transparent);
  }
  .ring-fg {
    stroke: currentColor;
    stroke-linecap: round;
    animation: draw 1.2s cubic-bezier(0.2, 0.7, 0.2, 1);
  }
}
@keyframes draw {
  from {
    stroke-dashoffset: 326.7;
  }
}
.ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  strong {
    font-size: 1.6rem;
    line-height: 1;
  }
  span {
    font-size: 0.75rem;
    color: var(--muted);
  }
}
.stats {
  flex: 1;
  min-width: 200px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.stat {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  .label {
    font-size: 0.78rem;
    color: var(--muted);
  }
  strong {
    font-family: var(--mono);
    font-size: 1.15rem;
  }
}
.rating {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--good);
  &.fair {
    color: var(--fair);
  }
  &.low {
    color: var(--low);
  }
}
h5 {
  margin: 1.5rem 0 0.75rem;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}
.timeline {
  list-style: none;
  margin: 0;
  padding: 0 0 0 0.4rem;
  li {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.95rem;
    b {
      font-family: var(--mono);
      font-weight: 600;
    }
  }
  .gap {
    margin-left: 5px;
    padding: 0.35rem 0 0.35rem 1.2rem;
    border-left: 2px dashed var(--border);
    font-size: 0.8rem;
    color: var(--muted);
  }
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--muted);
  flex-shrink: 0;
  &.start {
    background: #8f82f7;
  }
  &.sleep {
    background: var(--accent);
  }
  &.end {
    background: var(--fair);
  }
}
.night {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0.75rem 0.4rem;
    border-radius: 10px;
    background: var(--bg);
    border: 1px solid var(--border);
  }
  strong {
    font-size: 1.3rem;
  }
  span {
    font-size: 0.78rem;
    color: var(--muted);
  }
}
.extra {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    font-size: 0.92rem;
  }
}
.pill {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  color: var(--good);
  background: color-mix(in srgb, var(--good) 15%, transparent);
  &.yes {
    color: var(--low);
    background: color-mix(in srgb, var(--low) 15%, transparent);
  }
}
.dots {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  i {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--muted) 25%, transparent);
    &.on {
      background: #8f82f7;
    }
  }
  em {
    font-style: normal;
    margin-left: 0.4rem;
    font-size: 0.85rem;
    color: var(--muted);
  }
}
.report-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.75rem;
}

/* Step transitions */
.fwd-enter-active,
.fwd-leave-active,
.back-enter-active,
.back-leave-active {
  transition:
    opacity 0.22s,
    transform 0.22s;
}
.fwd-enter-from,
.back-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
.fwd-leave-to,
.back-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

@media (max-width: 480px) {
  .diary {
    padding: 1.1rem;
  }
  .scale {
    gap: 0.3rem;
    button {
      width: 54px;
      span {
        font-size: 0.62rem;
      }
    }
  }
  .time select {
    font-size: 1.6rem;
  }
}
</style>
