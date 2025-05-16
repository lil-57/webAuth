import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    // si 401 et pas encore retry et pas déjà le /auth/refresh
    if (error.response?.status === 401 && !original._retry && !original.url?.includes("/auth/refresh")) {
      original._retry = true
      try {
        await axios.post("http://localhost:3000/auth/refresh", {}, { withCredentials: true })
        return api(original)
      } catch {}
    }
    return Promise.reject(error)
  },
)
