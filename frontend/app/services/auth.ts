import axios from 'axios';
const BASE_URL = 'http://localhost:4000';
interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async signup(data: SignUpData) {
    return axios.post(`${BASE_URL}/api/auth/signup`, data);
  }
};
