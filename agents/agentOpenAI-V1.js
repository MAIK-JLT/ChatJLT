const { getOpenAIConnection } = require('../connections/openaiConnection');

// Obtener la conexión a OpenAI
const openai = getOpenAIConnection();

// Función para hacer una consulta a OpenAI
async function queryOpenAI(prompt) {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4o', // Usamos GPT-4o (omni)
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error en OpenAI:", error.response ? error.response.data : error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
}

module.exports = { queryOpenAI };
