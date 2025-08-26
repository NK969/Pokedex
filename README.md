

# Pokedex

Chicos, 

instalar:

#cd backend npm install sqlite3 sqlite npm install -g nodemon 

#Instalar todas las dependencias necesarias: 

npm install express cors sqlite3 sqlite 
npm install express cors dotenv pg 
#Revisar que se instalaron las dependencias:
 npm list #Deben ver algo así: 
 backend@1.0.0 
 ├── cors@2.8.5 
 ├── express@4.18.2 
 ├── sqlite@4.2.0 
 └── sqlite3@5.1.7 
 # Inicializar la base de datos 
 
 npm run init-db 
 
 # Ejecutar el servidor npm run dev 
 
 #Deberian ver esto al ejecutar el servidor 
 ✅ Conectado a SQLite (sin configuración!) 
 🛠️ Creando base de datos SQLite... 
 🎉 Base de datos SQLite lista! 
 🚀 Servidor ejecutándose en http://localhost:5000 
 📊 Health check: http://localhost:5000/api/health 
 🐢 Pokémon API: http://localhost:5000/api/pokemon 
 🎉 ¡Base de datos SQLite funcionando sin configuración! 
 
 #cd frontend: 
 
 # Instalar las dependencias necesarias 
 npm install axios react-router-dom 
 npm install 
 #Revisar que se instalaron las dependencias: 
 npm list #Deben ver algo así: 
 pokedex-frontend@0.1.0 
 ├── axios@1.6.0 
 ├── react@18.2.0 
 ├── react-dom@18.2.0 
 ├── react-router-dom@6.8.0 
 └── react-scripts@5.0.1
