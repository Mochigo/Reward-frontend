import axios from 'axios'

export function addDeclaration(data) {
  let token = localStorage.getItem('token')
  let config = {
    headers: {
      Authorization: token
    }
  }

  return axios.post('/declaration', data, config)
}

export function getDeclarations(id) {
  let token = localStorage.getItem('token')
  let config = {
    headers: {
      Authorization: token
    }
  }
  var url = '/declaration/list' + '?application_id=' + id

  return axios.get(url, config)
}
