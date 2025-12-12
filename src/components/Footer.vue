<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-light border-top py-3 mt-auto">
    <div class="container-fluid text-center text-muted small">
      &copy; {{ currentYear }} E-Regist. All rights reserved.
    </div>
  </footer>
</template>
