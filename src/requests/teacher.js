import axios from 'axios'

export function getStudentsDeclarations(page, pageSize) {
  let token = localStorage.getItem('token')
  let config = {
    headers: {
      Authorization: token
    }
  }

  const url = '/teacher/declarations' + '?page=' + page + '&limit=' + pageSize

  return axios.get(url, config)
}
