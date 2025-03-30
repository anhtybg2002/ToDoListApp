import apiClient from "./client";

export const todoApi = {
  getAll: async (token, query = "") => {
    const { data } = await apiClient.get(`/todos${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  create: async (todo, token) => {
    const { data } = await apiClient.post("/todos", todo, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  update: async (id, todo, token) => {
    console.log(id);
    const response = await apiClient.put(`/todos/${id}`, todo, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(response.data);

    return response.data;
  },

  delete: async (id, token) => {
    const { data } = await apiClient.delete(`/todos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
