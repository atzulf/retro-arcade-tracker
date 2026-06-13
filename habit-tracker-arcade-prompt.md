# 🕹️ HABIT TRACKER ARCADE — SvelteKit Project Prompt

> **Konsep Utama:** "Life is an RPG." — Sebuah aplikasi produktivitas personal bergaya arcade 8-bit tahun 80an, di mana setiap kebiasaan harian diubah menjadi mekanisme game: coin, streak combo, level up, dan achievement.

---

## 🎯 PROJECT OVERVIEW

**Nama App:** Habit Tracker Arcade (atau bisa dikustomisasi, misal: `PIXEL GRIND`, `8BIT GRIND`, dll)
**Framework:** SvelteKit (dengan Vite)
**Bahasa:** TypeScript
**State Management:** Svelte stores (`writable`, `derived`, `localStorage` persistence)
**Styling:** Tailwind CSS + custom CSS pixel art utilities
**Font:** Google Fonts — `Press Start 2P` (display/heading), `VT323` (body/UI teks)
**Target:** Personal use, single-user, data tersimpan di `localStorage`

---

## 🎨 DESIGN SYSTEM & VISUAL IDENTITY

### Color Palette (Navy & Orange Arcade 80s)

```css
:root {
  --color-bg-primary:     #0a0e2a;  /* Navy gelap, background utama */
  --color-bg-secondary:   #111640;  /* Navy medium, card/panel */
  --color-bg-tertiary:    #1a2060;  /* Navy terang, hover state */
  --color-accent-orange:  #ff6b00;  /* Orange arcade utama */
  --color-accent-amber:   #ffaa00;  /* Amber/gold untuk coin & XP */
  --color-accent-red:     #ff2244;  /* Merah untuk health/danger */
  --color-neon-cyan:      #00e5ff;  /* Cyan untuk streak & highlight */
  --color-neon-green:     #39ff14;  /* Neon green untuk sukses */
  --color-text-primary:   #ffffff;  /* Putih */
  --color-text-dim:       #7a8bbf;  /* Teks sekunder */
  --color-border:         #2a3470;  /* Border panel */
  --color-scanline:       rgba(0, 0, 0, 0.15); /* Efek scanline CRT */
}
```

### Typography

```css
/* Display / Heading besar */
font-family: 'Press Start 2P', monospace; /* ukuran: 8px–24px, karena font ini besar */

/* Body, label, angka UI */
font-family: 'VT323', monospace; /* ukuran: 16px–32px */
```

### Pixel Art Utilities (tambahkan ke global CSS)

```css
/* Efek scanline CRT di atas seluruh halaman */
.crt-overlay::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    var(--color-scanline) 0px,
    var(--color-scanline) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 9999;
}

/* Border gaya pixel (tidak rounded) */
.pixel-border {
  border: 2px solid var(--color-accent-orange);
  box-shadow: 0 0 0 2px var(--color-bg-primary), 0 0 0 4px var(--color-accent-orange);
  border-radius: 0;
}

/* Panel/card gaya arcade */
.arcade-panel {
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  box-shadow: inset 0 0 20px rgba(255, 107, 0, 0.05),
              0 0 10px rgba(255, 107, 0, 0.2);
}

/* Teks glow neon */
.neon-text-orange { text-shadow: 0 0 10px var(--color-accent-orange), 0 0 20px var(--color-accent-orange); }
.neon-text-cyan   { text-shadow: 0 0 10px var(--color-neon-cyan),   0 0 20px var(--color-neon-cyan); }
.neon-text-green  { text-shadow: 0 0 10px var(--color-neon-green),  0 0 20px var(--color-neon-green); }

/* Animasi blink teks arcade */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
.blink { animation: blink 1s step-start infinite; }

/* Animasi pixel pop (muncul saat dapat reward) */
@keyframes pixel-pop {
  0%   { transform: scale(0) translateY(0); opacity: 1; }
  80%  { transform: scale(1.2) translateY(-30px); opacity: 1; }
  100% { transform: scale(1) translateY(-50px); opacity: 0; }
}
.pixel-pop { animation: pixel-pop 0.8s ease-out forwards; }

/* Coin spin animation */
@keyframes coin-spin {
  0%   { transform: scaleX(1); }
  50%  { transform: scaleX(0.1); }
  100% { transform: scaleX(1); }
}
.coin-spin { animation: coin-spin 0.6s ease-in-out; }
```

