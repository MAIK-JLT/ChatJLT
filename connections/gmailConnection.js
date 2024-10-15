// connections/gmailConnection.js

const { google } = require('googleapis');
require('dotenv').config();

// Configuración de las credenciales de OAuth2
function getGmailConnection() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  // Establece el token de actualización (refresh token)
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  return oauth2Client;
}

module.exports = { getGmailConnection };
