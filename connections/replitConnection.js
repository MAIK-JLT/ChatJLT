const axios = require('axios');

// Función para obtener la URL del endpoint de Replit
function getReplitEndpointUrl() {
  const url = process.env.REPLIT_ENDPOINT_URL;
  console.log(`Replit Endpoint URL: ${url}`);  // Log para verificar la URL
  return url;
}

// Función para enviar una solicitud POST a Replit
async function postToReplit(script) {
  const replitEndpointUrl = getReplitEndpointUrl();
  if (!replitEndpointUrl) {
    throw new Error("La URL del endpoint de Replit no está definida.");
  }

  console.log(`Enviando script a Replit: ${script}`);
  try {
    const response = await axios.post(replitEndpointUrl, { script });
    console.log('Respuesta de Replit:', response.data);  // Log de la respuesta
    return response.data;
  } catch (error) {
    console.error("Error ejecutando código en Replit:", error);
    throw new Error(`Error en la conexión con Replit: ${error.message}`);
  }
}

module.exports = { postToReplit };
