<template>
    <transition name="preview">
      <router-link
        v-if="isVisible && link"
        :to="link.path"
        class="preview-window"
        :style="style"
        @mouseenter="$emit('mouseenter')"
        @mouseleave="$emit('mouseleave')"
      >
        <img :src="link.preview" alt="Page preview" class="preview-image">
      </router-link>
    </transition>
  </template>
  
  <script setup>
  defineProps({
    isVisible: {
      type: Boolean,
      required: true,
    },
    link: {
      type: Object,
      default: null,
    },
    style: {
      type: Object,
      required: true,
    },
  });
  
  defineEmits(['mouseenter', 'mouseleave']);
  </script>
  
  <style scoped>
  .preview-window {
    position: fixed;
    width: 320px;
    height: 240px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    z-index: 50;
    cursor: pointer;
  }
  .preview-window::after {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10px 10px 10px;
    border-color: transparent transparent white transparent;
    filter: drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.03));
  }
  .preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease-out;
  }
  .preview-window:hover .preview-image {
    transform: scale(1.1) translateY(-10px);
  }
  
  .preview-enter-active, .preview-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .preview-enter-from, .preview-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  </style>