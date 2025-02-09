// theme.js - Control del modo oscuro

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleDarkMode");

  // Función para verificar y aplicar el modo correcto
  function applyTheme() {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    document.documentElement.classList.toggle("dark", isDarkMode);
    updateButtonText(isDarkMode);
  }

  // Función para cambiar el modo y guardarlo
  function toggleTheme() {
    const isDarkMode = document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
    updateButtonText(isDarkMode);
  }

  // Función para actualizar el texto del botón
  function updateButtonText(isDarkMode) {
    toggleButton.innerHTML = isDarkMode ? "☀️ Modo Día" : "🌙 Modo Noche";
  }

  // Evento de cambio de tema
  toggleButton.addEventListener("click", toggleTheme);

  // Aplicar el tema inicial basado en la preferencia del usuario
  applyTheme();
});
