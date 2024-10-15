const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Obtener la clave de API de OpenAI desde el archivo .env
const openaiApiKey = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: openaiApiKey,
});

  const openai = new OpenAIApi(configuration);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.post('/api/query', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: query,
      max_tokens: 1024,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    res.json({ prompt: response.data.choices[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la consulta' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});