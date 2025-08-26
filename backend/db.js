// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 👇 CAMBIA ESTA LÍNEA - Usa un archivo físico en lugar de memoria
const dbPath = path.join(__dirname, 'pokedex.db'); // Archivo en el mismo directorio
const db = new sqlite3.Database(dbPath); // <- Base de datos PERSISTENTE

console.log(`✅ Conectado a SQLite en: ${dbPath}`);

// Función para hacer queries simples
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Función para ejecutar (INSERT, UPDATE, DELETE)
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// 👇 Exporta una función para cerrar la conexión cuando termines
function closeDB() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else {
        console.log('✅ Conexión a la base de datos cerrada');
        resolve();
      }
    });
  });
}

module.exports = { db, query, run, closeDB }; // <- Exporta closeDB