/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Geist Variable"', 'Geist', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Fraunces', 'Instrument Serif', 'Georgia', 'serif'],
        mono: [
          '"Geist Mono Variable"',
          '"Geist Mono"',
          'ui-monospace',
          'JetBrains Mono',
          'monospace',
        ],
      },
      colors: {
        // Surfaces — warm cream
        bg: '#FBF7F0', // base background
        surface: '#FFFFFF', // elevated surface
        subtle: '#F4EDE0', // sunken (was #F8FAFC)
        subtle2: '#EFE7D6', // muted
        border: '#E6DCC6',
        'border-strong': '#D4C8AD',

        // Text — earth tones (mapped to old names)
        text: '#2A1F17', // ink (was slate-900)
        'text-sec': '#4A3A2C', // ink-2
        muted: '#7A6A58', // ink-3

        // Brand — terracotta accent (mapped to "primary")
        primary: {
          DEFAULT: '#C2410C',
          dark: '#A8370A', // hover
          soft: '#F4D9C5',
          tint: '#FBE9DC',
        },

        // Semantic — warm palette
        amber: { DEFAULT: '#B6862C', soft: '#F3E4C1' }, // warn
        red: { DEFAULT: '#A14040', soft: '#EFD2CB' }, // danger
        green: { DEFAULT: '#4A7C4E', soft: '#D8E4D4' }, // success
        blue: { DEFAULT: '#4A6A7C', soft: '#D0DDE4' }, // info
        violet: { DEFAULT: '#7A5C8C', soft: '#E5DDF0' }, // kept for variety
      },
      letterSpacing: {
        tightish: '-0.02em',
        tighter2: '-0.025em',
        tightest: '-0.03em',
      },
      borderRadius: {
        card: '14px',
      },
      keyframes: {
        ping2: {
          '0%': { transform: 'scale(0.85)', opacity: '0.85' },
          '75%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        ping2: 'ping2 1.8s cubic-bezier(0,0,0.2,1) infinite',
      },
      boxShadow: {
        card: '0 1px 2px rgba(42, 31, 23, 0.06), 0 1px 0 rgba(42, 31, 23, 0.03)',
        glow: '0 8px 22px -10px rgba(194, 65, 12, 0.6)',
        'glow-soft': '0 4px 14px rgba(42, 31, 23, 0.08)',
      },
    },
  },
  plugins: [],
}
