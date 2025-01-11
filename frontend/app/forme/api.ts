import axios from 'axios';

const BASE_URL = 'http://localhost:4000/form';

// System APIs
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

// Draft & Trash Count APIs
export const fetchDraftCount = async () => {
  const response = await axios.get(`${BASE_URL}/getformedraft_Count`);
  return response.data.count;
};

export const fetchTrashCount = async () => {
  const response = await axios.get(`${BASE_URL}/getformesoftdelete_Count`);
  return response.data.count;
};

// Trash Management APIs
export const fetchTrashItems = async () => {
  const response = await axios.get(`${BASE_URL}/getTrashItems`);
  return response.data;
};

export const permanentDeleteItems = async (ids: number[]) => {
  await axios.post(`${BASE_URL}/permanentDelete`, { ids });
};

export const restoreItems = async (ids: number[]) => {
  await axios.post(`${BASE_URL}/restore`, { ids });
};

// Form Management APIs
export const createForm = async (formData: any) => {
  const response = await axios.post(`${BASE_URL}/createforme`, formData);
  return response.data;
};

export const createDraft = async (formData: any) => {
  const response = await axios.post(`${BASE_URL}/createDraft`, formData);
  return response.data;
};

export const updateForm = async (id: number, formData: any) => {
  const response = await axios.put(`${BASE_URL}/updateforme/${id}`, formData);
  return response.data;
};

export const updateDraft = async (id: number, formData: any) => {
  const response = await axios.put(`${BASE_URL}/updateforme_draft/${id}`, formData);
  return response.data;
};

export const getFormById = async (id: number) => {
  const response = await axios.get(`${BASE_URL}/getSystemById/${id}`);
  return response.data;
};
