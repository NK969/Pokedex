import React, { useState, useEffect } from 'react';
import { pokemonAPI } from '../services/api';
import PokemonCard from '../components/PokemonCard';

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPokemons();
  }, []);

  const loadPokemons = async () => {
    try {
      const response = await pokemonAPI.getAllPokemon();
      setPokemons(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Lista de Pokémon</h1>
      <div>
        {pokemons.map(pokemon => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default Home;