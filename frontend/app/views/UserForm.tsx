import axios from 'axios';
import { User } from '../models/user';

const API_URL = 'http://localhost:4000/users';

export const UserService = {
  async createUser(userData: User) {
    const response = await axios.post(API_URL, userData);
    console.log(response)
    return response.data;
  },

  async getUsers() {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async updateUser(id: number, userData: Partial<User>) {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: number) {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};