
const express = require('express');
const router = express.Router();
const { query, run } = require('../db');

// GET - Obtener todos los Pokémon
router.get('/', async (req, res) => {
  try {
    console.log('📋 Obteniendo todos los Pokémon...');
    
    const pokemons = await query(`
      SELECT id, numero_pokedex, nombre, descripcion, altura, peso, url_imagen
      FROM pokemons 
      ORDER BY numero_pokedex
    `);
    
    console.log(`✅ Encontrados ${pokemons.length} Pokémon`);
    res.json(pokemons);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET - Obtener Pokémon por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Buscando Pokémon con ID: ${id}`);
    
    const pokemons = await query(
      'SELECT * FROM pokemons WHERE id = ?',
      [id]
    );
    
    if (pokemons.length === 0) {
      return res.status(404).json({ error: 'Pokémon no encontrado' });
    }

    console.log(`✅ Pokémon encontrado: ${pokemons[0].nombre}`);
    res.json(pokemons[0]);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST - Crear nuevo Pokémon
router.post('/', async (req, res) => {
  try {
    const { nombre, numero_pokedex, altura, peso, url_imagen, descripcion } = req.body;
    console.log(`➕ Creando nuevo Pokémon: ${nombre}`);
    
    const result = await run(
      `INSERT INTO pokemons (nombre, numero_pokedex, altura, peso, url_imagen, descripcion) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, numero_pokedex, altura, peso, url_imagen, descripcion]
    );
    
    // Obtener el Pokémon recién creado
    const newPokemon = await query(
      'SELECT * FROM pokemons WHERE id = ?',
      [result.id]
    );
    
    console.log(`✅ Pokémon creado: ${newPokemon[0].nombre}`);
    res.status(201).json(newPokemon[0]);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT - Actualizar Pokémon
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, altura, peso, url_imagen, descripcion } = req.body;
    console.log(`✏️ Actualizando Pokémon ID: ${id}`);
    
    await run(
      `UPDATE pokemons 
       SET nombre = ?, altura = ?, peso = ?, url_imagen = ?, descripcion = ?
       WHERE id = ?`,
      [nombre, altura, peso, url_imagen, descripcion, id]
    );
    
    // Obtener el Pokémon actualizado
    const updatedPokemon = await query(
      'SELECT * FROM pokemons WHERE id = ?',
      [id]
    );
    
    if (updatedPokemon.length === 0) {
      return res.status(404).json({ error: 'Pokémon no encontrado' });
    }
    
    console.log(`✅ Pokémon actualizado: ${updatedPokemon[0].nombre}`);
    res.json(updatedPokemon[0]);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Eliminar Pokémon
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando Pokémon ID: ${id}`);
    
    // Primero obtener el Pokémon para el mensaje
    const pokemon = await query(
      'SELECT * FROM pokemons WHERE id = ?',
      [id]
    );
    
    if (pokemon.length === 0) {
      return res.status(404).json({ error: 'Pokémon no encontrado' });
    }
    
    // Eliminar
    await run('DELETE FROM pokemons WHERE id = ?', [id]);
    
    console.log(`✅ Pokémon eliminado: ${pokemon[0].nombre}`);
    res.json({ message: 'Pokémon eliminado correctamente', pokemon: pokemon[0] });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;