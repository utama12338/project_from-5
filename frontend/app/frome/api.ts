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
export const getTrash = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getSoftDeleted`);
    
    if (!Array.isArray(response.data.systems)) {
      console.error('Unexpected response format:', response.data);
      return [];
    }

    return response.data.systems.map((item: any) => {
      const deletedDate = new Date(item.deletedAt);
      
      const now = new Date();
      const remainingTime = deletedDate.getTime() - now.getTime();
      
      const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
      const hours = Math.floor((remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

      return {
        id: item.id,
        systemName: item.systemName,
        deletedAt: new Date(item.deletedAt).toLocaleDateString(),
        timeRemaining: `${days}d ${hours}h remaining`
      };
    });
  } catch (error) {
    console.error('Error fetching trash items:', error);
    return [];
  }
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
