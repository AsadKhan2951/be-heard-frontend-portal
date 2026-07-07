export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'beheard-black': '#0a0a0a',
        'beheard-card': '#111111',
        'beheard-hover': '#1a1a1a',
        'beheard-border': '#2a2a2a',
        'beheard-lime': '#BFFF00',
        'beheard-text': '#ffffff',
        'beheard-text-secondary': '#999999',
        'beheard-text-tertiary': '#555555'
      },
      spacing: {
        '56px': '56px'
      },
      borderRadius: {
        'beheard': '8px'
      }
    }
  },
  plugins: []
};
