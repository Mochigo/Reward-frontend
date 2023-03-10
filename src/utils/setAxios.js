import axios from 'axios'
import router from '../router'

// const service = axios.create()

// TODO check
export default function setAxios() {
  axios.interceptors.response.use((response) => {
    console.log('返回结果:', response)
    if (response.status === 200) {
      const data = response.data
      console.log(data)
      if (data.code === '20101') {
        // timeout clear the token of vuex and localStorage
        // store.commit('setToken', '')
        this.localStorage.removeItem('token')
        this.localStorage.removeItem('role')
        router.replace({ path: '/login' })
      }
      return data
    }
    return response
  })

  axios.defaults.baseURL = '/api'
}
