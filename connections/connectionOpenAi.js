// connectionOpenAi.js
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

class ConnectionOpenAi {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openai.com/v1';
    }

    // Método para obtener las credenciales y configurar la autenticación
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };
    }

    // Método genérico para hacer las solicitudes autenticadas
    async request(endpoint, data) {
        try {
            const response = await axios.post(`${this.baseUrl}/${endpoint}`, data, {
                headers: this.getHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error en la conexión a OpenAI:", error.message);
            throw error;
        }
    }
}

module.exports = new ConnectionOpenAi(process.env.OPENAI_API_KEY); // Cargar la API Key desde las variables de entorno
