import { api } from './api';

export const recipeService = {
  getAll: async () => {
    return api.get('/ingredients');
  },

  getIngredientGroups: async () => {
    return api.get('/ingredients/groups');
  },

  getIngredientMappings: async (productId) => {
    return api.get(`/products/${productId}/ingredients`);
  },

  bulkSetMappings: async (productId, ingredients) => {
    return api.post(`/products/${productId}/ingredients/bulk`, { ingredients });
  },

  createIngredient: async (data) => {
    return api.post('/ingredients', data);
  },

  updateIngredient: async (id, data) => {
    return api.patch(`/ingredients/${id}`, data);
  },

  deleteIngredient: async (id) => {
    return api.delete(`/ingredients/${id}`);
  },
};
