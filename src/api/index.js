import axios from './request'

export const registerAPI = ({ username, password, repassword }) => {
  return axios({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword
    }
  })
}
