const timerRef = document.querySelector(".time-display");
const dateRef = document.querySelector(".date-display");
const dateInput = document.getElementById("dateInput");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const amPmInput = document.getElementById("amPmInput");
const activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("set");
let alarmsArray = [];
let alarmSound = new Audio("./alarm.mp3");

const appendZero = (num) => (num < 10 ? `0${num}` : num);

function displayTimer() {
  const now = new Date();
  const hours = appendZero(now.getHours() % 12 || 12);
  const minutes = appendZero(now.getMinutes());
  const seconds = appendZero(now.getSeconds());
  const amPm = now.getHours() >= 12 ? "PM" : "AM";

  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = appendZero(now.getDate());
  const month = appendZero(now.getMonth() + 1);
  const year = now.getFullYear();

  timerRef.textContent = `${hours}:${minutes}:${seconds} ${amPm}`;
  dateRef.textContent = `${day}, ${date}-${month}-${year}`;

  alarmsArray.forEach((alarm) => {
    if (alarm.isActive) {
      const alarmDate = new Date(alarm.alarmDate);
      if (
        alarmDate.toLocaleDateString() === now.toLocaleDateString() &&
        `${alarm.alarmHour}:${alarm.alarmMinute} ${alarm.amPm}` ===
          `${appendZero(hours)}:${appendZero(minutes)} ${amPm}`
      ) {
        alarmSound.play();
        alarmSound.loop = true;
      }
    }
  });
}

const validateDate = (dateString) => {
  return !isNaN(new Date(dateString).getTime());
};

setAlarm.addEventListener("click", () => {
  const dateValue = dateInput.value;
  if (!validateDate(dateValue)) {
    alert("Please enter a valid date in DD-MM-YYYY format.");
    return;
  }

  const alarmObj = {
    id: `${Date.now()}_${hourInput.value}_${minuteInput.value}`,
    alarmHour: appendZero(hourInput.value),
    alarmMinute: appendZero(minuteInput.value),
    amPm: amPmInput.value,
    alarmDate: dateValue,
    isActive: true,
  };

  alarmsArray.push(alarmObj);
  createAlarm(alarmObj);

  dateInput.value = "";
  hourInput.value = "00";
  minuteInput.value = "00";
  amPmInput.value = "AM";
});

const createAlarm = (alarmObj) => {
  const { id, alarmHour, alarmMinute, amPm, alarmDate } = alarmObj;

  const alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `
    <span>${alarmDate}, ${alarmHour}:${alarmMinute} ${amPm}</span>
  `;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = true;
  checkbox.addEventListener("click", (e) => toggleAlarm(e, id));
  alarmDiv.appendChild(checkbox);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("deleteButton");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, id));
  alarmDiv.appendChild(deleteButton);

  activeAlarms.appendChild(alarmDiv);
};

const toggleAlarm = (e, id) => {
  const alarm = alarmsArray.find((a) => a.id === id);
  if (alarm) alarm.isActive = e.target.checked;
};

const deleteAlarm = (e, id) => {
  alarmsArray = alarmsArray.filter((a) => a.id !== id);
  const alarmDiv = document.querySelector(`.alarm[data-id="${id}"]`);
  if (alarmSound.loop) {
    alarmSound.loop = false;
    alarmSound.pause();
  }
  alarmDiv.remove();
};

window.onload = () => setInterval(displayTimer, 1000);
