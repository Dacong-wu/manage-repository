const { consola } = require('consola')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')
dayjs.extend(utc)
dayjs.extend(timezone)

function Consola(info, type = 'success', hasTime = true) {
  consola[type](hasTime ? `${dayjs().tz('Asia/Shanghai').format('YYYY/MM/DD HH:mm:ss')} ${info}` : info)
}

module.exports = { Consola }
