import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
});

// Agriculture API
export const agricultureAPI = {
    // Fields
    getFields: () => api.get('/agriculture/fields'),
    createField: (data: any) => api.post('/agriculture/fields', data),

    // Crops
    getCrops: () => api.get('/agriculture/crops'),

    // Plantings
    getPlantings: () => api.get('/agriculture/plantings'),
    createPlanting: (data: any) => api.post('/agriculture/plantings', data),

    // Harvests
    getHarvests: () => api.get('/agriculture/harvests'),
    recordHarvest: (data: any) => api.post('/agriculture/harvests', data),
    getHarvestSummary: () => api.get('/agriculture/harvests/summary'),

    // Expenses
    getExpenses: () => api.get('/agriculture/expenses'),
    recordExpense: (data: any) => api.post('/agriculture/expenses', data),

    // Dashboard
    getDashboard: () => api.get('/agriculture/dashboard'),
};

export default api;
