const currentDateTimeElement = document.getElementById("currentDateTime");
const alarmForm = document.getElementById("alarmForm");
const statusMessage = document.getElementById("statusMessage");
const timeRemainingElement = document.getElementById("timeRemaining");
const previewSoundButton = document.getElementById("previewSound");
const alarmSoundSelect = document.getElementById("alarmSound");
const stopAlarmButton = document.getElementById("stopAlarmButton");
const stopAlarmContainer = document.getElementById("stopAlarmContainer");

let alarmTimeout;
let countdownInterval;
let audio = null;

// Mostrar la fecha y hora actual
function updateCurrentDateTime() {
  const now = new Date();
  const formattedDateTime = now.toLocaleString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
  currentDateTimeElement.textContent = formattedDateTime;
}

// Actualizar la hora cada segundo
setInterval(updateCurrentDateTime, 1000);

// Previsualizar sonido
previewSoundButton.addEventListener("click", () => {
  const selectedSound = alarmSoundSelect.value;

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio = null;
    previewSoundButton.innerHTML = '<i class="fa-solid fa-play"></i> Escuchar';
    return;
  }

  audio = new Audio(selectedSound);
  audio.play().catch(() => {
    alert(
      "El navegador necesita interacción directa para reproducir el sonido.",
    );
  });
  previewSoundButton.innerHTML = '<i class="fa-solid fa-stop"></i> Detener';
});

// Mostrar cuenta regresiva
function startCountdown(alarmDate) {
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    const now = new Date();
    const diff = alarmDate - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      timeRemainingElement.textContent = "¡Es hora de la alarma!";
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    timeRemainingElement.textContent = `Tiempo restante: ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

// Configurar alarma
alarmForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const alarmTime = document.getElementById("alarmTime").value;
  const alarmSound = document.getElementById("alarmSound").value;
  const now = new Date();
  const alarmDate = new Date();
  const [hours, minutes] = alarmTime.split(":");
  alarmDate.setHours(hours, minutes, 0);

  const timeToAlarm = alarmDate - now;

  if (timeToAlarm > 0) {
    statusMessage.textContent = `Alarma configurada para las ${alarmTime}.`;

    if (alarmTimeout) {
      clearTimeout(alarmTimeout);
    }

    alarmTimeout = setTimeout(() => {
      audio = new Audio(alarmSound);
      audio.loop = true;
      audio.play();
      stopAlarmContainer.style.display = "block";
    }, timeToAlarm);

    startCountdown(alarmDate);
  } else {
    alert("La hora ingresada ya pasó. Por favor, selecciona una hora futura.");
  }
});

// Detener la alarma
stopAlarmButton.addEventListener("click", () => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio = null;
  }
  stopAlarmContainer.style.display = "none";
  statusMessage.textContent = "La alarma ha sido detenida.";
  clearInterval(countdownInterval);
  timeRemainingElement.textContent = "";
});
