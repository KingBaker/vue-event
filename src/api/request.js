import ajax from 'axios'

const axios = ajax.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net',
  timeout: 10000
})

export default axios
