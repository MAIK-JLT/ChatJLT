const { Configuration, OpenAIApi } = require('openai');

// Configurar la conexión con OpenAI
function getOpenAIConnection() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Clave API desde el archivo .env
  });
  const openai = new OpenAIApi(configuration);
  return openai;
}

module.exports = { getOpenAIConnection };
