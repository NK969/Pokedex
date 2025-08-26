
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear base de datos en memoria (o archivo)
const db = new sqlite3.Database(':memory:'); // Para desarrollo rápido
// O usar archivo: const db = new sqlite3.Database('./pokedex.db');

console.log('✅ Conectado a SQLite (sin configuración!)');

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

module.exports = { db, query, run };