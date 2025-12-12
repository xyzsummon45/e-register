<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import api from '@/services/api'
import useLoader from '@/composables/useLoader'

const { loader, showLoader, hideLoader } = useLoader()

const form = reactive({
  fullName: '',
  birthPlace: '',
  birthDate: '',
  email: '',
  phone: '',
  province: '',
  city: '',
  maritalStatus: '',
  occupation: '',
  gender: ''
})

const fieldLabels = {
  fullName: 'Nama Lengkap',
  birthPlace: 'Tempat Lahir',
  birthDate: 'Tanggal Lahir',
  email: 'Email',
  phone: 'Nomor HP',
  province: 'Provinsi',
  city: 'Kota/Kabupaten',
  maritalStatus: 'Status Pernikahan',
  occupation: 'Pekerjaan',
  gender: 'Gender'
}

const alert = reactive({
  type: '',
  message: ''
})

const validation = reactive({
  fullName: '',
  birthPlace: '',
  birthDate: '',
  email: '',
  phone: '',
  province: '',
  city: '',
  maritalStatus: '',
  occupation: '',
  gender: ''
})

const provinces = ref([])
const cities = ref([])
const maritalStatuses = ref([])
const occupations = ref([])
const genders = ref([])

const isSubmitting = ref(false)
const isFetchingCities = ref(false)

const isFormDisabled = computed(() => loader.visible || isSubmitting.value)
const isCityDisabled = computed(() => isFormDisabled.value || !form.province || isFetchingCities.value)

const clearAlert = () => {
  alert.type = ''
  alert.message = ''
}

const setAlert = (type, message) => {
  alert.type = type
  alert.message = message
}

const getDataArray = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  return []
}

const mapProvinces = (items) =>
  items.map((item) => ({
    value: item.id ?? item.kodeprovinsi ?? '',
    label: item.namaprovinsi ?? item.kodeprovinsi ?? 'Tanpa nama'
  }))

const mapStatuses = (items) =>
  items.map((item) => ({
    value: item.id ?? item.kodestatuspernikahan ?? '',
    label: item.namastatuspernikahan ?? item.status ?? 'Tanpa nama'
  }))

const mapOccupations = (items) =>
  items.map((item) => ({
    value: item.id ?? item.kodepekerjaan ?? '',
    label: item.namapekerjaan ?? item.work ?? 'Tanpa nama'
  }))

const mapGenders = (items) =>
  items.map((item) => ({
    value: item.id ?? item.kodegender ?? '',
    label: item.namagender ?? item.gender ?? 'Tanpa nama'
  }))

const mapCities = (items) =>
  items.map((item) => ({
    value: item.id ?? item.kodekota ?? item.kodecity ?? '',
    label: item.namakota ?? item.city ?? item.city_name ?? 'Tanpa nama'
  }))

const handleFetchError = (message, error) => {
  console.error(message, error)
  setAlert('danger', message)
}

const fetchProvinces = async () => {
  try {
    const response = await api.get('transaction/getprovincedata')
    provinces.value = mapProvinces(getDataArray(response))
  } catch (error) {
    provinces.value = []
    handleFetchError('Gagal memuat data provinsi.', error)
  }
}

const fetchStatuses = async () => {
  try {
    const response = await api.get('transaction/getstatus')
    maritalStatuses.value = mapStatuses(getDataArray(response))
  } catch (error) {
    maritalStatuses.value = []
    handleFetchError('Gagal memuat data status pernikahan.', error)
  }
}

const fetchOccupations = async () => {
  try {
    const response = await api.get('transaction/getwork')
    occupations.value = mapOccupations(getDataArray(response))
  } catch (error) {
    occupations.value = []
    handleFetchError('Gagal memuat data pekerjaan.', error)
  }
}

const fetchGenders = async () => {
  try {
    const response = await api.get('transaction/getgender')
    genders.value = mapGenders(getDataArray(response))
  } catch (error) {
    genders.value = []
    handleFetchError('Gagal memuat data gender.', error)
  }
}

const fetchCitiesByProvince = async (provinceId) => {
  if (!provinceId) {
    cities.value = []
    form.city = ''
    return
  }

  isFetchingCities.value = true
  try {
    const response = await api.get(`transaction/getcitydata/${provinceId}`)
    cities.value = mapCities(getDataArray(response))
  } catch (error) {
    cities.value = []
    form.city = ''
    handleFetchError('Gagal memuat data kota.', error)
  } finally {
    isFetchingCities.value = false
  }
}

