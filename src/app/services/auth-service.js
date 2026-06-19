import { request } from "./api-service";

export const authService = {
    register: async ({ name, email, password }) => {
        return await request("/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        });
    },

    login: async (email, password) => {
        const data = await request("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        return {
            user:
                data.user ||
                data.data?.user ||
                null,
            token:
                data.token ||
                data.access_token ||
                data.data?.token ||
                data.data?.access_token ||
                null,
        };
    },

    checkToken: async (token) => {
        return await request("/auth/check-token", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    logout: async (token) => {
        return await request("/auth/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};