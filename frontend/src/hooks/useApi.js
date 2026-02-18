import { useCallback, useState } from "react";

function normalizeApiBase(value) {
  let trimmed = (value || "").trim().replace(/\/$/, "");
  
  // Si c'est vide, retourner vide
  if (!trimmed) return "";
  
  // Ajouter le protocole s'il manque
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    trimmed = "http://" + trimmed;
  }
  
  // Supprimer /api s'il existe déjà à la fin
  if (trimmed.endsWith("/api")) {
    trimmed = trimmed.slice(0, -4);
  }
  
  return trimmed;
}

function buildUrl(apiBase, path) {
  // Vérifier que apiBase ne se termine pas déjà par /api
  const cleanBase = apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase;
  return `${cleanBase}${path}`;
}

export function useApi(apiBase) {
  const [status, setStatus] = useState({ message: "", isError: false });

  const api = useCallback(
    async (path, options = {}) => {
      try {
        setStatus({ message: "", isError: false });
        const url = buildUrl(apiBase, path);
        console.log("API Call:", url);
        const response = await fetch(url, {
          headers: { "Content-Type": "application/json", ...options.headers },
          ...options,
        });

        if (!response.ok) {
          const errorData = await response.text();
          const errorMsg = `❌ Erreur ${response.status} ${response.statusText}\nURL: ${url}\nRéponse: ${errorData || '(vide)'}`;
          throw new Error(errorMsg);
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
