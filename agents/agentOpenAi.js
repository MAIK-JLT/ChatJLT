const connectionOpenAi = require('../connections/connectionOpenAi');
const connectionRAG = require('../connections/connectionRAG');
const fetch = require('node-fetch');

class AgentOpenAi {
    async handleRequest(userQuery) {
        try {
            // 1. Recupera el contexto usando connectionRAG
            const context = await connectionRAG.retrieveContext(userQuery);
            console.log('Contexto recuperado:', context);

            // 2. Genera el prompt usando el servidor de PromptPoet (en Python)
            const prompt = await this.generatePrompt(userQuery, context);
            console.log('Prompt generado:', prompt);

            // 3. Llama a OpenAI a través de connectionOpenAi
            const completion = await connectionOpenAi.getCompletion(prompt);
            console.log('Respuesta de OpenAI:', completion);

            // 4. Devuelve la respuesta generada
            return completion;

        } catch (error) {
            console.error('Error en el manejo de la solicitud:', error);
            throw error;
        }
    }

    // Función para generar el prompt usando el servidor Python (PromptPoet)
    async generatePrompt(userQuery, context) {
        try {
            const response = await fetch('http://localhost:8000/generate_prompt/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_query: userQuery, context })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.prompt;
        } catch (error) {
            console.error('Error al generar el prompt:', error);
            throw error;
        }
    }
}

module.exports = new AgentOpenAi();