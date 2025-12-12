<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '@/services/api'

const transactions = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const lastUpdated = ref(null)

const extractTransactions = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.result)) return payload.result
  return []
}

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const formatPhoneNumber = (value) => {
  if (!value) return '-'
  const phone = String(value).trim()
  if (!phone) return '-'
  if (phone.startsWith('+') || phone.startsWith('0')) return phone
  return `0${phone}`
}

const formattedLastUpdated = computed(() => {
  if (!lastUpdated.value) return ''
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(lastUpdated.value)
})

const totalRegistrants = computed(() => transactions.value.length)
const hasData = computed(() => totalRegistrants.value > 0)

const fetchTransactions = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('transaction/get')
    transactions.value = extractTransactions(response)
    lastUpdated.value = new Date()
  } catch (error) {
    console.error('Gagal memuat data pendaftar:', error)
    errorMessage.value = 'Gagal memuat data pendaftar. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchTransactions)
</script>

<template>
  <section class="py-2">
    <header class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-lg-between gap-3 mb-4">
      <div>
        <h1 class="h3 fw-bold mb-1">Daftar Pendaftar</h1>
        <p class="text-muted mb-0">
          Ringkasan data pendaftar dari endpoint <code>transaction/get</code> tanpa paginasi.
        </p>
      </div>
      <div class="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
        <span class="badge text-bg-light text-primary-emphasis border border-primary-subtle fw-semibold px-3 py-2">
          Total: <span class="ms-1">{{ isLoading ? '...' : totalRegistrants }}</span>
        </span>
        <button
          class="btn btn-outline-primary"
          type="button"
          :disabled="isLoading"
          @click="fetchTransactions"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Muat Ulang
        </button>
      </div>
    </header>

    <p v-if="formattedLastUpdated" class="text-muted small mb-3">
      Terakhir diperbarui: {{ formattedLastUpdated }}
    </p>

    <div class="border border-light-subtle rounded-3 overflow-hidden">
      <div v-if="errorMessage" class="alert alert-danger mb-0 rounded-0">
        {{ errorMessage }}
      </div>
      <div v-else>
        <div v-if="isLoading" class="p-5 text-center text-muted">
          <div class="spinner-border text-primary mb-3" role="status" aria-hidden="true"></div>
          <p class="fw-semibold mb-0">Memuat data pendaftar...</p>
        </div>
        <template v-else>
          <div v-if="hasData" class="table-responsive">
            <table class="table table-striped table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th scope="col" class="text-center" style="width: 60px;">#</th>
                  <th scope="col">Nama Lengkap</th>
                  <th scope="col">Tempat &amp; Tanggal Lahir</th>
                  <th scope="col">Email</th>
                  <th scope="col">Nomor HP</th>
                  <th scope="col">Status Pernikahan</th>
                  <th scope="col">Pekerjaan</th>
                  <th scope="col">Domisili</th>
                  <th scope="col">Gender</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in transactions" :key="item.id ?? index">
                  <th scope="row" class="text-center">{{ index + 1 }}</th>
                  <td class="fw-semibold">{{ item.fullname ?? '-' }}</td>
                  <td>
                    <div class="d-flex flex-column">
                      <span>{{ item.place ?? '-' }}</span>
                      <span class="text-muted small">{{ formatDate(item.birthdate) }}</span>
                    </div>
                  </td>
                  <td>
                    <a v-if="item.email" class="text-decoration-none" :href="`mailto:${item.email}`">
                      {{ item.email }}
                    </a>
                    <span v-else>-</span>
                  </td>
                  <td>{{ formatPhoneNumber(item.phonenumber) }}</td>
                  <td>{{ item.namastatuspernikahan ?? '-' }}</td>
                  <td>{{ item.namapekerjaan ?? '-' }}</td>
                  <td>
                    <div class="d-flex flex-column">
                      <span>{{ item.namakota ?? '-' }}</span>
                      <span class="text-muted small">{{ item.namaprovinsi ?? '-' }}</span>
                    </div>
                  </td>
                  <td>{{ item.namagender ?? '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="p-5 text-center text-muted">
            <h2 class="h5 fw-semibold mb-1">Belum ada data pendaftar</h2>
            <p class="mb-0">Data akan ditampilkan secara otomatis setelah ada pendaftar baru.</p>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
