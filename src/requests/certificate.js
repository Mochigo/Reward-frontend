import axios from 'axios'

export function addCertificate(data) {
  let token = localStorage.getItem('token')
  let config = {
    headers: {
      Authorization: token
    }
  }

  return axios.post('/certificate', data, config)
}