---

## 📁 STRUKTUR FOLDER SVELTEKIT

```
src/
├── app.html
├── app.css                          # Global styles, CSS variables, pixel utilities
├── lib/
│   ├── stores/
│   │   ├── player.ts                # Store: level, XP, coin, HP, nama player
│   │   ├── habits.ts                # Store: daftar habit, streak, completion
│   │   ├── tasks.ts                 # Store: task harian per tanggal (kalender)
│   │   ├── achievements.ts          # Store: daftar & status achievement
│   │   ├── pomodoro.ts              # Store: timer pomodoro, sesi aktif
│   │   └── notifications.ts         # Store: antrian notifikasi/toast pixel
│   ├── components/
│   │   ├── ui/
│   │   │   ├── PixelButton.svelte   # Tombol bergaya arcade pixel
│   │   │   ├── PixelCard.svelte     # Panel/card arcade
│   │   │   ├── ProgressBar.svelte   # XP / HP bar bergaya RPG
│   │   │   ├── CoinDisplay.svelte   # Animasi coin counter
│   │   │   ├── Toast.svelte         # Notifikasi popup pixel art
│   │   │   └── Modal.svelte         # Dialog pixel art
│   │   ├── player/
│   │   │   ├── PlayerHUD.svelte     # Header: nama, level, XP bar, coin, HP
│   │   │   └── LevelUpScreen.svelte # Overlay animasi level up
│   │   ├── habits/
│   │   │   ├── HabitCard.svelte     # Satu item habit dengan streak & complete btn
│   │   │   ├── HabitForm.svelte     # Form tambah/edit habit
│   │   │   └── StreakCounter.svelte # Animasi streak combo
│   │   ├── tasks/
│   │   │   ├── CalendarGrid.svelte  # Grid kalender bulanan pixel
│   │   │   ├── DayTaskList.svelte   # List task untuk tanggal yang dipilih
│   │   │   └── TaskItem.svelte      # Satu item task dengan checkbox pixel
│   │   ├── pomodoro/
│   │   │   ├── PomodoroTimer.svelte # Timer digital bergaya arcade
│   │   │   └── SessionLog.svelte    # Log sesi pomodoro hari ini
│   │   └── achievements/
│   │       ├── AchievementCard.svelte  # Badge achievement (locked/unlocked)
│   │       └── AchievementUnlock.svelte # Animasi unlock achievement
│   ├── utils/
│   │   ├── xp.ts                    # Kalkulasi XP, level threshold, coin reward
│   │   ├── streak.ts                # Logic streak & combo multiplier
│   │   ├── achievements.ts          # Definisi & cek kondisi achievement
│   │   ├── storage.ts               # localStorage read/write helpers
│   │   └── date.ts                  # Helper tanggal untuk kalender & task
│   └── types/
│       └── index.ts                 # TypeScript interfaces & types
└── routes/
    ├── +layout.svelte               # Root layout: HUD, CRT overlay, sidebar nav
    ├── +page.svelte                 # Dashboard utama (homepage)
    ├── habits/
    │   └── +page.svelte             # Halaman manajemen habit
    ├── calendar/
    │   └── +page.svelte             # Halaman kalender & task
    ├── pomodoro/
    │   └── +page.svelte             # Halaman pomodoro timer
    └── achievements/
        └── +page.svelte             # Halaman hall of fame achievement
```

---

## 🗄️ DATA TYPES (`src/lib/types/index.ts`)

