const express = require('express');
const router = express.Router();
const { query, run } = require('../db');

// GET - Obtener todos los Pokémon CON TIPOS
router.get('/', async (req, res) => {
  try {
    console.log('📋 Obteniendo todos los Pokémon...');
    
    const pokemons = await query(`
      SELECT p.*, 
             GROUP_CONCAT(t.nombre) as tipos,
             GROUP_CONCAT(t.color) as colores_tipos
      FROM pokemons p
      LEFT JOIN pokemon_tipos pt ON p.id = pt.pokemon_id
      LEFT JOIN tipos t ON pt.tipo_id = t.id
      GROUP BY p.id
      ORDER BY p.numero_pokedex
    `);
    
    // Transformar los tipos de string a array
    const pokemonsConTipos = pokemons.map(pokemon => ({
      ...pokemon,
      tipos: pokemon.tipos ? pokemon.tipos.split(',') : [],
      colores_tipos: pokemon.colores_tipos ? pokemon.colores_tipos.split(',') : []
    }));
    
    console.log(`✅ Encontrados ${pokemonsConTipos.length} Pokémon`);
    res.json(pokemonsConTipos);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET - Obtener Pokémon por ID CON TIPOS
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Buscando Pokémon con ID: ${id}`);
    
    const pokemons = await query(`
      SELECT p.*, 
             GROUP_CONCAT(t.nombre) as tipos,
             GROUP_CONCAT(t.color) as colores_tipos
      FROM pokemons p
      LEFT JOIN pokemon_tipos pt ON p.id = pt.pokemon_id
      LEFT JOIN tipos t ON pt.tipo_id = t.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);
    
    if (pokemons.length === 0) {
      return res.status(404).json({ error: 'Pokémon no encontrado' });
    }

    // Transformar tipos
    const pokemon = {
      ...pokemons[0],
      tipos: pokemons[0].tipos ? pokemons[0].tipos.split(',') : [],
      colores_tipos: pokemons[0].colores_tipos ? pokemons[0].colores_tipos.split(',') : []
    };

    console.log(`✅ Pokémon encontrado: ${pokemon.nombre}`);
    res.json(pokemon);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST - Crear nuevo Pokémon CON TIPOS (VERSIÓN SIMPLIFICADA)
router.post('/', async (req, res) => {
  try {
    const { nombre, numero_pokedex, altura, peso, url_imagen, descripcion, tipos } = req.body;
    console.log(`➕ Creando nuevo Pokémon: ${nombre}`);
    
    // 1. Insertar Pokémon
    const result = await run(
      `INSERT INTO pokemons (nombre, numero_pokedex, altura, peso, url_imagen, descripcion) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, numero_pokedex, altura, peso, url_imagen, descripcion]
    );
    
    const nuevoId = result.id;
    console.log(`✅ Pokémon insertado con ID: ${nuevoId}`);
    
    // 2. Insertar tipos si se proporcionaron
    if (tipos && tipos.length > 0) {
      console.log(`🔗 Asignando tipos: ${tipos.join(', ')}`);
      
      for (const tipoNombre of tipos) {
        await run(
          `INSERT INTO pokemon_tipos (pokemon_id, tipo_id)
           SELECT ?, id FROM tipos WHERE nombre = ?`,
          [nuevoId, tipoNombre]
        );
      }
      console.log('✅ Tipos asignados correctamente');
    }
    
    // 3. Obtener el Pokémon completo con tipos
    const pokemonCompleto = await query(`
      SELECT p.*, 
             GROUP_CONCAT(t.nombre) as tipos,
             GROUP_CONCAT(t.color) as colores_tipos
      FROM pokemons p
      LEFT JOIN pokemon_tipos pt ON p.id = pt.pokemon_id
      LEFT JOIN tipos t ON pt.tipo_id = t.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [nuevoId]);
    
    if (pokemonCompleto.length === 0) {
      return res.status(404).json({ error: 'Pokémon no encontrado después de crearlo' });
    }
    
    // Transformar los tipos de string a array
    const pokemonFinal = {
      ...pokemonCompleto[0],
      tipos: pokemonCompleto[0].tipos ? pokemonCompleto[0].tipos.split(',') : [],
      colores_tipos: pokemonCompleto[0].colores_tipos ? pokemonCompleto[0].colores_tipos.split(',') : []
    };
    
    console.log(`✅ Pokémon creado exitosamente: ${pokemonFinal.nombre}`);
    res.status(201).json(pokemonFinal);
    
  } catch (error) {
    console.error('❌ Error creando Pokémon:', error.message);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

// PUT - Actualizar Pokémon CON TIPOS
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, altura, peso, url_imagen, descripcion, tipos } = req.body;
    console.log(`✏️ Actualizando Pokémon ID: ${id}`);
    
    // 1. Actualizar datos básicos del Pokémon
    await run(
      `UPDATE pokemons 
       SET nombre = ?, altura = ?, peso = ?, url_imagen = ?, descripcion = ?
       WHERE id = ?`,
      [nombre, altura, peso, url_imagen, descripcion, id]
    );
    
    // 2. Actualizar tipos si se proporcionaron
    if (tipos) {
      // Primero eliminar tipos existentes
      await run('DELETE FROM pokemon_tipos WHERE pokemon_id = ?', [id]);
      
      // Luego insertar nuevos tipos
      for (const tipoNombre of tipos) {
        await run(
          `INSERT INTO pokemon_tipos (pokemon_id, tipo_id)
           SELECT ?, id FROM tipos WHERE nombre = ?`,
          [id, tipoNombre]
        );
      }
      console.log(`✅ Tipos actualizados: ${tipos.join(', ')}`);
    }
    
    // 3. Obtener el Pokémon actualizado CON TIPOS
    const updatedPokemon = await query(`
      SELECT p.*, 
             GROUP_CONCAT(t.nombre) as tipos,
             GROUP_CONCAT(t.color) as colores_tipos
      FROM pokemons p
      LEFT JOIN pokemon_tipos pt ON p.id = pt.pokemon_id
      LEFT JOIN tipos t ON pt.tipo_id = t.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);
    
    if (updatedPokemon.length === 0) {
      return res.status(404).json({ error: 'Pokémon no encontrado' });
    }
    
    const pokemonFinal = {
      ...updatedPokemon[0],
      tipos: updatedPokemon[0].tipos ? updatedPokemon[0].tipos.split(',') : [],
      colores_tipos: updatedPokemon[0].colores_tipos ? updatedPokemon[0].colores_tipos.split(',') : []
    };
    
    console.log(`✅ Pokémon actualizado: ${pokemonFinal.nombre}`);
    res.json(pokemonFinal);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Eliminar Pokémon (los tipos se eliminan automáticamente por CASCADE)
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
    
    // Eliminar (los tipos se eliminan automáticamente por CASCADE)
    await run('DELETE FROM pokemons WHERE id = ?', [id]);
    
    console.log(`✅ Pokémon eliminado: ${pokemon[0].nombre}`);
    res.json({ message: 'Pokémon eliminado correctamente', pokemon: pokemon[0] });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener todos los tipos disponibles
router.get('/tipos/todos', async (req, res) => {
  try {
    console.log('📋 Obteniendo todos los tipos...');
    
    const tipos = await query('SELECT * FROM tipos ORDER BY nombre');
    console.log(`✅ Encontrados ${tipos.length} tipos`);
    res.json(tipos);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;