import axios from 'axios'

export function getAttachments(id) {
  let token = localStorage.getItem('token')
  let config = {
    headers: {
      Authorization: token
    }
  }

  var url = '/scholarship/attchments' + '?scholarship_id=' + id

  return axios.get(url, config)
}
