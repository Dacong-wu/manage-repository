const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./router')
const catchError = require('./middlewares/catchError')
const { envData } = require('./env')
const { Consola } = require('./utils/consola')

const app = new Koa({ proxy: true })
app.listen(envData.BASE_PORT, '0.0.0.0', () => {
  // 0.0.0.0指定ipv4格式 ctx.ip获取到的是ipv4的地址
  Consola(`AppServer-${envData.SERVER_NAME}-${envData.BASE_PORT} Online 🎈`)
  Consola(`Running at http://127.0.0.1:${envData.BASE_PORT}`, 'info', false)
})

app.use(bodyParser())
app.use(catchError)
app.use(router.routes())
app.use(router.allowedMethods())
