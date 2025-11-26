/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#f5f6f7',
        card: '#ffffff',
        border: '#e5e5e7',
        text: {
          primary: '#1d1d1f',
          secondary: '#86868b',
          tertiary: '#6e6e73',
        },
      },
      borderRadius: {
        'card': '14px',
        'button': '10px',
      },
      boxShadow: {
        'card': '0 8px 20px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 12px 32px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}

