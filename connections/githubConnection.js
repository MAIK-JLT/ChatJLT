const { Octokit } = require("@octokit/rest");

/**
 * Establecer conexión con GitHub usando el token de autenticación.
 * @returns {Octokit} - Cliente autenticado de GitHub.
 */
function getGitHubConnection() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("No se ha encontrado el token de GitHub en las variables de entorno.");
  }

  // Establecer la conexión usando el token
  const octokit = new Octokit({ auth: token });

  // Probar la conexión autenticada
  octokit.rest.users.getAuthenticated()
    .then(response => {
      console.log(`Conexión exitosa a GitHub. Usuario autenticado: ${response.data.login}`);
    })
    .catch(error => {
      console.error("Error conectando a GitHub:", error.message);
      throw new Error("Error conectando a GitHub.");
    });

  return octokit;
}

module.exports = { getGitHubConnection };
