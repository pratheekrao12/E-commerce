export const BASE_URL = "http://localhost:8080/shop-app-1.0-SNAPSHOT";

let csrfToken = null;

export function getCsrfToken() {
    return csrfToken;
}

export function setCsrfToken(token) {
    csrfToken = token || null;
}

async function parseJsonSafe(response) {
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

async function ensureCsrfToken() {
    if (csrfToken) return csrfToken;
    const res = await fetch(`${BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
    });
    const data = await parseJsonSafe(res);
    if (data?.csrfToken) {
        csrfToken = data.csrfToken;
    }
    return csrfToken;
}

export async function apiRequest(path, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const headers = { ...(options.headers || {}) };

    if (method === "POST") {
        await ensureCsrfToken();
        headers["Content-Type"] = "application/json";
        if (csrfToken) {
            headers["X-CSRF-Token"] = csrfToken;
        }
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        method,
        headers,
        credentials: "include",
    });

    const data = await parseJsonSafe(response);

    if (data && typeof data === "object" && !Array.isArray(data) && data.csrfToken) {
        csrfToken = data.csrfToken;
    }

    if (!response.ok) {
        const error = new Error(data?.error || `Request failed (${response.status})`);
        error.status = response.status;
        throw error;
    }

    return data;
}

export function apiGet(path) {
    return apiRequest(path, { method: "GET" });
}

export function apiPost(path, body = {}) {
    return apiRequest(path, {
        method: "POST",
        body: JSON.stringify(body),
    });
}
