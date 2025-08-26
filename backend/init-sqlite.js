
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

    // Tabla de relación Pokémon-Tipos
    await run(`
      CREATE TABLE IF NOT EXISTS pokemon_tipos (
        pokemon_id INTEGER REFERENCES pokemons(id) ON DELETE CASCADE,
        tipo_id INTEGER REFERENCES tipos(id) ON DELETE CASCADE,
        PRIMARY KEY (pokemon_id, tipo_id)
      )
    `);

    // Insertar tipos básicos
    await run(`
      INSERT OR IGNORE INTO tipos (nombre, color) VALUES 
      ('Normal', '#A8A878'),
      ('Fuego', '#F08030'),
      ('Agua', '#6890F0'),
      ('Eléctrico', '#F8D030'),
      ('Planta', '#78C850'),
      ('Veneno', '#A040A0'),
      ('Volador', '#A890F0'),
      ('Lucha', '#C03028'),
      ('Psíquico', '#F85888'),
      ('Bicho', '#A8B820'),
      ('Roca', '#B8A038'),
      ('Fantasma', '#705898'),
      ('Dragón', '#7038F8'),
      ('Siniestro', '#705848'),
      ('Acero', '#B8B8D0'),
      ('Hada', '#EE99AC')
    `);

    console.log('✅ Tipos de Pokémon insertados!');

    // Verificar si ya hay Pokémon
    const existingPokemons = await query('SELECT COUNT(*) as count FROM pokemons');
    
    if (existingPokemons[0].count === 0) {
      // 🔥 CORRECCIÓN: Query completa y bien formada
      await run(`
        INSERT INTO pokemons (numero_pokedex, nombre, descripcion, altura, peso, url_imagen) VALUES
        (1, 'Bulbasaur', 'Una rara semilla fue plantada en su espalda al nacer.', 0.7, 6.9, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'),
        (4, 'Charmander', 'Prefiere las cosas calientes.', 0.6, 8.5, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'),
        (7, 'Squirtle', 'Cuando retrae su largo cuello en el caparazón, dispara agua.', 0.5, 9.0, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png')

      `);  // ← Sin coma extra al final

      console.log('✅ Pokémon de ejemplo insertados!');

      // Asignar tipos a los Pokémon
      await run(`
        INSERT OR IGNORE INTO pokemon_tipos (pokemon_id, tipo_id) VALUES
        (1, 5),  -- Bulbasaur: Planta
        (1, 6),  -- Bulbasaur: Veneno
        (2, 2),  -- Charmander: Fuego
        (3, 3)   -- Squirtle: Agua
      `);

      console.log('✅ Tipos asignados a Pokémon!');
    }

    console.log('🎉 Base de datos SQLite lista!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error; 
  }
  
};

// Ejecutar solo si se llama directamente
if (require.main === module) {
  initDatabase().then(() => {
    console.log('✅ Inicialización completada. La conexión permanece abierta para el servidor.');
    
  });
}

module.exports = initDatabase;