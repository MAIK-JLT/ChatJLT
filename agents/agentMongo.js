const { getMongoConnection } = require('../connections/mongoConnection');

// Función para añadir una reserva
async function addReservation(reserva) {
  try {
    const db = await getMongoConnection();
    const collection = db.collection('reservations');
    return await collection.insertOne(reserva);
  } catch (error) {
    console.error("Error al añadir reserva:", error);
    throw error;
  }
}

// Función para listar todas las reservas
async function listReservations() {
  try {
    const db = await getMongoConnection();
    const collection = db.collection('reservations');
    return await collection.find({}).toArray();
  } catch (error) {
    console.error("Error al listar reservas:", error);
    throw error;
  }
}

module.exports = { addReservation, listReservations };
