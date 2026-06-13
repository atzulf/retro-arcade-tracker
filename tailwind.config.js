/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0e2a',
        'bg-secondary': '#111640',
        'bg-tertiary': '#1a2060',
        'accent-orange': '#ff6b00',
        'accent-amber': '#ffaa00',
        'accent-red': '#ff2244',
        'neon-cyan': '#00e5ff',
        'neon-green': '#39ff14',
        'text-primary': '#ffffff',
        'text-dim': '#7a8bbf',
        'border-arcade': '#2a3470',
      },
      fontFamily: {
        'display': ['"Press Start 2P"', 'monospace'],
        'body': ['"VT323"', 'monospace']
      }
    },
  },
  plugins: [],
}
