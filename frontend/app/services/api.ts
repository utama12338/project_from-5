import axios from 'axios';

const BASE_URL = 'http://localhost:4000/from';

export interface SystemData {
  // ...existing interfaces from page.tsx...
}

export const api = {
  // Create system
  createSystem: async (data: SystemData) => {
    const response = await axios.post(`${BASE_URL}/createforme`, data);
    return response.data;
  },

  // Get system by ID - change parameter type to number
  getSystemById: async (id: number) => {
    const response = await axios.get(`${BASE_URL}/getSystemById/${id}`);
    return response.data;
  },

  // Update system - keep id as number
  updateSystem: async (id: number, data: SystemData) => {
    const response = await axios.put(`${BASE_URL}/updateforme/${id}`, data);
    return response.data;
  },

  // Check if system exists
  checkSystem: async (systemName: string) => {
    const response = await axios.get(`${BASE_URL}/api/system/check?systemName=${systemName}`);
    return response.data;
  }
};
