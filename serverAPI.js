require('dotenv').config();
const express = require('express');
const internalAPI = require('./internalAPI'); // Importa la API centralizada
const cors = require('cors');  
const app = express();
app.use(express.json());

const port = process.env.PORT || 3001;

console.log('MONGO_URI:', process.env.MONGO_URI);  // P

// Habilitar CORS
app.use(cors());

app.use(express.json());

// Rutas para GitHub
app.post('/api/github/structure', async (req, res) => {
    const { owner, repo, path } = req.body;
    console.log(`Solicitando estructura del repositorio: ${owner}/${repo} en ${path}`);
    try {
        const result = await internalAPI.github.listRepoContents(owner, repo, path);
        console.log('Estructura obtenida:', result);
        res.json({ message: "Estructura del repositorio obtenida con éxito", data: result });
    } catch (error) {
        console.error('Error al obtener la estructura del repositorio:', error);
        res.status(500).json({ error: "Error obteniendo la estructura del repositorio", details: error.message });
    }
});

app.post('/api/github/update-file', async (req, res) => {
    const { owner, repo, path, content, message } = req.body;
    console.log(`Actualizando archivo: ${owner}/${repo}/${path}`);
    try {
        const result = await internalAPI.github.updateFile(owner, repo, path, content, message);
        console.log('Archivo actualizado:', result);
        res.json({ message: "Archivo actualizado con éxito", data: result });
    } catch (error) {
        console.error('Error al actualizar archivo:', error);
        res.status(500).json({ error: "Error actualizando archivo", details: error.message });
    }
});

// Rutas para Gmail
app.get('/api/gmail/emails', async (req, res) => {
    console.log('Listando correos...');
    try {
        const result = await internalAPI.gmail.listEmails();
        console.log('Correos listados:', result);
        res.json({ message: "Correos listados con éxito", data: result });
    } catch (error) {
        console.error('Error listando correos:', error);
        res.status(500).json({ error: "Error listando correos", details: error.message });
    }
});

app.post('/api/gmail/send', async (req, res) => {
    const { to, subject, body } = req.body;
    console.log(`Enviando correo a: ${to} con asunto: ${subject}`);
    try {
        const result = await internalAPI.gmail.sendEmail(to, subject, body);
        console.log('Correo enviado:', result);
        res.json({ message: "Correo enviado con éxito", data: result });
    } catch (error) {
        console.error('Error enviando correo:', error);
        res.status(500).json({ error: "Error enviando correo", details: error.message });
    }
});

// Rutas para MongoDB
app.post('/api/mongo/add', async (req, res) => {
    const { collection, document } = req.body;
    
    // Validar que los parámetros requeridos están presentes
    if (!collection || !document) {
        return res.status(400).json({ error: "Faltan datos: collection o document" });
    }

    console.log(`Añadiendo documento a ${collection}:`, document);

    try {
        const result = await internalAPI.mongo.insertDocument(collection, document);
        console.log('Documento añadido:', result);
        res.json({ message: "Documento añadido con éxito", data: result });
    } catch (error) {
        console.error('Error añadiendo documento a MongoDB:', error);
        res.status(500).json({ error: "Error añadiendo documento a MongoDB", details: error.message });
    }
});


// Rutas para OpenAI
app.post('/api/openai/generate', async (req, res) => {
    const { prompt } = req.body;
    console.log(`Generando texto con prompt: ${prompt}`);
    try {
        const result = await internalAPI.openai.generateText(prompt);
        console.log('Texto generado:', result);
        res.json({ message: "Texto generado con éxito", data: result });
    } catch (error) {
        console.error('Error generando texto:', error);
        res.status(500).json({ error: "Error generando texto", details: error.message });
    }
});
//Rutas en Replit

app.post('/api/replit/run', async (req, res) => {
    const { script } = req.body;
    if (!script) {
        return res.status(400).json({ error: "El campo 'script' es obligatorio." });
    }

    console.log(`Ejecutando código en Replit: ${script}`);
    try {
        const result = await internalAPI.replit.runCodeInReplit(script);
        console.log('Código ejecutado con éxito en Replit:', result);
        res.json({ message: "Código ejecutado con éxito", data: result });
    } catch (error) {
        console.error('Error ejecutando código en Replit:', error);
        res.status(500).json({ error: "Error ejecutando código en Replit", details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor API corriendo en http://localhost:${port}`);
});
