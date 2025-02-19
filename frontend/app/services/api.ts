import axios from 'axios';
// import SystemData from '@/types/inputform'
const BASE_URL = 'http://localhost:3000/api/form';
import { FormData,SystemData } from '../types/inputform';
// export interface SystemData {
//   // ...existing interfaces from page.tsx...
// }

export const api = {
  // Create system
  createSystem: async (data: FormData) => {
    console.log(data);
    const response = await axios.post(`${BASE_URL}/createforme`, data);
    return response.data;
  },

  // Get system by ID - change parameter type to number
  getSystemById: async (id: string) => {
    
    const response = await axios.get(`${BASE_URL}/getSystemById/${id}`);
    return response.data;
  },

  // Update system - keep id as number
  updateSystem: async (id: string, data: SystemData) => {
   console.log(id,data);
    const response = await axios.put(`${BASE_URL}/updateforme/${id}`, data);
    return response.data;
  },

  // Check if system exists for import csv
  checkSystem: async (systemName: string) => {
    const response = await axios.get(`${BASE_URL}/checkcsv?systemName=${systemName}`);
    return response.data;
  },


};



export const fetchSystems = async () => {
  const response = await axios.get(`${BASE_URL}/getform`);
  return response.data;
};

export const deleteSystem = async (id: string) => {
  await axios.delete(`${BASE_URL}/deletefrome/${id}`);
};

export const bulkDeleteSystems = async (ids: string[]) => {
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