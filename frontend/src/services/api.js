import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const pokemonAPI = {
  getAllPokemon: () => axios.get(`${API_BASE_URL}/pokemon`),
  getPokemonById: (id) => axios.get(`${API_BASE_URL}/pokemon/${id}`),
  createPokemon: (data) => axios.post(`${API_BASE_URL}/pokemon`, data),
  updatePokemon: (id, data) => axios.put(`${API_BASE_URL}/pokemon/${id}`, data),
  deletePokemon: (id) => axios.delete(`${API_BASE_URL}/pokemon/${id}`),
};