const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchWithBaseUrl = (endpoint: string, options: RequestInit = {}) => {
  const hasBody = !!options.body;

  const sanitizedBaseUrl = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const sanitizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return fetch(`${sanitizedBaseUrl}${sanitizedEndpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
};
