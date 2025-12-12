<script setup>
import useLoader from '@/composables/useLoader'

const { loader } = useLoader()
</script>

<template>
  <Transition name="loader-fade">
    <div
      v-if="loader.visible"
      class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75"
      style="z-index: 1080"
    >
      <div class="text-center">
        <div class="spinner-border text-primary mb-3" role="status" aria-hidden="true"></div>
        <p class="fw-semibold text-secondary mb-0">{{ loader.message }}</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}
</style>
