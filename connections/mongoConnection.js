require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
let client;

// Función para obtener la conexión a MongoDB
async function getMongoConnection() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db('maiordomoBNB');
}
console.log('MONGO_URI:', uri);
if (!uri.startsWith('mongodb')) {
    throw new Error('La URI no empieza con "mongodb".');
}


module.exports = { getMongoConnection };


