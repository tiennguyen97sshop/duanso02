const namesInput = document.getElementById("names");
const giftsInput = document.getElementById("gifts");
const wheelSection = document.getElementById("wheel-section");
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinButton");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popup-text");
const closePopup = document.getElementById("closePopup");
const historyTable = document.querySelector("#historyTable tbody");
const bgMusic = document.getElementById("bgMusic");
const winSound = document.getElementById("winSound");
const menuToggle = document.getElementById("menuToggle");
const menuContent = document.getElementById("menuContent");
const toggleMusic = document.getElementById("toggleMusic");

let segments = [];
let startAngle = 0;
let spinning = false;
let arc = 0;

function drawWheel() {
  const size = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (segments.length === 0) return;
  arc = Math.PI * 2 / segments.length;
  const colors = ["#FFEE58","#FF7043","#66BB6A","#29B6F6","#AB47BC","#EF5350"];
  for (let i = 0; i < segments.length; i++) {
    const angle = startAngle + i * arc;
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(size, size);
    ctx.arc(size, size, size, angle, angle + arc);
    ctx.fill();
    ctx.save();
    ctx.translate(size, size);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(segments[i], size - 10, 5);
    ctx.restore();
  }
}

function spin() {
  if (spinning || segments.length === 0) return;
  spinning = true;
  let spinTime = 0;
  const spinTotal = 4000 + Math.random() * 2000;
  const spinStart = 20 + Math.random() * 10;

  function rotate() {
    spinTime += 30;
    if (spinTime >= spinTotal) {
      finishSpin();
      return;
    }
    const ease = easeOut(spinTime, 0, spinStart, spinTotal);
    startAngle += (ease * Math.PI / 180);
    drawWheel();
    requestAnimationFrame(rotate);
  }
  rotate();
}

function easeOut(t, b, c, d) {
  t /= d;
  t--;
  return c*(t*t*t + 1) + b;
}

function finishSpin() {
  spinning = false;
  const degrees = startAngle * 180 / Math.PI + 90;
  const arcd = 360 / segments.length;
  const index = Math.floor((360 - (degrees % 360)) / arcd);
  const gift = segments[index];
  showPopup(gift);
}

function showPopup(gift) {
  popup.classList.remove("hidden");
  popupText.textContent = `Bạn đã trúng: ${gift}`;
  if (Math.random() < 0.01) { // Giải đặc biệt
    document.body.style.backgroundImage = "url('assets/fireworks.gif')";
    winSound.play();
  }
  saveHistory(gift);
}

closePopup.onclick = () => {
  popup.classList.add("hidden");
  document.body.style.backgroundImage = "";
};

function saveHistory(gift) {
  const names = namesInput.value.split(",").map(x=>x.trim()).filter(x=>x);
  const randomName = names.length ? names[Math.floor(Math.random()*names.length)] : "Người chơi";
  const time = new Date().toLocaleString("vi-VN");
  const history = JSON.parse(localStorage.getItem("history")||"[]");
  history.push({name:randomName,gift,time});
  localStorage.setItem("history",JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("history")||"[]");
  historyTable.innerHTML = history.map(h=>`<tr><td>${h.name}</td><td>${h.gift}</td><td>${h.time}</td></tr>`).join("");
}

menuToggle.onclick = ()=>menuContent.classList.toggle("hidden");
toggleMusic.onclick = ()=> bgMusic.paused ? bgMusic.play() : bgMusic.pause();

namesInput.oninput = giftsInput.oninput = ()=>{
  const gifts = giftsInput.value.split(",").map(g=>g.trim()).filter(g=>g);
  if (gifts.length > 0) {
    segments = gifts;
    drawWheel();
    wheelSection.classList.remove("hidden");
  }
};

spinBtn.onclick = spin;

renderHistory();