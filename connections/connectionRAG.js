const mongoConnection = require('./mongoConnection'); // Asegúrate de que esta ruta sea correcta

module.exports = {
    async retrieveContext(userQuery) {
        try {
            // Obtener la conexión a la base de datos desde mongoConnection
            const db = await mongoConnection.getDb();  // Supongo que ya tienes un método `getDb` que devuelve la conexión
            
            // Selecciona la colección que deseas usar (ajusta el nombre de la colección)
            const collection = db.collection('contextCollection');
            
            // Busca el contexto basado en la consulta del usuario
            const context = await collection.findOne({ query: userQuery });
            
            // Si se encuentra, devuelve el contexto; si no, devuelve un mensaje por defecto
            return context ? context.data : 'No se encontró contexto';
        } catch (error) {
            console.error('Error al recuperar el contexto:', error);
            throw error;
        }
    }
};