```typescript
export interface Player {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  coins: number;
  hp: number;
  maxHp: number;
  weeklyXp: number;          // reset tiap Senin
  createdAt: string;         // ISO date string
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;              // emoji atau nama pixel icon
  category: 'health' | 'learning' | 'work' | 'social' | 'custom';
  frequency: 'daily' | 'weekdays' | 'weekends' | 'custom';
  customDays?: number[];     // 0=Minggu, 1=Senin, ..., 6=Sabtu
  coinReward: number;        // coin didapat saat selesai
  xpReward: number;          // XP didapat saat selesai
  streak: number;            // hari berturut-turut
  bestStreak: number;
  completedDates: string[];  // array ISO date string
  createdAt: string;
  isActive: boolean;
}

export interface Task {
  id: string;
  date: string;              // ISO date string (YYYY-MM-DD)
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'boss';  // boss = urgent
  coinReward: number;
  xpReward: number;
  completed: boolean;
  completedAt?: string;
  linkedHabitId?: string;    // opsional: terhubung ke habit tertentu
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;              // emoji
  category: 'streak' | 'coins' | 'level' | 'tasks' | 'pomodoro' | 'special';
  condition: AchievementCondition;
  xpReward: number;
  coinReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AchievementCondition {
  type: 'streak' | 'total_coins' | 'level' | 'tasks_completed' |
        'pomodoro_sessions' | 'habits_completed' | 'days_active';
  value: number;
  habitId?: string;          // jika kondisi spesifik ke satu habit
}

export interface PomodoroSession {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration: number;          // menit (default 25)
  breakDuration: number;     // menit (default 5)
  completed: boolean;
  linkedTaskId?: string;
  linkedHabitId?: string;
  coinReward: number;
  xpReward: number;
}

export interface PomodoroConfig {
  workDuration: number;      // default: 25
  shortBreak: number;        // default: 5
  longBreak: number;         // default: 15
  sessionsBeforeLongBreak: number; // default: 4
}

export interface Notification {
  id: string;
  type: 'coin' | 'xp' | 'level_up' | 'achievement' | 'streak' | 'combo';
  message: string;
  value?: number;
  duration: number;          // ms
}
```

---

## 🧠 GAME MECHANICS & LOGIC

### XP & Level System

```typescript
// src/lib/utils/xp.ts

// XP yang dibutuhkan untuk naik ke level berikutnya
// Formula: setiap level butuh 100 * level XP
export function xpForNextLevel(level: number): number {
  return level * 100;
}

// Cek apakah player perlu level up, return level baru
export function checkLevelUp(player: Player): { leveled: boolean; newLevel: number } {
  let { level, xp } = player;
  let leveled = false;
  while (xp >= xpForNextLevel(level)) {
    xp -= xpForNextLevel(level);
    level++;
    leveled = true;
  }
  return { leveled, newLevel: level };
}

// Reward coin berdasarkan prioritas task
export const TASK_COIN_REWARDS = {
  low: 5, medium: 10, high: 20, boss: 50
};
export const TASK_XP_REWARDS = {
  low: 10, medium: 20, high: 40, boss: 100
};

// Habit reward defaults
export const HABIT_BASE_COIN = 10;
export const HABIT_BASE_XP   = 15;

// Pomodoro reward
export const POMODORO_COIN   = 15;
export const POMODORO_XP     = 25;
```

### Streak & Combo System

```typescript
// src/lib/utils/streak.ts

// Multiplier coin & XP berdasarkan streak
export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 3.0;   // 🔥🔥🔥 LEGENDARY
  if (streak >= 14) return 2.5;   // 🔥🔥 EPIC
  if (streak >= 7)  return 2.0;   // 🔥 GREAT
  if (streak >= 3)  return 1.5;   // ⚡ COMBO
  return 1.0;
}

export function getStreakLabel(streak: number): string {
  if (streak >= 30) return 'LEGENDARY STREAK!';
  if (streak >= 14) return 'EPIC COMBO!';
  if (streak >= 7)  return 'ON FIRE!';
  if (streak >= 3)  return 'COMBO x' + streak + '!';
  return '';
}

// Cek apakah habit sudah diselesaikan hari ini
export function isCompletedToday(habit: Habit): boolean {
  const today = new Date().toISOString().split('T')[0];
  return habit.completedDates.includes(today);
}

// Cek apakah streak masih valid (tidak skip sehari)
export function isStreakValid(habit: Habit): boolean {
  if (habit.completedDates.length === 0) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  return habit.completedDates.includes(yStr) || habit.completedDates.includes(today);
}
```

### Achievement Definitions

