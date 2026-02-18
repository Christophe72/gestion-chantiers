import { useCallback, useState } from "react";

function normalizeApiBase(value) {
  const trimmed = (value || "").trim().replace(/\/$/, "");
  if (trimmed.endsWith("/api")) return trimmed.slice(0, -4);
  return trimmed;
}

function buildUrl(apiBase, path) {
  return `${apiBase}${path}`;
}

export function useApi(apiBase) {
  const [status, setStatus] = useState({ message: "", isError: false });

  const api = useCallback(
    async (path, options = {}) => {
      try {
        setStatus({ message: "", isError: false });
        const url = buildUrl(apiBase, path);
        const response = await fetch(url, {
          headers: { "Content-Type": "application/json", ...options.headers },
          ...options,
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(
            `Erreur ${response.status}: ${response.statusText}\n${errorData}`
          );
        }

        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          return await response.json();
        }
        return null;
      } catch (error) {
        const errorMsg = error.message || "Erreur API inconnue";
        setStatus({ message: errorMsg, isError: true });
        console.error("API Error:", errorMsg);
        throw error;
      }
    },
    [apiBase]
  );

  return { api, status, setStatus };
}

export function readApiBase() {
  return normalizeApiBase(localStorage.getItem("apiBase") || "");
}

export function normalizeApiBaseFunc(value) {
  return normalizeApiBase(value);
}
