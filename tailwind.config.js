/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    // ЗАМЕНА: Мы не используем extend, а полностью переопределяем fontFamily,
    // чтобы сделать Gilroy шрифтом по умолчанию для всего сайта.
    fontFamily: {
      sans: ['Gilroy-Medium', 'sans-serif'], // <--- ОСНОВНОЕ ИЗМЕНЕНИЕ
      semibold: ['Gilroy-SemiBold', 'sans-serif'],
      bold: ['Gilroy-Bold', 'sans-serif'],
    },
    extend: {
      screens: {
        'lg-custom': '1300px',
      },
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
        'panda-black-overlay': 'rgba(19, 28, 38, 0.5)', // 50% прозрачности от panda-black
        'panda-black-overlay-hover': 'rgba(19, 28, 38, 0.65)'
      },
      fontSize: {
        'h1-panda': ['4rem', { lineHeight: '110%' }],
        'h2-panda': ['2.7rem', { lineHeight: '105%' }],
        'h3-panda': ['2rem', { lineHeight: '120%' }],
        'h4-panda': ['1.5rem', { lineHeight: '120%' }],
        'h5-panda': ['1.2rem', { lineHeight: '125%' }],
        'body-panda': ['1rem', { lineHeight: '140%' }],
        'small-panda': ['0.8125rem', { lineHeight: '120%' }],
        'button-panda': ['1rem', { lineHeight: '120%' }],
        'header-panda': ['1.125rem', { lineHeight: '130%' }],
      },
    },
  },
  plugins: [],
}