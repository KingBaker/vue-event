// import dayjs from 'dayjs'

export function localtime (val) {
  const date = new Date(val)
  const data = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
  return data.split('.')[0].replace('T', ' ')
}

// 为什么不行?

// 定义时间格式化函数
// Vue.prototype.$formatDate = (dateObj) => {
//   return dayjs(dateObj).format('YYYY-MM-DD HH:mm:ss')
// }
