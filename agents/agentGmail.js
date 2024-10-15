const gmail = require('../connections/gmailConnection'); // Ajusta la ruta según la estructura de tu proyecto

// Función para enviar un correo
async function sendEmail(to, subject, body) {
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
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log('Email enviado: ', res.data);
    return res.data;
  } catch (error) {
    console.error('Error enviando email: ', error.message);
    throw new Error(`Error enviando email: ${error.message}`);
  }
}

// Función para leer correos
async function readEmails() {
  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'], // Opcional: puedes filtrar por etiquetas
      maxResults: 10,      // Número máximo de correos a recuperar
    });
    const messages = res.data.messages || [];
    console.log('Correos recuperados: ', messages);
    return messages;
  } catch (error) {
    console.error('Error al leer correos: ', error.message);
    throw new Error(`Error al leer correos: ${error.message}`);
  }
}

async function readMail() {  // La palabra clave 'async' estaba mal escrita
  try {
      const result = await gmail.users.messages.list({
          userId: 'me',
          labelIds: ['INBOX'],  // Filtra para leer los correos de la bandeja de entrada
          maxResults: 10,       // Número máximo de correos a leer
      });
      return result.data.messages || [];
  } catch (error) {
      throw new Error(`Error al leer correos: ${error.message}`);
  }
}


// Función para obtener el contenido del último correo
async function getLastEmail() {
  try {
    // Listar los correos de la bandeja de entrada
    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],  // Lee correos de la bandeja de entrada
      maxResults: 1,        // Obtener solo el más reciente
    });

    const messages = listResponse.data.messages || [];
    
    if (messages.length === 0) {
      console.log('No se encontraron correos.');
      return null;
    }

    // Obtener el ID del correo más reciente
    const lastMessageId = messages[0].id;

    // Obtener los detalles del correo más reciente
    const emailResponse = await gmail.users.messages.get({
      userId: 'me',
      id: lastMessageId,
    });

    console.log('Detalles del correo más reciente: ', emailResponse.data);
    return emailResponse.data;

  } catch (error) {
    console.error('Error al obtener el último correo: ', error.message);
    throw new Error(`Error al obtener el último correo: ${error.message}`);
  }
}

module.exports = {
  getLastEmail
};


module.exports = {
  sendEmail,
  readEmails,
  readMail,
  getLastEmail
  // Agregar esta función a los exports
};
