import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const predictBoneAge = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
        const response = await api.post('/predict', formData);
        return response.data;
    } catch (error) {
        console.error('Error predicting bone age:', error);
        throw error;
    }
};

export default api;
