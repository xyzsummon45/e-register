import { reactive, readonly } from 'vue'

const state = reactive({
  visible: false,
  message: ''
})

const showLoader = (message = 'Memproses...') => {
  state.message = message
  state.visible = true
}

const hideLoader = () => {
  state.visible = false
  state.message = ''
}

const useLoader = () => ({
  loader: readonly(state),
  showLoader,
  hideLoader
})

export default useLoader
export { showLoader, hideLoader }
