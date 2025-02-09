// alarm.js - Funcionalidad de la alarma con múltiples registros

const elements = {
  currentDateTime: document.getElementById("currentDateTime"),
  alarmForm: document.getElementById("alarmForm"),
  statusMessage: document.getElementById("statusMessage"),
  timeRemaining: document.getElementById("timeRemaining"),
  previewSound: document.getElementById("previewSound"),
  alarmSound: document.getElementById("alarmSound"),
  stopAlarmButton: document.getElementById("stopAlarmButton"),
  stopAlarmContainer: document.getElementById("stopAlarmContainer"),
  alarmList: document.getElementById("alarmList"),
};

let activeAlarms = []; // Lista de alarmas activas
let audio = new Audio();

// Sonidos disponibles
window.sounds = {
  Tropical: "./Audios/Alarma1.flac",
  "Phone Anime": "./Audios/Alarma2.flac",
  "Majestic Voyage": "./Audios/Alarma3.flac",
};

// Llenar opciones de sonido en el select
function populateSoundOptions() {
  elements.alarmSound.innerHTML = "";
  Object.keys(window.sounds).forEach((sound) => {
    let option = document.createElement("option");
    option.value = sound;
    option.textContent = sound;
    elements.alarmSound.appendChild(option);
  });

  elements.previewSound.innerHTML = '<i class="fa-solid fa-play"></i> Escuchar';
}

// Formatear tiempo a dos dígitos
function formatTime(number) {
  return number.toString().padStart(2, "0");
}

// Actualizar la hora en pantalla con icono de sol o luna
function updateCurrentDateTime() {
  const now = new Date();
  const hour = now.getHours();
  const isNightTime = hour < 6 || hour >= 18; // Noche antes de 6 AM o después de 6 PM
  const icon = isNightTime ? "🌙" : "☀️"; // 🌙 Si es de noche, ☀️ si es de día

  elements.currentDateTime.innerHTML = `${icon} ${now.toLocaleTimeString(
    "es-ES",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }
  )}`;
}

setInterval(updateCurrentDateTime, 1000);

// Cuenta regresiva hasta la alarma
function startCountdown(alarm) {
  alarm.countdown = setInterval(() => {
    const now = new Date();
    const diff = alarm.time - now;

    if (diff <= 0) {
      clearInterval(alarm.countdown);

      // 💥 Ahora enviamos el objeto completo
      triggerAlarm(alarm);
      return;
    }

    const hours = formatTime(Math.floor(diff / (1000 * 60 * 60)));
    const minutes = formatTime(
      Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    );
    const seconds = formatTime(Math.floor((diff % (1000 * 60)) / 1000));

    document.getElementById(
      `countdown-${alarm.id}`
    ).textContent = `⏳ ${hours}:${minutes}:${seconds}`;
  }, 1000);
}

// Reproducir previsualización de sonido
let userInteracted = false; // Variable global

function playPreviewSound() {
  userInteracted = true; // Marcar que el usuario interactuó con la página
  const selectedSound = elements.alarmSound.value;

  if (!selectedSound || !window.sounds[selectedSound]) return;

  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0;
    elements.previewSound.innerHTML =
      '<i class="fa-solid fa-play"></i> Escuchar';
    return;
  }

  audio.src = window.sounds[selectedSound];
  audio.load();
  audio
    .play()
    .then(() => {
      elements.previewSound.innerHTML =
        '<i class="fa-solid fa-stop"></i> Detener';
    })
    .catch((err) => console.error("Error al reproducir el sonido:", err));
}

elements.previewSound.addEventListener("click", playPreviewSound);

// Configurar la alarma
elements.alarmForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const [hours, minutes] = document
    .getElementById("alarmTime")
    .value.split(":")
    .map(Number);
  const alarmMessage =
    document.getElementById("alarmMessage").value.trim() ||
    "🔔 Alarma activada";

  const selectedSound = elements.alarmSound.value; // 🛠 GUARDAR EL SONIDO
  if (!selectedSound || !window.sounds[selectedSound]) {
    alert("❌ Debes seleccionar un sonido para la alarma.");
    return;
  }

  const now = new Date();
  const alarmDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0
  );
  const timeToAlarm = alarmDate - now;

  if (timeToAlarm > 0) {
    const alarmId = Date.now(); // ID único para cada alarma
    const alarmData = {
      id: alarmId,
      time: alarmDate,
      formattedTime: `${formatTime(hours)}:${formatTime(minutes)} a. m.`,
      message: alarmMessage,
      sound: selectedSound, // 🔥 Guarda el sonido seleccionado en la alarma
    };

    console.log("✅ Nueva alarma guardada:", alarmData); // 👀 DEPURACIÓN

    activeAlarms.push(alarmData);
    renderAlarms();

    // **Actualizar el sonido antes de programar la alarma**
    setTimeout(() => {
      let foundAlarm = activeAlarms.find((a) => a.id === alarmId);
      if (foundAlarm) {
        foundAlarm.sound = selectedSound; // ✅ Asegurar que la alarma tiene sonido
        console.log("🔄 Sonido asegurado en activeAlarms:", foundAlarm.sound);
      } else {
        console.error("⚠️ No se encontró la alarma en la lista activa.");
      }
    }, timeToAlarm);

    startCountdown(alarmData);
  } else {
    alert("⏰ La hora ingresada ya pasó. Selecciona una hora futura.");
  }
});

