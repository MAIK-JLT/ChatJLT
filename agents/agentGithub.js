require('dotenv').config();
const github = require('../connections/githubConnection'); // Usar conexión desde githubConnection

// Función para crear o actualizar un archivo en GitHub
async function createOrUpdateFile(owner, repo, path, content, message) {
  try {
    let sha;
    try {
      const { data } = await github.repos.getContent({
        owner,
        repo,
        path,
      });
      sha = data.sha; // Si el archivo existe, obtenemos su sha
      console.log(`El archivo ${path} ya existe, se actualizará.`);
    } catch (error) {
      if (error.status === 404) {
        console.log(`El archivo ${path} no existe, se creará.`);
      } else {
        throw error;
      }
    }

    // Crear o actualizar el archivo
    const response = await github.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'), // Codificar el contenido en base64
      sha: sha, // Si existe, pasamos el sha; si no, GitHub lo crea sin él
    });

    console.log(`Archivo procesado: ${path}`);
    return response.data;
  } catch (error) {
    console.error("Error procesando el archivo en GitHub:", error.message);
    throw error;
  }
}

// Función para crear la estructura de carpetas y archivos en GitHub
async function createProjectStructure(owner, repo) {
  const commitMessage = 'Initial project structure setup';
  const content = 'This is a test README file created by our application.';
  const filePath = 'README.md';

  try {
    console.log(`Creando/actualizando archivo ${filePath} en ${owner}/${repo}`);
    const result = await createOrUpdateFile(owner, repo, filePath, content, commitMessage);
    console.log(`Archivo creado/actualizado exitosamente: ${filePath}`);
    return result;
  } catch (error) {
    console.error(`Error creando/actualizando archivo ${filePath}:`, error.message);
    throw error;
  }
}

// Función para listar los contenidos del repositorio
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



// Función para probar la conexión a GitHub
async function testGitHubConnection() {
  try {
    const { data } = await github.users.getAuthenticated();
    console.log('Conexión a GitHub exitosa:', data.login);
    return { success: true, username: data.login };
  } catch (error) {
    console.error('Error al probar la conexión a GitHub:', error.message);
    throw error;
  }
}

// Exportar las funciones
module.exports = {
  createProjectStructure,
  testGitHubConnection,
  createOrUpdateFile,
  listRepoContents // Asegúrate de exportar listRepoContents
};

