<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/Navbar.vue'
import AppFooter from '@/components/Footer.vue'
import LoaderOverlay from '@/components/LoaderOverlay.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <LoaderOverlay />
    <AppNavbar />
    <main class="flex-grow-1 py-4">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-xl-10">
            <div class="bg-white rounded-3 shadow-sm p-4">
              <RouterView />
            </div>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
