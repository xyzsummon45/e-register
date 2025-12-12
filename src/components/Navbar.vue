<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm">
    <div class="container-fluid">
      <RouterLink class="navbar-brand fw-bold" to="/">
        E-Regist
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li v-for="link in navLinks" :key="link.to" class="nav-item">
            <RouterLink class="nav-link" active-class="active" :to="link.to">
              {{ link.name }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const navLinks = [
  { name: 'Beranda', to: '/' },
  { name: 'Registrasi', to: '/register' },
  { name: 'Data Pendaftar', to: '/transactions' }
]
</script>
