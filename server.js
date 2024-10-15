// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

// Agentes
const agentOpenAi = require('./agents/agentOpenAi');
const agentGitHub = require('./agents/agentGitHub');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint para manejar la interacción del chat
app.post('/api/query', async (req, res) => {
    const { message, agent } = req.body;

    try {
        let response;
        switch (agent) {
            case 'agentOpenAi':
                response = await agentOpenAi.handleRequest(message);
                break;
            case 'agentGitHub':
                response = await agentGitHub.handleRequest(message);
                break;
            default:
                return res.status(400).send('Unknown agent');
        }
        res.json({ response });
    } catch (error) {
        console.error('Error handling query:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
