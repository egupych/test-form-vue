/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // --- ИЗМЕНЕНИЕ: Добавляем папку pages в сканирование ---
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- ИЗМЕНЕНИЕ: Блок spacing должен быть ВНУТРИ extend ---
      spacing: {
        '15': '3.75rem', // 60px
        '25': '6.25rem', // 100px
      },
      colors: {
        'panda-orange': '#F15F31',
        'panda-black': '#131C26',
        'panda-white': '#FFFFFF',
        'panda-green': '#89C869',
        'light-gray': '#F7F7F7',
        'gray': '#E3E3E3',
        'dark-gray': '#8F8F8F',
      },
      fontFamily: {
        medium: ['Gilroy-Medium', 'sans-serif'],
        semibold: ['Gilroy-SemiBold', 'sans-serif'],
        bold: ['Gilroy-Bold', 'sans-serif'],
      },
      fontSize: {
        'h1-panda': ['64px', { lineHeight: '110%' }],
        'h2-panda': ['48px', { lineHeight: '105%' }],
        'h3-panda': ['32px', { lineHeight: '120%' }],
        'h4-panda': ['24px', { lineHeight: '120%' }],
        'h5-panda': ['20px', { lineHeight: '125%' }],
        'body-panda': ['16px', { lineHeight: '140%' }],
        'small-panda': ['13px', { lineHeight: '120%' }],
        'button-panda': ['16px', { lineHeight: '120%' }],
        'header-panda': ['18px', { lineHeight: '130%' }],
      },
    },
  },
  plugins: [],
}