const TOKEN_KEY = "ds_token";

export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
    },
  });

  if (response.status === 401) {
    window.dispatchEvent(new Event("auth:session-expired"));
  }

  return response;
}
