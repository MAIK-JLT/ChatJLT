// server.js

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Importar la función de conexión a OpenAI
const { getOpenAIConnection } = require('./openaiConnection');
const openai = getOpenAIConnection();

// Importar la función de conexión a MongoDB
const { getMongoConnection } = require('./mongoConnection');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Variable para almacenar la colección 'conversations'
let conversationsCollection;

// Conexión a MongoDB
(async () => {
  try {
    const db = await getMongoConnection();
    conversationsCollection = db.collection('conversations');
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
  }
})();

// Endpoint para manejar las consultas del chat
app.post('/api/query', async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'La consulta no puede estar vacía' });
  }

  try {
    // Recuperar el historial de conversaciones
    const history = await conversationsCollection
      .find()
      .sort({ _id: 1 }) // Ordenar por orden de inserción
      .toArray();

    // Construir el array de mensajes para la API de OpenAI
    const messages = [
      {
        role: 'system',
        content:
          'Eres un asistente que me está ayudando a programar una plataforma de automatización. Asistes a profesionales que no saben programar.',
      },
      // Incluir el historial de mensajes anteriores
      ...history.map((msg) => ({ role: msg.role, content: msg.content })),
      // Añadir el mensaje actual del usuario
      { role: 'user', content: query },
    ];

    const response = await openai.createChatCompletion({
      model: 'gpt-4', // Cambia a 'gpt-3.5-turbo' si no tienes acceso a 'gpt-4'
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    const generatedText = response.data.choices[0].message.content.trim();

    // Almacenar el mensaje del usuario y la respuesta del asistente en la base de datos
    await conversationsCollection.insertMany([
      { role: 'user', content: query },
      { role: 'assistant', content: generatedText },
    ]);

    res.json({ prompt: generatedText });
  } catch (error) {
    console.error(
      'Error al comunicarse con OpenAI:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: 'Error al procesar la solicitud',
      details: error.response ? error.response.data : error.message,
    });
  }
});

// Endpoint para manejar la subida de archivos
app.post('/api/upload', upload.single('archivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
  }

  // Aquí puedes procesar el archivo subido según tus necesidades
  console.log('Archivo recibido:', req.file);

  res.json({ message: 'Archivo subido exitosamente' });
});

// Iniciar el servidor
app.listen(4000, () => {
  console.log('Servidor iniciado en el puerto 4000');
});

// Prueba de conexión a OpenAI
(async () => {
  try {
    const testResponse = await openai.createChatCompletion({
      model: 'gpt-4', // Cambia a 'gpt-3.5-turbo' si es necesario
      messages: [{ role: 'user', content: 'Hola' }],
      max_tokens: 5,
    });
    console.log('Conexión exitosa a OpenAI');
  } catch (error) {
    console.error(
      'Error al conectar con OpenAI:',
      error.response ? error.response.data : error.message
    );
  }
})();
