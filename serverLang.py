from flask import Flask, request, jsonify
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_experimental.sql import SQLDatabaseChain
from langchain.agents import initialize_agent, Tool
from langchain.utilities import SQLDatabase
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# Inicializar Flask
app = Flask(__name__)

# Configurar OpenAI LLM
llm = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Configurar la conexión a la base de datos MySQL
db = SQLDatabase.from_uri(os.getenv('DATABASE_URI'))
db_chain = SQLDatabaseChain(llm=llm, database=db)

# Prompt para el LLM
general_prompt = PromptTemplate(
    input_variables=["input"],
    template="{input}"
)
general_chain = LLMChain(llm=llm, prompt=general_prompt)

# Configurar acceso a GitHub (usando el token de GitHub)
from github import Github
github_token = os.getenv('GITHUB_TOKEN')
g = Github(github_token)

# Función para consultar GitHub
def get_github_info():
    user = g.get_user()
    repos = [repo.name for repo in user.get_repos()]
    return repos

# Definir las herramientas que el agente puede usar
tools = [
    Tool(
        name="database_search",
        func=lambda _: db_chain.run("SELECT COUNT(*) FROM Reservations"),
        description="Busca el número de entradas en la tabla de Reservas."
    ),
    Tool(
        name="github_info",
        func=lambda _: get_github_info(),
        description="Devuelve la lista de repositorios del usuario de GitHub."
    ),
    Tool(
        name="text_completion",
        func=lambda input_text: general_chain.run(input=input_text),
        description="Genera respuestas de texto general usando OpenAI."
    )
]

# Inicializar el agente con las herramientas
agent = initialize_agent(tools, llm)

# Ruta principal para manejar solicitudes
@app.route('/query', methods=['POST'])
def query():
    user_input = request.json['message']
    
    if "Reservas" in user_input:
        # Consultar entradas en la tabla Reservations
        result = agent.run("database_search")
    elif "GitHub" in user_input:
        # Consultar información de GitHub
        result = agent.run("github_info")
    else:
        # Respuesta general usando el LLM
        result = agent.run("text_completion", user_input)
    
    return jsonify({"response": result})

# Ejecutar la aplicación Flask en el puerto 3001
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
