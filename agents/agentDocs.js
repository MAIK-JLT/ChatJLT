const fs = require('fs').promises;
const path = require('path');
const docsDir = path.join(__dirname, '..', '..', 'docs');
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
require('dotenv').config();

async function createFile(fileName, content) {
  const filePath = path.join(docsDir, fileName);
  await fs.writeFile(filePath, content);
  return `File created: ${filePath}`;
}

async function readFile(fileName) {
  const filePath = path.join(docsDir, fileName);
  const content = await fs.readFile(filePath, 'utf-8');
  return content;
}

async function updateFile(fileName, content) {
  const filePath = path.join(docsDir, fileName);
  await fs.writeFile(filePath, content);
  return `File updated: ${filePath}`;
}

async function deleteFile(fileName) {
  const filePath = path.join(docsDir, fileName);
  await fs.unlink(filePath);
  return `File deleted: ${filePath}`;
}


async function listRepoContents(owner, repo) {
  const response = await octokit.repos.getContent({
    owner: owner,
    repo: repo,
    path: ''
  });
  return response.data;
}




module.exports = {
  createFile,
  readFile,
  updateFile,
  deleteFile,
  listRepoContents
};