import axios from 'axios';

const API_URL = 'http://localhost:4000/option?type=';

interface OptionType {
  option: string;
}

// Function to fetch environment options
export const getEnvironmentOptions = async (): Promise<OptionType[]> => {
  try {
    const response = await axios.get(`${API_URL}environment`);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching environment options:', error);
    return [];
  }

};

// Function to fetch server type options
export const getServerTypeOptions = async (): Promise<OptionType[]> => {
  try {
    const response = await axios.get(`${API_URL}server-type`);
    return response.data;
  } catch (error) {
    console.error('Error fetching server type options:', error);
    return [];
  }
};

// Function to fetch server role options
export const getServerRoleOptions = async (): Promise<OptionType[]> => {
  try {
    const response = await axios.get(`${API_URL}server-role`);
    return response.data;
  } catch (error) {
    console.error('Error fetching server role options:', error);
    return [];
  }
};

// Function to fetch server duty options
export const getServerDutyOptions = async (): Promise<OptionType[]> => {
  try {
    const response = await axios.get(`${API_URL}server-duty`);
    return response.data;
  } catch (error) {
    console.error('Error fetching server duty options:', error);
    return [];
  }
};

// Function to fetch production unit options
export const getProductionUnitOptions = async (): Promise<OptionType[]> => {
  try {
    const response = await axios.get(`${API_URL}production-unit`);
    return response.data;
  } catch (error) {
    console.error('Error fetching production unit options:', error);
    return [];
  }
};

// Function to fetch developer unit options
export const getDeveloperUnitOptions = async (): Promise<OptionType[]> => {
  try {
    const response = await axios.get(`${API_URL}developer-unit`);
    return response.data;
  } catch (error) {
    console.error('Error fetching developer unit options:', error);
    return [];
  }
};

// Function to fetch yes/no options
export const getYesNoOptions = async (): Promise<OptionType[]> => {
  try {
    const response = await axios.get(`${API_URL}yes-no`);
    return response.data;
  } catch (error) {
    console.error('Error fetching yes/no options:', error);
    return [];
  }
};

// Function to fetch DR/DC options
export const getDrDcOptions = async (): Promise<OptionType[]> => {
  try {
    const response = await axios.get(`${API_URL}dr-dc`);
    return response.data;
  } catch (error) {
    console.error('Error fetching DR/DC options:', error);
    return [];
  }
};

// Function to fetch developer type options
export const getDeveloperTypeOptions = async (): Promise<OptionType[]> => {
  try {
    const response = await axios.get(`${API_URL}developer-type`);
    return response.data;
  } catch (error) {
    console.error('Error fetching developer type options:', error);
    return [];
  }
};
