import axios from 'axios'

export function createApplication(data) {
  let token = localStorage.getItem('token')

  let config = {
    headers: {
      Authorization: token
    }
  }

  return axios.post('/application', data, config)
}

export function getApplications(page, pageSize) {
  let token = localStorage.getItem('token')

  let config = {
    headers: {
      Authorization: token
    }
  }

  var url = '/application/list' + '?page=' + page + '&limit=' + pageSize

  return axios.get(url, config)
}
