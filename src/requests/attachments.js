import axios from 'axios'

export function getAttachments(id) {
  let token = localStorage.getItem('token')
  let config = {
    headers: {
      Authorization: token
    }
  }

  var url = '/scholarship/attachments' + '?scholarship_id=' + id

  return axios.get(url, config)
}

export function addAttachment(data) {
  let token = localStorage.getItem('token')
  let config = {
    headers: {
      Authorization: token
    }
  }

  return axios.post('/scholarship/attachment', data, config)
}

export function removeAttachment(id) {
  let token = localStorage.getItem('token')

  let headers = {
    Authorization: token
  }

  let data = {}
  data['attachment_id'] = id

  return axios.delete('/scholarship/attachment', { headers, data })
}
