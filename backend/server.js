
const express = require('express');
const cors = require('cors');
const initDatabase = require('./init-sqlite');
const pokemonRoutes = require('./routes/pokemon');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar base de datos primero
initDatabase().then(() => {
  // Rutas
  app.use('/api/pokemon', pokemonRoutes);

  // Ruta de prueba
  app.get('/api/test', (req, res) => {
    res.json({ 
      message: '✅ Backend de Pokedex funcionando!',
      database: 'SQLite (sin configuración)',
      status: 'Todo OK 👍'
    });
  });

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      database: 'SQLite - Conectado',
      timestamp: new Date().toISOString()
    });
  });

  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🐢 Pokémon API: http://localhost:${PORT}/api/pokemon`);
    console.log('🎉 ¡Base de datos SQLite funcionando sin configuración!');
  });
}).catch(error => {
  console.error('❌ Error inicializando la base de datos:', error);
  process.exit(1);
});