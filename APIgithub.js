const { getGitHubConnection } = require('./connections/githubConnection'); // Ruta correcta para githubConnection.js

const github = getGitHubConnection(); // Usar la conexión ya establecida con GitHub

// Función para probar la conexión a GitHub
async function testGitHubConnection() {
    try {
        const { data } = await github.users.getAuthenticated();
        console.log('Conexión exitosa a GitHub. Usuario autenticado:', data.login);
        return data;
    } catch (error) {
        console.error('Error conectando a GitHub:', error.message);
        throw error;
    }
}

// Función para listar la estructura del repositorio
async function listRepoContents(owner, repo) {
    try {
        const response = await github.repos.getContent({
            owner: owner,
            repo: repo,
            path: '', // Deja el path vacío para listar el contenido raíz del repo
        });
        return response.data;
    } catch (error) {
        console.error('Error al listar el contenido del repositorio:', error.message);
        throw new Error(`Error al listar el contenido del repositorio: ${error.message}`);
    }
}

module.exports = {
    testGitHubConnection,
    listRepoContents,
};
