from flask import Flask, request, jsonify
from flask_cors import CORS  # Importa el middleware CORS
import agentOpenAi  # Asegúrate de que esta importación sea correcta

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas las rutas

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    query = data.get('query')
    
    try:
        # Llama al agente para generar el prompt y obtener la respuesta del LLM
        prompt = agentOpenAi.generatePrompt(query)
        return jsonify({'prompt': prompt})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
