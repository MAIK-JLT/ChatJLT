console.log('Iniciando servidor...');
require('dotenv').config();

const path = require('path');
const express = require('express');
const agentOpenAI = require('./agents/agentOpenAI');
const agentGitHub = require('./agents/agentGitHub');
const agentMongo = require('./agents/agentMongo');
const agentReplit = require('./agents/agentReplit');
const agentDocs = require('./agents/agentDocs');
const agentGmail = require('./agents/agentGmail'); // Ahora estamos utilizando agentGmail
const cors = require('cors');
const axios = require('axios');

const app = express();
const initialPort = process.env.PORT || 3001;

console.log('MONGO_URI configurada:', process.env.MONGO_URI ? '[HIDDEN]' : 'No configurada');

app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(cors());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rutas para MongoDB
app.post('/api/mongo/reservations', async (req, res) => {
  try {
    const nuevaReserva = req.body;
    const resultado = await agentMongo.addReservation(nuevaReserva);
    res.json({ message: "Reserva añadida correctamente", data: resultado });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar la reserva", details: error.message });
  }
});

app.get('/api/mongo/reservations', async (req, res) => {
  try {
    const reservas = await agentMongo.listReservations();
    res.json({ reservas });
  } catch (error) {
    res.status(500).json({ error: "Error al listar las reservas", details: error.message });
  }
});

// Ruta para consultas a OpenAI
app.post('/api/openai/query', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await agentOpenAI.queryOpenAI(prompt);
    res.json({ message: "Respuesta generada por GPT-4", data: response });
  } catch (error) {
    res.status(500).json({ error: "Error consultando OpenAI", details: error.message });
  }
});

// Ruta para simular una solicitud a Replit
app.post('/api/test-replit-connection', async (req, res) => {
  try {
    const payload = {
      "ReservationCode": "ABC123",
      "Phone": "1234567890",
      "CheckIn": "2024-09-25",
      "CheckOut": "2024-09-30",
      "FullPrice": "500",
      "Guests": "2 adultos",
      "Place": "Apartment in New York"
    };

    const replitResponse = await axios.post(process.env.REPLIT_ENDPOINT_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    res.json({ message: "Respuesta de Replit recibida", data: replitResponse.data });
  } catch (error) {
    res.status(500).json({ error: "Error al hacer la solicitud a Replit", details: error.message });
  }
});

// Rutas para interactuar con GitHub
app.post('/api/github/update-file', async (req, res) => {
  const { owner, repo, path, content, message } = req.body;
  try {
    const result = await agentGitHub.updateFile(owner, repo, path, content, message);
    res.json({ message: "Archivo actualizado en GitHub", data: result });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando archivo en GitHub", details: error.message });
  }
});

app.get('/api/github/test-connection', async (req, res) => {
  try {
    const result = await agentGitHub.testGitHubConnection();
    res.json({ message: "Conexión a GitHub exitosa", data: result });
  } catch (error) {
    res.status(500).json({ error: "Error conectando a GitHub", details: error.message });
  }
});
// Rutas para listar la estructura del repositorio GitHub
app.post('/api/github/repo-structure', async (req, res) => {
  console.log('Recibida petición para listar estructura del repositorio:', req.body);
  const { owner, repo } = req.body;

  try {
    const files = await agentGitHub.listRepoContents(owner, repo);
    console.log('Estructura del repositorio listada correctamente');
    res.json(files);
  } catch (error) {
    console.error("Error al listar la estructura del repositorio:", error);
    res.status(500).json({ error: "Error al listar la estructura del repositorio", details: error.message });
  }
});

// Rutas para Gmail
app.get('/api/gmail/last-email-content', async (req, res) => {
  try {
    const emailContent = await agentGmail.getLastEmail(); // Usa la función de agentGmail
    res.json({
      message: "Contenido del último correo leído exitosamente",
      data: emailContent
    });
  } catch (error) {
    res.status(500).json({ error: "Error al leer el último correo", details: error.message });
  }
});

// Función para iniciar el servidor
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Servidor API corriendo en http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Puerto ${port} en uso. Intentando con el siguiente...`);
      startServer(port + 1);
    } else {
      console.error('Error al iniciar el servidor:', err);
    }
  });

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Servidor cerrado.');
      process.exit(0);
    });
  });
}

// Iniciar el servidor
startServer(initialPort);
