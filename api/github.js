const router = require('@koa/router')()
const { envData } = require('../env')
const { Octokit } = require('@octokit/rest')
const GitHubManager = require('../utils/github')
const myRepo = new GitHubManager({ repo: 'starlog-test', branch: 'main' })
const octokit = new Octokit({
  auth: envData.GITHUB_TOKEN
})

const owner = 'Dacong-wu' // 存储库所有者
const repo = 'starlog-test' // 存储库名称
const path = 'src/content/releases' // 文件路径
const branch = 'main' // 目标分支

// 1.获取网页内容目录
router.get('/list', async ctx => {
  const data = await myRepo.getPathFileNameArr('src/content/releasess')
  ctx.body = {
    code: 1,
    message: '',
    data: data
  }
})

// 2.获取网页指定文件内容
router.get('/content', async ctx => {
  const { name } = ctx.query
  if (!name) {
    return (ctx.body = {
      code: 0,
      message: '参数错误'
    })
  }

  const response = await octokit.repos.getContent({
    owner,
    repo,
    path: `${path}/${name}`
  })
  if (!response.data.content) {
    return (ctx.body = {
      code: 0,
      message: '文件内容为空'
    })
  }
  const content = Buffer.from(response.data.content, 'base64').toString('utf-8')
  ctx.body = {
    code: 1,
    message: '',
    data: content
  }
})

// 3.添加网页内容
router.get('/add', async ctx => {
  const name = 'test.md' // 新文件的内容
  const newContent = `
  # 这是 b.md 文件
  
  这是 b.md 文件的内容...
  `

  const response = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: `${path}/${name}`,
    message: '创建 b.md 文件',
    content: Buffer.from(newContent).toString('base64')
  })

  console.log('文件创建成功:', response.data)
  ctx.body = {
    code: 1,
    message: '',
    data: response.data
  }
})

module.exports = router.routes()
