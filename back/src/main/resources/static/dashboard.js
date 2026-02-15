async function getJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} sur ${path}`);
  }
  return response.json();
}

function setStatus(message, error = false) {
  const el = document.getElementById("status");
  el.textContent = message;
  el.style.color = error ? "#9f2138" : "#0f6d63";
}

async function loadStats() {
  try {
    const [clients, techniciens, chantiers, verifications] = await Promise.all([
      getJson("/api/clients?size=1"),
      getJson("/api/techniciens?size=1"),
      getJson("/api/chantiers?size=1"),
      getJson("/api/verifications")
    ]);

    document.getElementById("clientsCount").textContent = clients.totalElements ?? 0;
    document.getElementById("techniciensCount").textContent = techniciens.totalElements ?? 0;
    document.getElementById("chantiersCount").textContent = chantiers.totalElements ?? 0;
    document.getElementById("verificationsCount").textContent = Array.isArray(verifications) ? verifications.length : 0;

    setStatus("Dashboard chargé.");
  } catch (error) {
    setStatus(error.message, true);
  }
}

document.getElementById("refreshBtn").addEventListener("click", loadStats);
loadStats();
