const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function apiRequest(endpoint, options = {}) {
  const { method = "GET", token, body } = options;

  const response = await fetch(BASE_URL + endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (Array.isArray(data.detail)) {
      const message = data.detail
        .map((item) => {
          const field = Array.isArray(item.loc) ? item.loc.slice(1).join(".") : "field";
          return `${field}: ${item.msg}`;
        })
        .join(", ");
      throw new Error(message || "Validation failed");
    }

    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export function toApiDateTime(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}
