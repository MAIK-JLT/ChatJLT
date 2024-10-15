// server.js

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// Configurar middleware
app.use(cors({
  origin: 'http://localhost:8081', // Cambia esto al origen de tu frontend
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar funciones desde apis/openaiAPI.js
const { handleOpenAIQuery } = require('./apis/openaiAPI');

// Importar funciones desde apis/gmailAPI.js
const { getEmails, sendEmail } = require('./apis/gmailAPI');

// Definir rutas
app.post('/api/query', handleOpenAIQuery);

// Rutas para Gmail
app.get('/api/emails', async (req, res) => {
  try {
    const query = req.query.q || '';
    const emails = await getEmails(query);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener emails', details: error.message });
  }
});

app.post('/api/send-email', async (req, res) => {
  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }

  try {
    const result = await sendEmail(to, subject, body);
    res.json({ message: 'Email enviado exitosamente', data: result });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar email', details: error.message });
  }
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'El servidor está funcionando correctamente' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
