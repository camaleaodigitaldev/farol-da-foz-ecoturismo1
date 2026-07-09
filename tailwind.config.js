/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1a2b3d',
        'navy-deep': '#12212f',
        'steel': '#22384f',
        gold: '#f2a900',
        'gold-soft': '#f0c257',
        'gold-text': '#a06d00',
        'gold-warm': '#b8862f',
        wa: '#25d366',
        eco: '#0c7b6e',
        'eco-soft': '#2f8f6b',
        cream: '#faf8f3',
        'cream-warm': '#fdf6e6',
        'admin-bg': '#eef1f5',
        muted: '#5c6b7e',
      },
      fontFamily: {
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 16px 38px -30px rgba(26,43,61,.4)',
      },
      maxWidth: {
        content: '1200px',
      },
      keyframes: {
        ffFade: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'none' },
        },
        ffBob: {
          '0%,100%': { transform: 'translate(-50%,0)' },
          '50%': { transform: 'translate(-50%,8px)' },
        },
      },
      animation: {
        ffFade: 'ffFade .6s ease both',
        ffBob: 'ffBob 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