```typescript
// src/lib/utils/achievements.ts
export const ACHIEVEMENTS: Achievement[] = [
  // STREAK
  { id: 'streak_3',  name: 'COMBO STARTER', description: '3 hari streak!',   icon: '⚡', category: 'streak',   condition: { type: 'streak', value: 3  }, xpReward: 50,  coinReward: 30,  rarity: 'common',    unlocked: false },
  { id: 'streak_7',  name: 'WEEK WARRIOR',  description: '7 hari streak!',   icon: '🔥', category: 'streak',   condition: { type: 'streak', value: 7  }, xpReward: 100, coinReward: 70,  rarity: 'rare',      unlocked: false },
  { id: 'streak_14', name: 'EPIC GRINDER',  description: '14 hari streak!',  icon: '💎', category: 'streak',   condition: { type: 'streak', value: 14 }, xpReward: 200, coinReward: 150, rarity: 'epic',      unlocked: false },
  { id: 'streak_30', name: 'LEGENDARY',     description: '30 hari streak!',  icon: '👑', category: 'streak',   condition: { type: 'streak', value: 30 }, xpReward: 500, coinReward: 500, rarity: 'legendary', unlocked: false },
  // LEVEL
  { id: 'level_5',   name: 'LEVEL 5 HERO',  description: 'Capai level 5!',   icon: '⚔️', category: 'level',    condition: { type: 'level', value: 5   }, xpReward: 100, coinReward: 100, rarity: 'common',    unlocked: false },
  { id: 'level_10',  name: 'VETERAN',        description: 'Capai level 10!',  icon: '🛡️', category: 'level',    condition: { type: 'level', value: 10  }, xpReward: 200, coinReward: 200, rarity: 'rare',      unlocked: false },
  // COINS
  { id: 'coins_100', name: 'COIN COLLECTOR', description: '100 coin terkumpul!', icon: '🪙', category: 'coins', condition: { type: 'total_coins', value: 100 }, xpReward: 50, coinReward: 0, rarity: 'common', unlocked: false },
  // TASKS
  { id: 'tasks_10',  name: 'TASK SLAYER',    description: 'Selesaikan 10 task!', icon: '✅', category: 'tasks', condition: { type: 'tasks_completed', value: 10 }, xpReward: 80, coinReward: 50, rarity: 'common', unlocked: false },
  // POMODORO
  { id: 'pomo_10',   name: 'FOCUS MASTER',   description: '10 sesi pomodoro!',  icon: '🍅', category: 'pomodoro', condition: { type: 'pomodoro_sessions', value: 10 }, xpReward: 100, coinReward: 80, rarity: 'rare', unlocked: false },
  // SPECIAL
  { id: 'first_habit', name: 'GAME START',   description: 'Buat habit pertama!', icon: '🎮', category: 'special', condition: { type: 'habits_completed', value: 1 }, xpReward: 30, coinReward: 20, rarity: 'common', unlocked: false },
];
```

---

## 📺 HALAMAN & KOMPONEN DETAIL

### 1. Root Layout (`+layout.svelte`)

- **CRT Overlay:** `div.crt-overlay` fixed di atas segalanya dengan efek scanline
- **Sidebar Navigation:** Ikon pixel untuk tiap route (🏠 Dashboard, 🎯 Habits, 📅 Calendar, 🍅 Pomodoro, 🏆 Achievements)
- **Player HUD (header):**
  - Nama player (font Press Start 2P, warna orange neon)
  - Level badge (kotak pixel border orange)
  - XP Bar: bar bergaya RPG, warna amber, animasi fill saat XP bertambah
  - HP Bar: warna merah (berkurang jika habit di-skip sehari)
  - Coin counter: animasi coin spin saat bertambah

### 2. Dashboard (`+page.svelte`)

Layout split:
- **Kiri (60%):**
  - Greeting: `"PLAYER: [NAMA]"` dengan teks blink
  - Summary stats: Total habits aktif, task hari ini, streak terpanjang
  - Habit list hari ini (habits yang perlu dikerjakan hari ini)
  - Quick complete button per habit

- **Kanan (40%):**
  - Coin & XP summary minggu ini
  - Pomodoro widget mini (start timer langsung dari dashboard)
  - 3 achievement terakhir yang di-unlock
  - "TODAY'S QUEST LOG" — task hari ini berdasarkan kalender

### 3. Habits Page (`/habits`)

- **Header:** "HABIT QUEST BOARD" dengan efek neon orange
- **Tombol "ADD HABIT":** pixel button, buka modal form
- **Habit Cards:** grid 2 kolom, setiap card berisi:
  - Icon + nama habit (Press Start 2P)
  - Streak counter dengan animasi fire emoji
  - Progress: berapa hari dari 7 hari terakhir diselesaikan (7 kotak pixel = tiap kotak = 1 hari)
  - Coin & XP reward yang akan didapat
  - Tombol **"COMPLETE"** → trigger animasi coin pop + XP pop
  - Tombol edit & delete (ikon pixel)