watch(
  () => form.province,
  (current, previous) => {
    if (current !== previous) {
      form.city = ''
      fetchCitiesByProvince(current)
    }
  }
)

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[0-9+]{8,15}$/

const validateField = (field) => {
  const label = fieldLabels[field]
  const rawValue = form[field]
  let message = ''

  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    message = `${label} wajib diisi.`
  } else if (field === 'email' && !emailPattern.test(String(rawValue).trim())) {
    message = 'Format email tidak valid.'
  } else if (field === 'phone') {
    const digitsOnly = String(rawValue).replace(/[^0-9+]/g, '')
    if (!phonePattern.test(digitsOnly)) {
      message = 'Nomor HP wajib diisi dengan angka (8-15 karakter).'
    }
    form.phone = digitsOnly
  }

  validation[field] = message
  return !message
}

const handleFieldInput = (field) => {
  if (validation[field]) {
    validateField(field)
  }
}

const validateForm = () => {
  let formIsValid = true
  Object.keys(validation).forEach((field) => {
    if (!validateField(field)) {
      formIsValid = false
    }
  })
  return formIsValid
}

const resetValidation = () => {
  Object.keys(validation).forEach((field) => {
    validation[field] = ''
  })
}

const resetForm = () => {
  form.fullName = ''
  form.birthPlace = ''
  form.birthDate = ''
  form.email = ''
  form.phone = ''
  form.province = ''
  form.city = ''
  form.maritalStatus = ''
  form.occupation = ''
  form.gender = ''
  cities.value = []
  resetValidation()
}

onMounted(async () => {
  clearAlert()
  showLoader('Memuat data formulir...')
  try {
    await Promise.all([
      fetchProvinces(),
      fetchStatuses(),
      fetchOccupations(),
      fetchGenders()
    ])
  } finally {
    hideLoader()
  }
})

const handleSubmit = async (event) => {
  event?.preventDefault()
  clearAlert()

  if (!validateForm()) {
    setAlert('danger', 'Harap lengkapi seluruh data wajib sebelum melanjutkan.')
    return
  }

  const submissionType = event?.submitter?.dataset?.action ?? 'publish'
  isSubmitting.value = true
  showLoader(submissionType === 'publish' ? 'Mengirim data publikasi...' : 'Menyimpan data sebagai draft...')

  try {
    const payload = {
      full_name: form.fullName,
      birth_place: form.birthPlace,
      birth_date: form.birthDate,
      email: form.email,
      phone: form.phone,
      province_id: form.province,
      city_id: form.city,
      marital_status_id: form.maritalStatus,
      occupation_id: form.occupation,
      gender_id: form.gender,
      status: submissionType
    }

    await api.post('transaction/post', payload)
    setAlert('success', submissionType === 'publish' ? 'Data berhasil dipublikasikan.' : 'Data berhasil disimpan sebagai draft.')
    resetForm()
  } catch (error) {
    const message = error?.response?.data?.message ?? 'Gagal mengirim data. Silakan coba lagi.'
    setAlert('danger', message)
  } finally {
    isSubmitting.value = false
    hideLoader()
  }
}
</script>

