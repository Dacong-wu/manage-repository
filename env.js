const envData = {
  BASE_PORT: process.env.BASE_PORT, // 监听端口
  SERVER_NAME: process.env.SERVER_NAME, // 程序名称
  GITHUB_TOKEN: process.env.GITHUB_TOKEN, // github token
  GITHUB_OWNER: process.env.GITHUB_OWNER // github owner
}
module.exports = { envData }
