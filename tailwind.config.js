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
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        fintech: '0 4px 20px -2px rgba(79, 70, 229, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        glow: '0 0 15px rgba(79, 70, 229, 0.25)',
      }
    },
  },
  plugins: [],
}
