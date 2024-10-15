const { Octokit } = require("@octokit/rest");
require('dotenv').config();

// Function to get GitHub connection
function getGitHubConnection() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
  return octokit;
}

// Get GitHub connection
const octokit = getGitHubConnection();

// Function to create or update a file in GitHub
async function createOrUpdateFile(owner, repo, path, content, message) {
  try {
    // First, try to get the file to know if it already exists
    let sha;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      sha = data.sha; // If the file exists, we get its sha
      console.log(`File ${path} already exists, it will be updated.`);
    } catch (error) {
      if (error.status === 404) {
        console.log(`File ${path} doesn't exist, it will be created.`);
      } else {
        throw error; // If it's another error, we throw it
      }
    }

    // Create or update the file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'), // Encode content in base64
      sha: sha // If it exists, we pass the sha; if not, GitHub creates it without it
    });

    console.log(`File processed: ${path}`);
    return response.data;
  } catch (error) {
    console.error("Error processing file in GitHub:", error.response ? error.response.data : error.message);
    throw error;
  }
}

// Function to create the folder and file structure in GitHub
async function createProjectStructure(owner, repo) {
  const commitMessage = 'Initial project structure setup';
  
  // File structure we want to create
  const files = [
    'projects/maiordomo/docs/README.md',
    'projects/maiordomo/code/index.js',
    'projects/maiordomo/css/styles.css',
    'projects/maiordomo/index.html',
    'agents/agentUI/css/styles.css',
    'agents/agentUI/js/app.js',
    'agents/LLMrouter/index.js',
    'agents/agentMongo/index.js',
    'agents/agentOpenAI/index.js',
    'agents/agentGitHub/index.js',
    'server/server.js',
    'server/routes/index.js',
    'server/controllers/controller.js',
  ];

  for (const file of files) {
    try {
      await createOrUpdateFile(owner, repo, file, '', commitMessage);  // Create or update file
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
}

// Function to test GitHub connection
async function testGitHubConnection() {
  try {
    const { data } = await octokit.users.getAuthenticated();
    console.log('GitHub connection successful:', data.login);
    return { success: true, username: data.login };
  } catch (error) {
    console.error('Error testing GitHub connection:', error.message);
    throw error;
  }
}

// Export the functions
module.exports = {
  createProjectStructure,
  testGitHubConnection,
  createOrUpdateFile
};