import axios from 'axios'

export function loginStudent(data) {
  return axios.post('/login/student', data)
}

export function loginTeacher(data) {
  return axios.post('/login/teacher', data)
}
