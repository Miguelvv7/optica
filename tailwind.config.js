/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/js/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pri: '#1B7A6E', 'pri-c': '#1F8272', 'on-pri': '#ffffff', 'on-pri-c': '#EAFAF6',
        sec: '#1B7A6E', 'sec-c': '#EAFAF6', 'on-sec': '#ffffff', 'on-sec-c': '#1B7A6E',
        surf: '#EAFAF6', 'surf-dim': '#BFE2D9', 'surf-lo': '#F3FBF9', 'surf-hi': '#E1F4EC',
        'surf-xhi': '#CDEADF', 'surf-0': '#ffffff', 'on-surf': '#123430', 'on-surf-v': '#3E5B56',
        bg: '#EAFAF6', outline: '#6F8E88', 'outline-v': '#C7E0D9',
        'inv-surf': '#123430', 'inv-pri': '#EAFAF6', 'inv-on': '#EAFAF6',
        err: '#ba1a1a', 'on-err': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      maxWidth: { site: '1200px' },
      boxShadow: {
        card: '0 2px 12px rgba(18,52,48,.07),0 0 0 1px rgba(18,52,48,.04)',
        'card-h': '0 8px 32px rgba(18,52,48,.14),0 0 0 1px rgba(18,52,48,.06)',
        nav: '0 2px 16px rgba(18,52,48,.1)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
