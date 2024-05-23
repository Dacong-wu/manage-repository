const router = require('@koa/router')()
const github = require('./api/github')

router.get('/', ctx => {
  ctx.body = 'Hello World!'
})
router.use('/github', github)

module.exports = router