// Mostrar todas las alarmas activas en pantalla
function renderAlarms() {
  elements.alarmList.innerHTML = ""; // Limpiar la lista antes de actualizar

  activeAlarms.forEach((alarm) => {
    let alarmItem = document.createElement("div");
    alarmItem.className =
      "flex justify-between items-center p-2 bg-gray-200 dark:bg-gray-700 rounded-lg my-2";

    alarmItem.innerHTML = `
          <div>
              <span class="text-gray-900 dark:text-gray-100">⏰ ${alarm.formattedTime} - ${alarm.message}</span>
              <div id="countdown-${alarm.id}" class="text-yellow-500 dark:text-yellow-400"></div>
          </div>
          <button onclick="removeAlarm(${alarm.id})" class="text-red-500 hover:text-red-700">❌</button>
      `;

    elements.alarmList.appendChild(alarmItem);
  });
}

// Eliminar una alarma de la lista
window.removeAlarm = function (id) {
  const alarmIndex = activeAlarms.findIndex((alarm) => alarm.id === id);

  if (alarmIndex !== -1) {
    clearInterval(activeAlarms[alarmIndex].countdown); // 🔴 DETENER TEMPORIZADOR
    activeAlarms.splice(alarmIndex, 1); // 🔴 ELIMINAR ALARMA DE LA LISTA
  }

  renderAlarms(); // 🔄 Actualizar la lista visualmente
};

// Activar la alarma cuando llegue su hora
function triggerAlarm(alarm) {
  console.log("🚀 Ejecutando triggerAlarm con datos:", alarm);

  // 🛠 Verificar si solo se recibió el ID
  if (typeof alarm === "number") {
    console.warn("⚠️ Se recibió solo el ID. Buscando en la lista activa...");

    let foundAlarm = activeAlarms.find((a) => a.id === alarm);
    if (foundAlarm) {
      alarm = foundAlarm; // ✅ Restaurar la alarma completa
      console.log("🔄 Alarma restaurada:", alarm);
    } else {
      console.error("❌ No se encontró la alarma en la lista activa.");
      return;
    }
  }

  // 🔥 Verificar si el sonido está presente
  if (!alarm.sound) {
    console.error("❌ Error: No se pudo asignar el sonido a la alarma.");
    return;
  }

  const selectedSound = alarm.sound.trim();
  console.log("🔍 Intentando reproducir sonido:", selectedSound);

  if (!window.sounds[selectedSound]) {
    console.error(
      "❌ Error: No se encontró el sonido de la alarma:",
      selectedSound
    );
    return;
  }

  // 🔊 Reproducir el sonido
  audio.src = window.sounds[selectedSound];
  audio.loop = true;

  audio
    .play()
    .then(() => {
      console.log("🔔 Alarma sonando correctamente:", selectedSound);
    })
    .catch(() => {
      document.getElementById("soundModal").classList.remove("hidden");
    });

  elements.stopAlarmContainer.style.display = "block";
}

// Mostrar mensaje temporal cuando se detienen las alarmas
function showTemporaryMessage(message) {
  elements.statusMessage.textContent = message; // Muestra el mensaje
  elements.statusMessage.style.opacity = "1"; // Asegura que sea visible

  setTimeout(() => {
    elements.statusMessage.style.opacity = "0"; // Oculta después de 5 segundos
    setTimeout(() => {
      elements.statusMessage.textContent = ""; // Limpia el texto
    }, 500); // Esperar a que termine la animación de opacidad
  }, 5000);
}

// Usar la función cuando se detiene la alarma
elements.stopAlarmButton.addEventListener("click", () => {
  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0;
  }
  elements.stopAlarmContainer.style.display = "none";
  showTemporaryMessage("🔕 La alarma a sido detenida.");
});

populateSoundOptions();