- **Saat COMPLETE diklik:**
  1. Tombol berubah jadi "DONE ✓" (warna neon green)
  2. Muncul floating text "+10 COIN" dan "+15 XP" (animasi pixel-pop ke atas)
  3. Streak counter bertambah + animasi
  4. Jika streak milestone (3/7/14/30) → muncul combo banner
  5. Player store di-update (coin, XP, cek level up)
  6. Cek achievement unlock

### 4. Calendar Page (`/calendar`)

- **Header:** "QUEST CALENDAR" 
- **Calendar Grid:**
  - Grid 7 kolom (Minggu–Sabtu) dengan hari sebagai pixel square
  - Hari yang punya task: border orange
  - Hari yang semua task selesai: background neon green dim
  - Hari aktif (dipilih): border cyan, glow effect
  - Hari ini: pixel marker khusus

- **Task Panel (kanan/bawah):** muncul saat tanggal diklik
  - Header: "QUESTS - [TANGGAL]"
  - List task dengan checkbox pixel (□ → ■)
  - Priority badge: LOW (abu), MEDIUM (orange), HIGH (merah), BOSS (merah + blink)
  - Tombol "ADD QUEST" → form task baru

- **Saat task di-complete:**
  - Checkbox ter-check dengan animasi pixel flip
  - Floating reward text muncul
  - Coin & XP ditambahkan ke player

### 5. Pomodoro Page (`/pomodoro`)

Layout:
- **Timer Display (tengah atas):**
  - Tampilan digital besar bergaya 7-segment display: `25:00`
  - Font VT323, ukuran sangat besar (min 80px)
  - Warna: orange saat work, cyan saat break
  - Glow effect sesuai mode
  - Label mode: `"FOCUS MODE"` / `"BREAK TIME"` / `"LONG BREAK"`

- **Controls:**
  - Tombol START / PAUSE / RESET bergaya arcade pixel button
  - Tombol pilih task/habit yang sedang dikerjakan (opsional)

- **Session Tracker:**
  - 4 tomat pixel (🍅) — terisi satu per satu setiap sesi selesai
  - Setelah 4 tomat → long break otomatis

- **Config Panel (collapsible):**
  - Slider atau input untuk durasi work, short break, long break

- **Today's Session Log:**
  - List sesi hari ini: waktu mulai, durasi, task yang dikerjakan
  - Total sesi hari ini + total coin & XP dari pomodoro

- **Saat timer habis:**
  - Efek flash screen (background berkedip)
  - Sound (Web Audio API: beep 8-bit sederhana)
  - Toast notifikasi pixel: "FOCUS COMPLETE! +15 COIN +25 XP"

### 6. Achievements Page (`/achievements`)

- **Header:** `"🏆 HALL OF FAME"` dengan efek glow gold/amber
- **Stats bar:** Total achievement unlocked / total
- **Filter tabs:** ALL | STREAK | LEVEL | COINS | TASKS | POMODORO | SPECIAL
- **Achievement Grid:** grid 3–4 kolom
  - **Unlocked card:** border gold, icon berwarna, nama + deskripsi jelas, tanggal unlock, rarity badge
  - **Locked card:** grayscale, icon tersembunyi (🔒), hint deskripsi dikaburi ("??? ??? ???")
  - **Rarity border colors:** Common=abu, Rare=biru, Epic=purple, Legendary=gold+glow

- **Saat achievement di-unlock (kapanpun di app):**
  - Full-screen overlay muncul di tengah (z-index tinggi)
  - Animasi: kotak pixel muncul dari tengah membesar
  - Teks: `"ACHIEVEMENT UNLOCKED!"` blink
  - Nama achievement + icon besar
  - Reward yang didapat: coin + XP
  - Tombol "NICE!" untuk dismiss

---

## ⚙️ STATE MANAGEMENT (Svelte Stores)

### Player Store (`src/lib/stores/player.ts`)

