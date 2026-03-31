/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        noto: {
          bg: 'var(--noto-bg)',
          text: 'var(--noto-text)',
          muted: 'var(--noto-muted)'
        }
      }
    }
  },
  plugins: []
}
