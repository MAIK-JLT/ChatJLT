// Cargar las conexiones
const githubConnection = require('./connections/githubConnection');
const mongoConnection = require('./connections/mongoConnection');
const openaiConnection = require('./connections/openaiConnection');
const replitConnection = require('./connections/replitConnection');
const gmailConnection = require('./connections/gmailConnection');

// --- Funciones para la API unificada ---

// Funciones para GitHub
async function listRepoContents(owner, repo, path) {
    console.log(`Listando contenido del repositorio: ${owner}/${repo} en ${path}`);
    try {
        const response = await githubConnection.getGitHubConnection().repos.getContent({
            owner,
            repo,
            path,
        });
        return response.data;
    } catch (error) {
        console.error('Error en listRepoContents:', error);
        throw new Error(`Error al listar el contenido del repositorio: ${error.message}`);
    }
}

async function updateFile(owner, repo, path, content, message) {
    console.log(`Actualizando archivo en: ${owner}/${repo}/${path}`);
    try {
        const response = await githubConnection.getGitHubConnection().repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message,
            content: Buffer.from(content).toString('base64'),
        });
        return response.data;
    } catch (error) {
        console.error('Error en updateFile:', error);
        throw new Error(`Error al actualizar archivo en GitHub: ${error.message}`);
    }
}

// Funciones para MongoDB
async function insertDocument(collectionName, document) {
    console.log(`Insertando documento en la colección: ${collectionName}`);
    try {
        // Validar que la conexión esté establecida
        const db = await mongoConnection.getMongoConnection();
        if (!db) {
            throw new Error('Conexión a MongoDB no disponible');
        }
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(document);
        console.log('Documento insertado:', result);
        return result;
    } catch (error) {
        console.error('Error en insertDocument:', error);
        throw new Error(`Error al insertar documento en MongoDB: ${error.message}`);
    }
}

// Funciones para OpenAI
async function generateText(prompt) {
    console.log(`Generando texto con el prompt: ${prompt}`);
    try {
        const result = await openaiConnection.getOpenAIConnection().createChatCompletion({
            model: 'gpt-4',  // O usa 'gpt-3.5-turbo'
            messages: [
                { role: 'system', content: 'Eres un asistente útil.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 100,
        });
        return result.data.choices[0].message.content;
    } catch (error) {
        console.error('Error en generateText:', error);
        throw new Error(`Error en la consulta de OpenAI: ${error.message}`);
    }
}

//funciones para Replit
async function runCodeInReplit(script) {
    const { postToReplit } = replitConnection;
    console.log(`Ejecutando código en Replit con script: ${script}`);
    try {
        const result = await postToReplit(script);
        console.log('Resultado de Replit:', result);  // Log para ver el resultado
        return result;
    } catch (error) {
        console.error('Error en runCodeInReplit:', error);
        throw new Error(`Error al ejecutar código en Replit: ${error.message}`);
    }
}

// Funciones para Gmail
async function listEmails() {
    console.log('Listando correos...');
    try {
        const response = await gmailConnection.users.messages.list({
            userId: 'me',
            maxResults: 10,
        });
        return response.data.messages;
    } catch (error) {
        console.error('Error en listEmails:', error);
        throw new Error(`Error al listar correos: ${error.message}`);
    }
}

async function sendEmail(to, subject, body) {
    console.log(`Enviando correo a: ${to} con asunto: ${subject}`);
    const email = [
        `To: ${to}`,
        'Subject: ' + subject,
        '',
        body
    ].join('\n');

    const encodedMessage = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    try {
        const response = await gmailConnection.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error en sendEmail:', error);
        throw new Error(`Error al enviar correo: ${error.message}`);
    }
}

// --- Exportar todas las funciones ---
module.exports = {
    github: {
        listRepoContents,
        updateFile,
    },
    mongo: {
        insertDocument,
    },
    openai: {
        generateText,
    },
    replit: {
        runCodeInReplit, // Nueva función para ejecutar código en Replit
    },
    gmail: {
        listEmails,
        sendEmail,
    }
};