```typescript
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { Player } from '$lib/types';

const DEFAULT_PLAYER: Player = {
  name: 'PLAYER 1',
  level: 1, xp: 0, xpToNextLevel: 100, totalXp: 0,
  coins: 0, hp: 100, maxHp: 100,
  weeklyXp: 0, createdAt: new Date().toISOString()
};

function createPlayerStore() {
  const stored = browser ? localStorage.getItem('player') : null;
  const initial: Player = stored ? JSON.parse(stored) : DEFAULT_PLAYER;
  const { subscribe, update, set } = writable<Player>(initial);

  return {
    subscribe,
    addXP: (amount: number) => update(p => {
      // ... logic level up
    }),
    addCoin: (amount: number) => update(p => ({ ...p, coins: p.coins + amount })),
    takeDamage: (amount: number) => update(p => ({ ...p, hp: Math.max(0, p.hp - amount) })),
    heal: (amount: number) => update(p => ({ ...p, hp: Math.min(p.maxHp, p.hp + amount) })),
    setName: (name: string) => update(p => ({ ...p, name })),
    reset: () => set(DEFAULT_PLAYER)
  };
}

export const player = createPlayerStore();

// Auto-persist ke localStorage
if (browser) {
  player.subscribe(val => localStorage.setItem('player', JSON.stringify(val)));
}
```

---

## 🔊 AUDIO (8-bit Sound Effects)

Gunakan **Web Audio API** untuk generate suara 8-bit sederhana tanpa file audio eksternal:

```typescript
// src/lib/utils/audio.ts
export function playBeep(freq = 440, duration = 0.1, type: OscillatorType = 'square') {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

// Preset suara game
export const sounds = {
  complete:    () => { playBeep(523, 0.1); setTimeout(() => playBeep(659, 0.1), 100); setTimeout(() => playBeep(784, 0.2), 200); },
  coin:        () => { playBeep(988, 0.05); setTimeout(() => playBeep(1319, 0.1), 60); },
  levelUp:     () => { [523,659,784,1047].forEach((f,i) => setTimeout(() => playBeep(f, 0.15), i*120)); },
  achievement: () => { [392,523,659,784,1047].forEach((f,i) => setTimeout(() => playBeep(f, 0.12), i*100)); },
  pomoDone:    () => { [880,880,880,1047].forEach((f,i) => setTimeout(() => playBeep(f, i===3?0.4:0.1), i*200)); },
  error:       () => { playBeep(200, 0.3, 'sawtooth'); },
};
```

---

## 📦 DEPENDENCIES (`package.json`)

```json
{
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "svelte": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "typescript": "^5.0.0",
    "vite": "^6.0.0"
  },
  "dependencies": {
    "date-fns": "^3.0.0"
  }
}
```

**Google Fonts (tambahkan di `app.html` `<head>`):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap" rel="stylesheet">
```

---

## 🚀 URUTAN IMPLEMENTASI (Build Order)

Ikuti urutan ini agar tidak stuck:

1. **Setup project** — SvelteKit + Tailwind + font + CSS variables + CRT overlay
2. **Types & utils** — `types/index.ts`, `utils/xp.ts`, `utils/streak.ts`, `utils/storage.ts`
3. **Stores** — `player.ts`, `habits.ts`, `tasks.ts`, `achievements.ts`, `pomodoro.ts`
4. **UI components** — `PixelButton`, `PixelCard`, `ProgressBar`, `Toast`, `Modal`
5. **Layout** — sidebar nav + Player HUD
6. **Dashboard** — halaman utama dengan habit hari ini + stats
7. **Habits page** — CRUD habit + complete mechanic + animasi reward
8. **Calendar page** — grid kalender + task CRUD + complete task
9. **Pomodoro page** — timer logic + session log + 8-bit sound
10. **Achievements page** — grid + unlock overlay animasi
11. **Polish** — animasi level up, CRT scanline, audio, responsive

---

## 📝 CATATAN PENTING

- **Semua data disimpan di `localStorage`** — tidak perlu backend/database
- **Tidak ada autentikasi** — ini aplikasi personal single-user
- **Responsive:** prioritas desktop, tapi pastikan mobile tetap usable
- **Accessibility:** meski desain retro, tetap pakai `aria-label` pada tombol icon
- **`adapter-static`** digunakan agar bisa di-deploy ke Netlify/Vercel/GitHub Pages
- **Hapus data:** tambahkan tombol "RESET SAVE FILE" di settings/profil untuk menghapus semua localStorage
- **Weekly Reset:** setiap Senin, `weeklyXp` di-reset ke 0 dan level up mingguan dihitung

---

*Generated for: Habit Tracker Arcade — "Life is an RPG" | Stack: SvelteKit + TypeScript + Tailwind | Theme: Navy & Orange Arcade 80s*
