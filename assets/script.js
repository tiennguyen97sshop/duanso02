const wheelCanvas = document.getElementById("wheelCanvas");
const ctx = wheelCanvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");
const closePopup = document.getElementById("closePopup");
const fireworks = document.querySelector(".fireworks");

const bgMusic = document.getElementById("bgMusic");
const spinSound = document.getElementById("spinSound");

const musicToggle = document.getElementById("musicToggle");
const soundToggle = document.getElementById("soundToggle");

let names = [];
let prizes = [];
let winners = JSON.parse(localStorage.getItem("winners")) || [];

let spinning = false;
let currentAngle = 0;
let wheelColors = [];

function randomColor() {
  const r = Math.floor(Math.random() * 200 + 55);
  const g = Math.floor(Math.random() * 200 + 55);
  const b = Math.floor(Math.random() * 200 + 55);
  return `rgb(${r},${g},${b})`;
}

function drawWheel(items) {
  const num = items.length;
  const arc = (2 * Math.PI) / num;
  wheelColors = Array(num).fill().map(randomColor);

  ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
  for (let i = 0; i < num; i++) {
    const start = i * arc + currentAngle;
    ctx.beginPath();
    ctx.fillStyle = wheelColors[i];
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, start, start + arc);
    ctx.lineTo(150, 150);
    ctx.fill();
    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(items[i], 140, 5);
    ctx.restore();
  }
}

function updateWinnersList() {
  const list = document.getElementById("winnersList");
  list.innerHTML = "";
  winners.forEach(w => {
    const li = document.createElement("li");
    li.textContent = `${w.name} | ${w.prize} (${w.time})`;
    list.appendChild(li);
  });
}

document.getElementById("updateWheel").addEventListener("click", () => {
  names = document.getElementById("namesInput").value.split(",").map(n => n.trim()).filter(Boolean);
  prizes = document.getElementById("prizesInput").value.split(",").map(n => n.trim()).filter(Boolean);
  if (names.length && prizes.length) {
    document.getElementById("wheelSection").classList.remove("hidden");
    drawWheel(prizes);
  }
});

spinBtn.addEventListener("click", () => {
  if (spinning || !prizes.length) return;
  spinning = true;

  if (soundToggle.checked) spinSound.play();

  const randomDeg = 3600 + Math.random() * 360;
  const duration = 4000;
  const start = performance.now();

  requestAnimationFrame(function rotate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    currentAngle = (randomDeg * progress * Math.PI) / 180;
    drawWheel(prizes);
    if (progress < 1) requestAnimationFrame(rotate);
    else {
      spinning = false;
      const idx = Math.floor(((2 * Math.PI) - (currentAngle % (2 * Math.PI))) / ((2 * Math.PI) / prizes.length)) % prizes.length;
      const prize = prizes[idx];
      const name = names[Math.floor(Math.random() * names.length)];
      const isSpecial = Math.random() < 0.01;
      const time = new Date().toLocaleString();

      winners.push({ name, prize, time });
      localStorage.setItem("winners", JSON.stringify(winners));
      updateWinnersList();

      popupTitle.textContent = isSpecial ? "🎉 GIẢI ĐẶC BIỆT 🎉" : "Chúc mừng!";
      popupText.textContent = `${name} nhận được: ${prize}`;
      popup.classList.remove("hidden");
      fireworks.classList.toggle("hidden", !isSpecial);
    }
  });
});

closePopup.addEventListener("click", () => {
  popup.classList.add("hidden");
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("menuContent").classList.toggle("hidden");
});

musicToggle.addEventListener("change", () => {
  if (musicToggle.checked) bgMusic.play();
  else bgMusic.pause();
});

soundToggle.addEventListener("change", () => {
  if (!soundToggle.checked) spinSound.pause();
});

window.addEventListener("load", () => {
  updateWinnersList();
  bgMusic.volume = 0.3;
  if (musicToggle.checked) bgMusic.play();
});