import React from 'react';

const PokemonCard = ({ pokemon }) => {
  return (
    <div style={{border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '10px'}}>
      <img 
        src={pokemon.url_imagen} 
        alt={pokemon.nombre}
        style={{width: '100px', height: '100px'}}
      />
      <h3>#{pokemon.numero_pokedex} - {pokemon.nombre}</h3>
      <p>{pokemon.descripcion}</p>
    </div>
  );
};

export default PokemonCard;