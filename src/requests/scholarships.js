import axios from 'axios'

export function getScholarships(page, pageSize) {
  let token = localStorage.getItem('token')

  let config = {
    headers: {
      Authorization: token
    }
  }

  var url = '/scholarship/list' + '?page=' + page + '&limit=' + pageSize

  return axios.get(url, config)
}

export function getScholarshipInfo(id) {
  let token = localStorage.getItem('token')

  let config = {
    headers: {
      Authorization: token
    }
  }

  var url = '/scholarship' + '?scholarship_id=' + id

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

export function removeScholarshipItem(id) {
  let token = localStorage.getItem('token')

  let headers = {
    Authorization: token
  }

  let data = {}
  data['scholarship_item_id'] = id

  return axios.delete('/scholarship/item', { headers, data })
}
