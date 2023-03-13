import axios from 'axios'
import { useRouter } from 'vue-router'

// const service = axios.create()

// TODO check
export default function setAxios() {
  axios.interceptors.response.use(
    (response) => {
      console.log('返回结果:', response)
      if (response.status === 200) {
        const data = response.data
        return data
      }
      return response
    },
    (error) => {
      console.log('error', error)
      const status = error.status
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        const router = useRouter()
        router.push('/login')
      }
    }
  )

  axios.defaults.baseURL = '/api'
}
