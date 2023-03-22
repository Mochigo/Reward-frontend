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

export function auditApplication(data) {
  let token = localStorage.getItem('token')

  let config = {
    headers: {
      Authorization: token
    }
  }

  return axios.post('/application/audit', data, config)
}

export function getUserApplications(page, pageSize) {
  let token = localStorage.getItem('token')

  let config = {
    headers: {
      Authorization: token
    }
  }

  var url = '/student/applications' + '?page=' + page + '&limit=' + pageSize

  return axios.get(url, config)
}

export function getItemApplications(page, pageSize, id) {
  let token = localStorage.getItem('token')

  let config = {
    headers: {
      Authorization: token
    }
  }

  var url =
    '/application/list' + '?page=' + page + '&limit=' + pageSize + '&scholarship_item_id=' + id

  return axios.get(url, config)
}
