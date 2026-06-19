const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const toJSON = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
};

export const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await toJSON(response);

  if (!response.ok) {
    const message = data?.message || data?.error || "Terjadi kesalahan server";
    throw new Error(message);
  }

  return data;
};
