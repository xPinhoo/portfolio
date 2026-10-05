<script setup lang="ts">
import { nextTick, ref } from 'vue';

// A toy "dev tools console" recreating the EverWing story. Commands are parsed, never evaluated.

type Line = { kind: 'input' | 'output' | 'error' | 'info'; text: string };

const ACHIEVEMENT_AT = 5000;
const MAX_ADD = 1_000_000;

const coins = ref(120);
const shown = ref(120);
const unlocked = ref(false);
const toast = ref(false);
const input = ref('');
const lines = ref<Line[]>([
  { kind: 'info', text: '// EverWing, Messenger, ~2016. This is roughly what I did.' },
  { kind: 'info', text: '// Try: addCoins(1000)  or type help()' },
]);
const logEl = ref<HTMLElement | null>(null);
const inputEl = ref<HTMLInputElement | null>(null);

const suggestions = ['addCoins(1000)', 'addCoins(5000)', 'whoami()', 'help()'];

const commands: Record<string, (arg: string) => Line[] | void> = {
  help: () => [
    { kind: 'output', text: 'addCoins(n)  add n coins to your balance' },
    { kind: 'output', text: 'getCoins()   show your balance' },
    { kind: 'output', text: 'whoami()     who wrote this' },
    { kind: 'output', text: 'clear()      clear the console' },
  ],
  addCoins: (arg) => {
    const n = arg.trim() === '' ? 100 : Number(arg);
    if (!Number.isInteger(n) || n <= 0) {
      return [{ kind: 'error', text: `Uncaught TypeError: addCoins expects a positive integer` }];
    }
    if (n > MAX_ADD) {
      return [{ kind: 'error', text: 'Uncaught RangeError: even a Batoteiro has limits (max 1,000,000)' }];
    }
    coins.value += n;
    tweenCoins();
    const out: Line[] = [{ kind: 'output', text: `✓ +${n.toLocaleString('en')} coins → ${coins.value.toLocaleString('en')}` }];
    if (!unlocked.value && coins.value >= ACHIEVEMENT_AT) {
      unlocked.value = true;
      toast.value = true;
      setTimeout(() => (toast.value = false), 5000);
      out.push({ kind: 'info', text: '🏆 Achievement unlocked: "Batoteiro"' });
    }
    return out;
  },
  getCoins: () => [{ kind: 'output', text: coins.value.toLocaleString('en') }],
  whoami: () => [{ kind: 'output', text: '"Francisco Oliveira, a.k.a. Batoteiro. Front-end developer."' }],
  clear: () => {
    lines.value = [];
  },
};

function run(raw: string) {
  const src = raw.trim();
  if (!src) return;
  lines.value.push({ kind: 'input', text: src });

  const match = src.match(/^([A-Za-z_$][\w$]*)\s*\(([^()]*)\)\s*;?$/);
  if (!match) {
    lines.value.push({ kind: 'error', text: 'Uncaught SyntaxError: try something like addCoins(1000)' });
  } else {
    const [, name, arg] = match;
    const fn = commands[name];
    const out = fn ? fn(arg) : [{ kind: 'error' as const, text: `Uncaught ReferenceError: ${name} is not defined` }];
    if (out) lines.value.push(...out);
  }

  input.value = '';
  nextTick(() => {
    if (logEl.value) logEl.value.scrollTop = logEl.value.scrollHeight;
  });
}

function submit() {
  run(input.value);
}

function suggest(cmd: string) {
  run(cmd);
}

let frame = 0;
function tweenCoins() {
  cancelAnimationFrame(frame);
  const from = shown.value;
  const to = coins.value;
  const start = performance.now();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dur = reduce ? 0 : 700;
  const step = (now: number) => {
    const t = dur ? Math.min(1, (now - start) / dur) : 1;
    shown.value = Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3)));
    if (t < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
}
</script>

