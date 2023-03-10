import axios from 'axios'

export function getScholarships(page, pageSize) {
  let token = localStorage.getItem('token')

  let config = {
    headers: {
      Authorization: token
    }
  }

  var url = '/scholarship/list' + '?page=' + page._value + '&limit=' + pageSize._value

  return axios.get(url, config)
}

export function createScholarship(data) {
  let token = localStorage.getItem('token')

  let config = {
    headers: {
      Authorization: token
    }
  }

  return axios.post('/scholarship', data, config)
}

export function getScholarshipItems(id) {
  let token = localStorage.getItem('token')
  let config = {
    headers: {
      Authorization: token
    }
  }

  var url = '/scholarship/items/list' + '?scholarship_id=' + id

  return axios.get(url, config)
}

export function addScholarshipItem(data) {
  let token = localStorage.getItem('token')

  let config = {
    headers: {
      Authorization: token
    }
  }

  return axios.post('/scholarship/item', data, config)
}
