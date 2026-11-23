/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          royal: '#1746A2',
          navy: '#102B59',
          gold: '#E5A900',
          goldHover: '#c79200',
          light: '#F5F7FC',
          darkText: '#202A3A',
          border: '#E5EAF2',
          surface: '#FFFFFF',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(16, 43, 89, 0.06)',
        'card-hover': '0 10px 25px -5px rgba(23, 70, 162, 0.12), 0 8px 10px -6px rgba(16, 43, 89, 0.08)',
      },
    },
  },
  plugins: [],
};
