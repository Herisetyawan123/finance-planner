import { request } from "./api-service";

export const dashboardService = {
  getSummary: async (token) => {
    return await request("/dashboard", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
