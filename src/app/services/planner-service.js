import { request } from "./api-service";

export const plannerService = {
  getMonthlyPlan: async (token, month, year, options = {}) => {
    return await request(`/planning-items/monthly-plan?month=${month}&year=${year}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
      signal: options.signal,
    });
  },

  savePlan: async (token, payload) => {
    return await request("/planning-items/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
};
