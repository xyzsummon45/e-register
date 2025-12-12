<script setup>
const features = [
  'Registrasi daring yang praktis dan aman',
  'Integrasi data wilayah hingga tingkat kota/kabupaten',
  'Dukungan multi-peran untuk berbagai jenis pekerjaan',
  'Laporan ringkas untuk memantau status pendaftaran'
]
</script>

<template>
  <section class="py-2">
    <div class="row align-items-center g-4">
      <div class="col-12 col-lg-6">
        <h1 class="display-5 fw-bold mb-3">Selamat datang di E-Regist</h1>
        <p class="lead text-muted">
          Kelola proses pendaftaran Anda dengan mudah menggunakan platform modern berbasis Vue 3 dan Bootstrap 5.
        </p>
        <ul class="list-unstyled mt-4">
          <li v-for="feature in features" :key="feature" class="d-flex align-items-start mb-2">
            <span class="badge bg-success me-3 mt-1">&#10003;</span>
            <span>{{ feature }}</span>
          </li>
        </ul>
      </div>
      <div class="col-12 col-lg-6">
        <div class="ratio ratio-16x9 bg-light rounded-3 d-flex align-items-center justify-content-center">
          <div class="text-center text-muted px-4">
            <h2 class="h4 fw-semibold">E-Regist Dashboard</h2>
            <p class="mb-0">Antarmuka responsif untuk memonitor data pendaftar secara real-time.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
