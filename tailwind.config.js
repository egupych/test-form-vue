/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
      "./public/components/**/*.{js,vue}", // Добавляем путь к вашим компонентам
    ],
    theme: {
      extend: {
        // Здесь можно будет перенести ваши кастомные цвета и шрифты из index.html
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
      },
    },
    plugins: [],
  }
  