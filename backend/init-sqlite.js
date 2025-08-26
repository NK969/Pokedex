
const { query, run } = require('./db');

const initDatabase = async () => {
  try {
    console.log('🛠️ Creando base de datos SQLite...');

    // Tabla de Pokémon
    await run(`
      CREATE TABLE IF NOT EXISTS pokemons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero_pokedex INTEGER UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        altura REAL,
        peso REAL,
        url_imagen TEXT
      )
    `);

    // Tabla de tipos
    await run(`
      CREATE TABLE IF NOT EXISTS tipos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL,
        color TEXT DEFAULT '#777777'
      )
    `);

    // Insertar tipos básicos
    await run(`
      INSERT OR IGNORE INTO tipos (nombre, color) VALUES 
      ('Normal', '#A8A878'),
      ('Fuego', '#F08030'),
      ('Agua', '#6890F0'),
      ('Eléctrico', '#F8D030'),
      ('Planta', '#78C850')
    `);

    // Verificar si ya hay Pokémon
    const existingPokemons = await query('SELECT COUNT(*) as count FROM pokemons');
    
    if (existingPokemons[0].count === 0) {
      // Insertar Pokémon de ejemplo
      await run(`
        INSERT INTO pokemons (numero_pokedex, nombre, descripcion, altura, peso, url_imagen) VALUES
        (1, 'Bulbasaur', 'Una rara semilla fue plantada en su espalda al nacer.', 0.7, 6.9, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'),
        (4, 'Charmander', 'Prefiere las cosas calientes.', 0.6, 8.5, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'),
        (7, 'Squirtle', 'Cuando retrae su largo cuello en el caparazón, dispara agua.', 0.5, 9.0, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png')
      `);

      console.log('✅ Pokémon de ejemplo insertados!');
    }

    console.log('🎉 Base de datos SQLite lista!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;