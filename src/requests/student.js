import axios from 'axios'

export function getStudentInfo() {
  let token = localStorage.getItem('token')
  let config = {
    headers: {
      Authorization: token
    }
  }
  var url = '/student'

  return axios.get(url, config)
}
