import axios from './request'

export const getListAPI = () => {
  return axios({
    url: 'http://geek.itheima.net/v1_0/channels'
  })
}
