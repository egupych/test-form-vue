<script setup>
// Эта строка была удалена, так как навигация теперь управляется vue-router.
</script>

<template>
  <main>
    <div class="main-container">
        <h1 class="font-bold text-panda-black text-4xl mb-4">Наша команда</h1>
        <p class="text-xl text-dark-gray leading-relaxed mb-6">Познакомьтесь с нашей профессиональной командой. Мы - лучшие!</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-light-gray rounded-lg p-4 text-center"><img src="https://placehold.co/150x150/F7F7F7/131C26?text=Андрей" alt="Андрей Федорович" class="rounded-full w-32 h-32 mx-auto mb-4 object-cover"><h3 class="font-semibold text-panda-black text-xl mb-1">Андрей Федорович</h3><p class="text-sm text-dark-gray">Руководитель</p></div>
            <div class="bg-light-gray rounded-lg p-4 text-center"><img src="https://placehold.co/150x150/F7F7F7/131C26?text=Светлана" alt="Светлана" class="rounded-full w-32 h-32 mx-auto mb-4 object-cover"><h3 class="font-semibold text-panda-black text-xl mb-1">Светлана</h3><p class="text-sm text-dark-gray">Менеджер по продажам</p></div>
            <div class="bg-light-gray rounded-lg p-4 text-center"><img src="https://placehold.co/150x150/F7F7F7/131C26?text=Лаура" alt="Лаура" class="rounded-full w-32 h-32 mx-auto mb-4 object-cover"><h3 class="font-semibold text-panda-black text-xl mb-1">Лаура</h3><p class="text-sm text-dark-gray">Дизайнер</p></div>
            <div class="bg-light-gray rounded-lg p-4 text-center"><img src="https://placehold.co/150x150/F7F7F7/131C26?text=Дмитрий" alt="Дмитрий" class="rounded-full w-32 h-32 mx-auto mb-4 object-cover"><h3 class="font-semibold text-panda-black text-xl mb-1">Дмитрий</h3><p class="text-sm text-dark-gray">Печатник</p></div>
        </div>
        <h2 class="font-bold text-panda-black text-3xl mb-4 mt-10">Наша история</h2>
        <div class="relative border-l-2 border-panda-orange pl-8 py-4">
            <div class="mb-8"><h3 class="font-semibold text-panda-black text-2xl">2024 Декабрь</h3><p class="text-lg text-dark-gray">Провели незабываемый корпоратив, завершивший успешный год.</p></div>
            <div class="mb-8"><h3 class="font-semibold text-panda-black text-2xl">2023 Июнь</h3><p class="text-lg text-dark-gray">Расширение производства, закупка нового оборудования.</p></div>
            <div class="mb-8"><h3 class="font-semibold text-panda-black text-2xl">2022 Февраль</h3><p class="text-lg text-dark-gray">Открытие первого филиала в другом городе.</p></div>
        </div>
    </div>
  </main>
</template>