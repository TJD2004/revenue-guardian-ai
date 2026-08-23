/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          text: '#0F172A',
          subtext: '#64748B',
          accent: '#4F46E5',
          accentHover: '#4338CA',
          blue: '#0284C7',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          navy: '#0F172A',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
