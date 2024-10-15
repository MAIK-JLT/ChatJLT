const { postToReplit } = require('../connections/replitConnection');

// Función para enviar código a Replit y ejecutarlo
async function executeCodeInReplit(script) {
  try {
    return await postToReplit(script);
  } catch (error) {
    console.error("Error ejecutando código en Replit:", error);
    throw new Error(error.message);
  }
}

module.exports = { executeCodeInReplit };
