import { ref } from 'vue'

export const useLoading = () => {
  const isLoading = ref(false)
  return {
    isLoading,
  }
}
