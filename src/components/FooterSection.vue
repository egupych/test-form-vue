<script setup>
import { ref } from 'vue';

const isMapExpanded = ref(false);

const redPandaLogoSvg = `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#FFFFFF"/>
        <path d="M20 6C14.477 6 10 10.477 10 16C10 21.523 14.477 26 20 26C25.523 26 30 21.523 30 16C30 10.477 25.523 6 20 6ZM20 23C15.582 23 12 19.418 12 15C12 10.582 15.582 7 20 7C24.418 7 28 10.582 28 15C28 19.418 24.418 23 20 23Z" fill="#F15F31"/>
        <path d="M20 12C17.79 12 16 13.79 16 16C16 18.21 17.79 20 20 20C22.21 20 24 18.21 24 16C24 13.79 22.21 12 20 12ZM20 18C18.895 18 18 17.105 18 16C18 14.895 18.895 14 20 14C21.105 14 22 14.895 22 16C22 17.105 21.105 18 20 18Z" fill="#131C26"/>
        <circle cx="17" cy="13" r="1" fill="#131C26"/>
        <circle cx="23" cy="13" r="1" fill="#131C26"/>
        <path d="M20 19.5C19.17 19.5 18.5 19.17 18.5 18.5C18.5 17.83 19.17 17.5 20 17.5C20.83 17.5 21.5 17.83 21.5 18.5C21.5 19.17 20.83 19.5 20 19.5Z" fill="#131C26"/>
        <path d="M15 20C15 20.55 15.45 21 16 21H24C24.55 21 25 20.55 25 20V20C25 19.45 24.55 19 24 19H16C15.45 19 15 19.45 15 20V20Z" fill="#131C26"/>
    </svg>
`;
</script>

<template>
    <footer class="w-full bg-panda-black text-light-gray py-12 px-8">
        <div class="max-w-5xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-stretch relative z-10">
            <!-- Левая колонка -->
            <div class="flex flex-col items-start mb-8 lg:mb-0 lg:w-1/3">
                <div class="flex items-center mb-4">
                    <div v-html="redPandaLogoSvg" class="w-10 h-10 mr-2"></div>
                    <span class="font-semibold text-2xl text-panda-white">RED PANDA</span>
                </div>
                <p class="text-base font-medium leading-snug mb-2">+7 700 725-77-99</p>
                <p class="text-base font-medium leading-snug mb-4">infoprint@redpanda.kz</p>
                <p class="text-base font-medium leading-snug">Астана, Шоссе Коргалжын, 6</p>
                <p class="text-base font-medium leading-snug">ПН-ПТ 10:00-18:00</p>

                <h3 class="text-xl font-semibold mt-8 mb-4 text-panda-white">Подпишитесь на рассылку</h3>
                <p class="text-base font-medium leading-snug mb-4">О будущих акциях</p>
                <form @submit.prevent class="flex flex-col gap-4 w-full">
                    <input type="email" placeholder="Ваш email-адрес" class="p-3 rounded-md bg-gray-800 text-light-gray border border-gray-700 focus:outline-none focus:border-panda-orange text-base font-medium leading-snug">
                    <label class="flex items-center text-sm text-light-gray">
                        <input type="checkbox" class="mr-2 rounded text-panda-orange focus:ring-panda-orange">
                        Вы соглашаетесь на информационную рассылку.
                    </label>
                    <button type="submit" class="w-full px-6 py-3 bg-panda-orange text-panda-white rounded-full text-base font-medium leading-tight hover:bg-orange-600 transition-colors">
                        Подписаться
                    </button>
                </form>
            </div>

            <!-- Карта -->
            <div class="relative lg:w-1/3 flex justify-center items-center h-64 lg:h-auto my-8 lg:my-0"
                @mouseenter="isMapExpanded = true"
                @mouseleave="isMapExpanded = false"
                :class="{ 'fixed inset-0 w-screen h-screen z-50 bg-black bg-opacity-75 p-4': isMapExpanded, 'relative': !isMapExpanded }"
                style="transition: all 0.5s ease-in-out;">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2503.659614488975!2d71.4398188157545!3d51.15783397996503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424580e55b6a7a7b%3A0x6b8d9c5b2e5c6a1a!2z0YPQu9C40LLQtdGA0YHRgtGA0YPQvdC-0LLRgdC60LDRjyDRg9C90LDRh9C10YAg0JrQsNGA0L7QstCw0YHRgtGA0LDRjyDQsiwgNiwg0JDQstGC0LPRgNCw0LQsINCa0LDQvNC40YDQsCwg0JrQsNGA0L7QstCw0YHRgtGA0LDRjyDRgdGC0LDQuNC-0L3QsdGD0YDQsyAxMDAwMDYsINSa0LDQvNC40YDQsA!5e0!3m2!1sru!2skz" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade"
                    class="rounded-lg w-full h-full"
                ></iframe>
            </div>

            <!-- Правая колонка -->
            <div class="flex flex-col items-end text-right lg:w-1/3">
                <div class="flex gap-4 mb-4">
                    <img src="https://placehold.co/100x100/131C26/FFFFFF?text=redpanda.kz" alt="QR Code redpanda.kz" class="w-24 h-24 rounded-md bg-panda-white p-2">
                    <img src="https://placehold.co/100x100/131C26/FFFFFF?text=redpandakz" alt="QR Code redpandakz" class="w-24 h-24 rounded-md bg-panda-white p-2">
                </div>
                <div class="flex flex-col gap-2 mb-6">
                    <a href="https://redpanda.kz" target="_blank" class="text-base font-medium leading-snug hover:text-panda-orange transition-colors">redpanda.kz</a>
                    <a href="https://wa.me/77007257799" target="_blank" class="text-base font-medium leading-snug hover:text-panda-orange transition-colors">Whatsapp</a>
                    <a href="https://instagram.com/redpandakz" target="_blank" class="text-base font-medium leading-snug hover:text-panda-orange transition-colors">Instagram</a>
                    <a href="https://2gis.kz/astana/firm/70000001032338243" target="_blank" class="text-base font-medium leading-snug hover:text-panda-orange transition-colors">2GIS</a>
                </div>
                <p class="text-base font-medium leading-snug mt-auto">TOO «RED PANDA» БИН 221240030264</p>
            </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-dark-gray text-sm font-medium leading-snug">
            &copy; 2024 TOO «RED PANDA». Все права защищены.
        </div>
    </footer>
</template>
