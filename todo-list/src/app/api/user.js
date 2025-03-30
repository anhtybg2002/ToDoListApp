import apiClient from "./client";

export const userApi = {
  create: async (user) => {
    console.log(user);
    const { data } = await apiClient.post("/register", user, {
      headers: {
        "Content-Type": "application/json", 
      },
    });
    return data;
  },

  login: async (user) => {
    console.log(user);
    const { data } = await apiClient.post("/login", user, {
      headers: {
        "Content-Type": "application/json", 
      },
    });
    return data;
  },
};