<template>
  <section>
    <header class="mb-4">
      <h2 class="h3 fw-semibold mb-1">Formulir Pendaftaran</h2>
      <p class="text-muted mb-0">Isi seluruh data di bawah ini dengan benar untuk melanjutkan proses pendaftaran.</p>
    </header>

    <div v-if="alert.message" :class="['alert', `alert-${alert.type}`]" role="alert">
      {{ alert.message }}
    </div>

    <form class="needs-validation" novalidate @submit.prevent="handleSubmit">
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <label class="form-label" for="fullName">Nama Lengkap *</label>
          <input
            id="fullName"
            v-model.trim="form.fullName"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': validation.fullName }"
            placeholder="Masukkan nama lengkap"
            :disabled="isFormDisabled"
            required
            @input="handleFieldInput('fullName')"
            @blur="validateField('fullName')"
          />
          <div class="invalid-feedback">{{ validation.fullName }}</div>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="birthPlace">Tempat Lahir *</label>
          <input
            id="birthPlace"
            v-model.trim="form.birthPlace"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': validation.birthPlace }"
            placeholder="Masukkan tempat lahir"
            :disabled="isFormDisabled"
            required
            @input="handleFieldInput('birthPlace')"
            @blur="validateField('birthPlace')"
          />
          <div class="invalid-feedback">{{ validation.birthPlace }}</div>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="birthDate">Tanggal Lahir *</label>
          <input
            id="birthDate"
            v-model="form.birthDate"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': validation.birthDate }"
            :disabled="isFormDisabled"
            required
            @change="validateField('birthDate')"
            @blur="validateField('birthDate')"
          />
          <div class="invalid-feedback">{{ validation.birthDate }}</div>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="email">Email *</label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': validation.email }"
            placeholder="nama@contoh.com"
            :disabled="isFormDisabled"
            required
            autocomplete="email"
            @input="handleFieldInput('email')"
            @blur="validateField('email')"
          />
          <div class="invalid-feedback">{{ validation.email }}</div>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="phone">Nomor HP *</label>
          <input
            id="phone"
            v-model.trim="form.phone"
            type="tel"
            class="form-control"
            :class="{ 'is-invalid': validation.phone }"
            placeholder="08xxxxxxxxxx"
            :disabled="isFormDisabled"
            required
            autocomplete="tel"
            @input="handleFieldInput('phone')"
            @blur="validateField('phone')"
          />
          <div class="invalid-feedback">{{ validation.phone }}</div>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="province">Provinsi *</label>
          <select
            id="province"
            v-model="form.province"
            class="form-select"
            :class="{ 'is-invalid': validation.province }"
            :disabled="isFormDisabled"
            required
            @change="validateField('province')"
            @blur="validateField('province')"
          >
            <option value="">Pilih provinsi</option>
            <option v-for="province in provinces" :key="province.value" :value="province.value">
              {{ province.label }}
            </option>
          </select>
          <div class="invalid-feedback">{{ validation.province }}</div>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="city">Kota/Kabupaten *</label>
          <select
            id="city"
            v-model="form.city"
            class="form-select"
            :class="{ 'is-invalid': validation.city }"
            :disabled="isCityDisabled"
            required
            @change="validateField('city')"
            @blur="validateField('city')"
          >
            <option value="">Pilih kota/kabupaten</option>
            <option v-for="city in cities" :key="city.value" :value="city.value">
              {{ city.label }}
            </option>
          </select>
          <div class="invalid-feedback">{{ validation.city }}</div>
          <div v-if="isFetchingCities" class="form-text text-muted">Memuat daftar kota...</div>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="maritalStatus">Status Pernikahan *</label>
          <select
            id="maritalStatus"
            v-model="form.maritalStatus"
            class="form-select"
            :class="{ 'is-invalid': validation.maritalStatus }"
            :disabled="isFormDisabled"
            required
            @change="validateField('maritalStatus')"
            @blur="validateField('maritalStatus')"
          >
            <option value="">Pilih status pernikahan</option>
            <option v-for="status in maritalStatuses" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
          <div class="invalid-feedback">{{ validation.maritalStatus }}</div>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="occupation">Pekerjaan *</label>
          <select
            id="occupation"
            v-model="form.occupation"
            class="form-select"
            :class="{ 'is-invalid': validation.occupation }"
            :disabled="isFormDisabled"
            required
            @change="validateField('occupation')"
            @blur="validateField('occupation')"
          >
            <option value="">Pilih pekerjaan</option>
            <option v-for="occupation in occupations" :key="occupation.value" :value="occupation.value">
              {{ occupation.label }}
            </option>
          </select>
          <div class="invalid-feedback">{{ validation.occupation }}</div>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="gender">Gender *</label>
          <select
            id="gender"
            v-model="form.gender"
            class="form-select"
            :class="{ 'is-invalid': validation.gender }"
            :disabled="isFormDisabled"
            required
            @change="validateField('gender')"
            @blur="validateField('gender')"
          >
            <option value="">Pilih gender</option>
            <option v-for="gender in genders" :key="gender.value" :value="gender.value">
              {{ gender.label }}
            </option>
          </select>
          <div class="invalid-feedback">{{ validation.gender }}</div>
        </div>
      </div>

      <div class="d-flex flex-column flex-sm-row gap-2 justify-content-end mt-4">
        <button
          class="btn btn-success px-4"
          type="submit"
          data-action="publish"
          :disabled="isFormDisabled"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Publish
        </button>
        <button
          class="btn btn-secondary px-4"
          type="submit"
          data-action="draft"
          :disabled="isFormDisabled"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Draft
        </button>
      </div>
    </form>
  </section>
</template>
