const log4js = require('../utils/log4js')
module.exports = async (ctx, next) => {
  try {
    var begin = Date.now()
    await next()
    var end = `${Date.now() - begin}ms`
    logInfo(ctx, end)
  } catch (err) {
    // 判断是否为token过期等问题
    var end = `${Date.now() - begin}ms`
    if (err.status) {
      logError(ctx, end, err)
      ctx.status = err.status
    } else {
      logError(ctx, end, err)
      ctx.body = {
        code: 0,
        message: '服务异常，请稍后再试'
      }
    }
  }
}

//记录日志信息
function logInfo(ctx, time) {
  var method = ctx.method
  var ip = ctx.ip
  let data = {
    host: ctx.host,
    url: ctx.url,
    body: ctx.request.body,
    agent: ctx.request.header[`user-agent`]
  }
  let info = formatInfo({ method, time, ip, data })
  log4js.info(info)
}

//记录错误日志信息
function logError(ctx, time, err) {
  var method = ctx.method
  var ip = ctx.ip
  let data = {
    host: ctx.host,
    url: ctx.url,
    err_stack: err.stack,
    body: ctx.request.body,
    agent: ctx.request.header[`user-agent`]
  }
  let info = formatInfo({ method, time, ip, data })
  log4js.error(info)
}

function formatInfo(info) {
  const { method, time, ip, data } = info
  let logs = `\nMethod:${method}\n`
  logs += `Time:${time}\n`
  logs += `Ip:${ip}\n`
  const { host, url, body, agent, err_stack } = data
  logs += `Host:${host}\n`
  logs += `Url:${url}\n`
  logs += `Body:${JSON.stringify(body)}\n`
  logs += `Agent:${agent}\n`
  if (err_stack) {
    logs += `Err_stack:${err_stack}\n`
  }
  return logs
}
