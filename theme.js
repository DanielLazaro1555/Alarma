// theme.js - Cambio automático de modo día/noche basado en el icono de `currentDateTime`
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleDarkMode");
  const timeDisplay = document.getElementById("currentDateTime");

  let autoThemeEnabled = true; // 🔥 Controla si el usuario permite el cambio automático

  function checkTimeMode() {
    if (!autoThemeEnabled) return; // Si el usuario lo desactivó, no hacer nada

    if (!timeDisplay) {
      console.error("❌ Error: No se encontró `currentDateTime`.");
      return;
    }

    let timeText = timeDisplay.textContent.trim();
    console.log(`🔍 Hora extraída con iconos: "${timeText}"`);

    if (!timeText) {
      console.warn("⚠️ `currentDateTime` aún no tiene datos. Reintentando...");
      setTimeout(checkTimeMode, 1000);
      return;
    }

    // 🛠 Verificar si el texto contiene la luna 🌙 o el sol ☀️
    const isNightTime = timeText.includes("🌙");
    const isDayTime = timeText.includes("☀️");

    console.log(`🌙 Detectado modo noche: ${isNightTime}`);
    console.log(`☀️ Detectado modo día: ${isDayTime}`);

    if (!isNightTime && !isDayTime) {
      console.warn("⚠️ No se detectó icono de sol ☀️ o luna 🌙 en `currentDateTime`.");
      return;
    }

    const shouldBeDark = isNightTime;
    const isCurrentlyDark = document.documentElement.classList.contains("dark");

    if (shouldBeDark !== isCurrentlyDark) {
      console.log(`🔄 Cambio automático detectado. Aplicando inmediatamente.`);
      toggleButton.click(); // 🔥 Cambia inmediatamente al cargar la página
    }
  }

  // 🛠 Desactivar el cambio automático si el usuario lo cambia manualmente
  toggleButton.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    if (autoThemeEnabled) {
      autoThemeEnabled = false;
      console.log("⚠️ El usuario desactivó el cambio automático.");
    }
  });

  // 🔥 Verifica **INMEDIATAMENTE** al cargar la página
  checkTimeMode();

  // 🔥 Verifica cada 10 minutos en caso de que la página permanezca abierta
  setInterval(checkTimeMode, 600000);
});
