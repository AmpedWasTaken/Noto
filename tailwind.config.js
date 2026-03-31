/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        noto: {
          bg: 'var(--noto-bg)',
          surface: 'var(--noto-surface)',
          text: 'var(--noto-text)',
          muted: 'var(--noto-muted)'
        }
      },
      boxShadow: {
        noto: '0 12px 40px rgba(0, 0, 0, 0.35)'
      }
    }
  },
  plugins: []
}