<template>
  <div class="console" :class="{ unlocked }">
    <div class="titlebar">
      <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="title">Console</span>
      <span class="coins" aria-live="polite">
        <span class="coin" aria-hidden="true"></span>
        {{ shown.toLocaleString('en') }}
      </span>
    </div>

    <div ref="logEl" class="log" role="log" @click="inputEl?.focus()">
      <p v-for="(line, i) in lines" :key="i" :class="line.kind">
        <span v-if="line.kind === 'input'" class="prompt">›</span>{{ line.text }}
      </p>
      <form class="input-row" @submit.prevent="submit">
        <span class="prompt" aria-hidden="true">›</span>
        <input
          ref="inputEl"
          v-model="input"
          type="text"
          spellcheck="false"
          autocomplete="off"
          autocapitalize="off"
          aria-label="Console input"
          placeholder="addCoins(1000)"
        />
      </form>
    </div>

    <div class="chips">
      <button v-for="s in suggestions" :key="s" type="button" @click="suggest(s)">{{ s }}</button>
    </div>

    <Transition name="pop">
      <div v-if="toast" class="achievement" role="status">
        <span aria-hidden="true">🏆</span>
        <div>
          <strong>Achievement unlocked: Batoteiro</strong>
          <small>No real games were harmed in the making of this console.</small>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
// The console is always dark, like real dev tools.
.console {
  --c-bg: #17181c;
  --c-bar: #222329;
  --c-text: #e6e6e9;
  --c-muted: #8b8e98;
  --c-green: #6cc5a8;
  --c-red: #ff7b72;
  --c-gold: #f2c14e;

  margin: 1.5rem 0 0.5rem;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--c-bg);
  color: var(--c-text);
  font-family: var(--mono);
  font-size: 0.85rem;
  border: 1px solid #2b2d33;
  box-shadow: 0 20px 40px -24px rgb(0 0 0 / 0.5);
  position: relative;
  transition: box-shadow 0.4s;

  &.unlocked {
    box-shadow:
      0 0 0 2px var(--c-gold),
      0 20px 40px -24px rgb(0 0 0 / 0.5);
  }
}

.titlebar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.9rem;
  background: var(--c-bar);
  border-bottom: 1px solid #2b2d33;
}
.dots {
  display: flex;
  gap: 6px;
  i {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ff5f57;
    &:nth-child(2) {
      background: #febc2e;
    }
    &:nth-child(3) {
      background: #28c840;
    }
  }
}
.title {
  color: var(--c-muted);
  flex: 1;
}
.coins {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--c-gold);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.coin {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #ffe08a, var(--c-gold) 55%, #b8860b);
  box-shadow: 0 0 8px rgb(242 193 78 / 0.5);
}

.log {
  height: 190px;
  overflow-y: auto;
  padding: 0.75rem 0.9rem;
  cursor: text;
  p {
    margin: 0 0 0.3rem;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.5;
  }
  .info {
    color: var(--c-muted);
  }
  .output {
    color: var(--c-green);
  }
  .error {
    color: var(--c-red);
  }
}
.prompt {
  color: #5aa9ff;
  margin-right: 0.5rem;
}
.input-row {
  display: flex;
  align-items: center;
  input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: 0;
    outline: none;
    color: var(--c-text);
    font: inherit;
    // 16px keeps iOS Safari from zooming in on focus
    font-size: max(16px, 1em);
    padding: 0;
    &::placeholder {
      color: #4a4d56;
    }
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.6rem 0.9rem 0.8rem;
  border-top: 1px solid #2b2d33;
  button {
    font: inherit;
    font-size: 0.78rem;
    color: var(--c-text);
    background: #24262c;
    border: 1px solid #33363d;
    border-radius: 6px;
    padding: 0.2rem 0.55rem;
    cursor: pointer;
    &:hover {
      border-color: var(--c-green);
      color: var(--c-green);
    }
  }
}

.achievement {
  position: absolute;
  top: 3rem;
  right: 0.75rem;
  left: 0.75rem;
  margin-left: auto;
  max-width: 340px;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  background: #2a2412;
  border: 1px solid var(--c-gold);
  color: var(--c-text);
  font-family: var(--font);
  line-height: 1.35;
  > span {
    font-size: 1.5rem;
  }
  strong {
    display: block;
    font-size: 0.9rem;
    color: var(--c-gold);
    margin-bottom: 0.15rem;
  }
  small {
    display: block;
    font-size: 0.75rem;
    color: var(--c-muted);
  }
}
.pop-enter-active {
  transition:
    transform 0.45s cubic-bezier(0.2, 1.4, 0.4, 1),
    opacity 0.3s;
}
.pop-leave-active {
  transition: opacity 0.4s;
}
.pop-leave-to,
.pop-enter-from {
  transform: translateY(-10px) scale(0.9);
  opacity: 0;
}
</style>
