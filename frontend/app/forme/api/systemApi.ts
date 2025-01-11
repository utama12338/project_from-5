import axios from 'axios';

const BASE_URL = 'http://localhost:4000/form';

export const fetchSystems = async () => {
  const response = await axios.get(`${BASE_URL}/getforme`);
  return response.data;
};

export const deleteSystem = async (id: number) => {
  await axios.delete(`${BASE_URL}/softdeleteforme/${id}`);
};

export const bulkDeleteSystems = async (ids: number[]) => {
  await Promise.all(ids.map(id => deleteSystem(id)));
};
