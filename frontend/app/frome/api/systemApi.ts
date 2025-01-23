import axios from 'axios';

const BASE_URL = 'http://localhost:4000/from';

export const fetchSystems = async () => {
  const response = await axios.get(`${BASE_URL}/getforme`);
  return response.data;
};

export const deleteSystem = async (id: number) => {
  await axios.delete(`${BASE_URL}/deletefrome/${id}`);
};

export const bulkDeleteSystems = async (ids: number[]) => {
  await Promise.all(ids.map(id => deleteSystem(id)));
};

export const searchSystems = async (criteria: {
  systemName?: string;
  serverName?: string;
  environment?: string;
  ip?: string;
  developType?: string;
  businessUnit?: string;
}) => {
  const params = new URLSearchParams();
  Object.entries(criteria).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  const response = await axios.get(`${BASE_URL}/search?${params.toString()}`);
  return response.data;
};
