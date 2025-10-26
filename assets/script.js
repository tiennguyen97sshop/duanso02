const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");
const closePopup = document.getElementById("closePopup");
const fireworks = document.querySelector(".fireworks");
const bgMusic = document.getElementById("bgMusic");
const spinSound = document.getElementById("spinSound");

let names = [];
let prizes = [];
let winners = JSON.parse(localStorage.getItem("winners")) || [];
let currentAngle = 0;
let spinning = false;

// pastel color generator
function pastelColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 80%)`;
}

function drawWheel(items) {
  const num = items.length;
  const arc = (2 * Math.PI) / num;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < num; i++) {
    const start = i * arc + currentAngle;
    ctx.beginPath();
    ctx.fillStyle = pastelColor();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, start, start + arc);
    ctx.lineTo(150, 150);
    ctx.fill();
    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#333";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(items[i], 135, 5);
    ctx.restore();
  }
}

function updateWinners() {
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
  if (prizes.length) {
    document.getElementById("wheelSection").classList.remove("hidden");
    drawWheel(prizes);
  }
});

// Khi quay xong:
popup.classList.add("active"); // thay vì remove "hidden"

// Nút óng popup:
closePopup.addEventListener("click", () => {
  popup.classList.remove("active"); // thay vì add "hidden"
});

spinBtn.addEventListener("click", () => {
  if (spinning || !prizes.length) return;
  spinning = true;

  if (document.getElementById("soundToggle").checked) spinSound.play();

  const randomDeg = 3600 + Math.random() * 720;
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
      const index = Math.floor(((2 * Math.PI) - (currentAngle % (2 * Math.PI))) / ((2 * Math.PI) / prizes.length)) % prizes.length;
      const prize = prizes[index];
      const name = names[Math.floor(Math.random() * names.length)] || "Ngi chi";
      const special = Math.random() < 0.01;
      const time = new Date().toLocaleString();

      winners.push({ name, prize, time });
      localStorage.setItem("winners", JSON.stringify(winners));
      updateWinners();

      popupTitle.textContent = special ? " GII C BIT " : "Chúc mng!";
      popupText.textContent = `${name} nhn c: ${prize}`;
      fireworks.classList.toggle("hidden", !special);
      popup.classList.remove("hidden");
    }
  });
});

closePopup.addEventListener("click", () => {
  popup.classList.add("hidden");
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("menuContent").classList.toggle("hidden");
});

document.getElementById("musicToggle").addEventListener("change", (e) => {
  if (e.target.checked) bgMusic.play();
  else bgMusic.pause();
});

window.addEventListener("load", () => {
  updateWinners();
  bgMusic.volume = 0.3;
  if (document.getElementById("musicToggle").checked) bgMusic.play();
});