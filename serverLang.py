const express = require('express');
const bodyParser = require('body-parser');
const agentOpenAi = require('../agents/agentOpenAi'); // Asegúrate de que esta ruta sea correcta y que el archivo exista
const cors = require('cors');  // Importar CORS

const app = express();
const port = 4000;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Ruta para recibir la solicitud del frontend
app.post('/api/query', async (req, res) => {
    const { query } = req.body;

    try {
        // Llama al agente para generar el prompt y obtener la respuesta del LLM
        const prompt = await agentOpenAi.generatePrompt(query);
        
        // Responde con el prompt generado
        res.json({ prompt });
    } catch (error) {
        console.error('Error en la generación del prompt:', error);
        res.status(500).json({ error: 'Error al generar el prompt' });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
