import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiGet, apiPost, setCsrfToken } from "../api";

const AuthContext = createContext(null);

const INITIAL_AUTH = {
    authenticated: false,
    email: null,
    role: null,
    csrfToken: null,
};

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(INITIAL_AUTH);
    const [loading, setLoading] = useState(true);

    const refreshAuth = useCallback(async () => {
        try {
            const data = await apiGet("/auth/me");
            const next = {
                authenticated: Boolean(data?.authenticated),
                email: data?.email ?? null,
                role: data?.role ?? null,
                csrfToken: data?.csrfToken ?? null,
            };
            setCsrfToken(next.csrfToken);
            setAuth(next);
            return next;
        } catch {
            setCsrfToken(null);
            setAuth(INITIAL_AUTH);
            return INITIAL_AUTH;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        apiGet("/auth/me")
            .then((data) => {
                if (!active) return;
                const next = {
                    authenticated: Boolean(data?.authenticated),
                    email: data?.email ?? null,
                    role: data?.role ?? null,
                    csrfToken: data?.csrfToken ?? null,
                };
                setCsrfToken(next.csrfToken);
                setAuth(next);
            })
            .catch(() => {
                if (!active) return;
                setCsrfToken(null);
                setAuth(INITIAL_AUTH);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const login = useCallback(async (email, password) => {
        const data = await apiPost("/login", { email, password });
        const next = {
            authenticated: true,
            email: data?.email ?? email,
            role: data?.role ?? "USER",
            csrfToken: data?.csrfToken ?? null,
        };
        if (next.csrfToken) {
            setCsrfToken(next.csrfToken);
        }
        setAuth(next);
        return next;
    }, []);

    const register = useCallback(async (email, password) => {
        return apiPost("/register", { email, password });
    }, []);

    const logout = useCallback(async () => {
        try {
            await apiPost("/logout", {});
        } finally {
            setCsrfToken(null);
            await refreshAuth();
        }
    }, [refreshAuth]);

    return (
        <AuthContext.Provider
            value={{
                ...auth,
                loading,
                login,
                register,
                logout,
                refreshAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
