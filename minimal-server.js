console.log('Iniciando servidor mínimo...');
require('dotenv').config();

const express = require('express');
const app = express();
const agentGmail = require('./agents/agentGmail');  // Utilizamos agentGmail que hace uso de gmailConnection.js
const port = process.env.PORT || 3001;

app.use(express.json());

// Verifica si las variables de entorno están siendo cargadas correctamente
console.log('CLIENT_ID:', process.env.GMAIL_CLIENT_ID);
console.log('CLIENT_SECRET:', process.env.GMAIL_CLIENT_SECRET);
console.log('REFRESH_TOKEN:', process.env.GMAIL_REFRESH_TOKEN);

app.get('/', (req, res) => {
  console.log('Recibida petición GET en la ruta raíz');
  res.json({ message: 'Servidor funcionando correctamente' });
});

// Ruta para leer el contenido del último correo
app.get('/api/gmail/last-email-content', async (req, res) => {
  try {
    const emailContent = await agentGmail.getLastEmail(); // Llama a la función de agentGmail
    res.json({
      message: "Contenido del último correo leído exitosamente",
      data: emailContent
    });
  } catch (error) {
    console.error("Error al leer el último correo:", error.message);
    res.status(500).json({
      error: "Error al leer el último correo",
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor mínimo corriendo en http://localhost:${port}`);
});

console.log('Configuración del servidor mínimo completada.');
