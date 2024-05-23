const { Octokit } = require('@octokit/rest')
const { envData } = require('../env')

class GitHubManager {
  constructor({ repo, branch }) {
    this.octokit = new Octokit({ auth: envData.GITHUB_TOKEN })
    this.owner = envData.GITHUB_OWNER
    this.repo = repo
    this.branch = branch
  }

  async makeOctokitRequest(method, params) {
    try {
      const { data } = await method(params)
      return data
    } catch (error) {
      throw error
    }
  }

  // 获取最新的提交 SHA
  async getLatestCommitSha() {
    const refData = await this.makeOctokitRequest(this.octokit.git.getRef, {
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.branch}`
    })
    return refData.object.sha
  }

  // 获取树 SHA
  async getTreeSha(commitSha) {
    const commitData = await this.makeOctokitRequest(this.octokit.git.getCommit, {
      owner: this.owner,
      repo: this.repo,
      commit_sha: commitSha
    })
    return commitData.tree.sha
  }

  // 创建新的树
  async createTree(baseTreeSha, treeArr) {
    const treeData = await this.makeOctokitRequest(this.octokit.git.createTree, {
      owner: this.owner,
      repo: this.repo,
      base_tree: baseTreeSha,
      tree: treeArr
    })
    return treeData.sha
  }

  // 创建新的提交
  async createCommit(commitMessage, treeSha, parentSha) {
    const commitData = await this.makeOctokitRequest(this.octokit.git.createCommit, {
      owner: this.owner,
      repo: this.repo,
      message: commitMessage,
      tree: treeSha,
      parents: [parentSha]
    })
    return commitData.sha
  }

  // 更新分支指向新的提交
  async updateBranch(commitSha) {
    await this.makeOctokitRequest(this.octokit.git.updateRef, {
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.branch}`,
      sha: commitSha
    })
  }

  // 获取指定目录文件列表
  async getPathFileNameArr(path) {
    const fileArr = await this.makeOctokitRequest(this.octokit.repos.getContent, {
      owner: this.owner,
      repo: this.repo,
      path
    })
    return fileArr.map(file => file.name)
  }
}

module.exports = GitHubManager
