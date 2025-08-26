import React, { useState, useEffect } from 'react';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función simple para fetch sin axios
    const fetchPokemons = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pokemon');
        const data = await response.json();
        setPokemons(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  if (loading) return <div>Cargando Pokémon...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>🏆 Pokédex</h1>
      <div>
        {pokemons.map(pokemon => (
          <div key={pokemon.id} style={{
            border: '2px solid #ccc',
            padding: '15px',
            margin: '10px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <img 
              src={pokemon.url_imagen} 
              alt={pokemon.nombre}
              style={{ width: '120px', height: '120px' }}
            />
            <h2>#{pokemon.numero_pokedex} - {pokemon.nombre}</h2>
            <p>{pokemon.descripcion}</p>
            <p>Altura: {pokemon.altura}m | Peso: {pokemon.peso}kg</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;