const namesInput = document.getElementById("names");
const giftsInput = document.getElementById("gifts");
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
const clearNames = document.getElementById("clearNames");
const clearGifts = document.getElementById("clearGifts");
const clearHistoryBottom = document.getElementById("clearHistoryBottom");

let spinning = false, startAngle = 0, arc = 0;
let segments = [];
let musicOn = false;

// dữ liệu mặc định
const defaultNames = ["Tiến","Hường","Tuấn","Huyền","Đạt","Bin"];
const defaultGifts = ["100K","50K","Bút","Cặp Sách","Quần Đùi"];
namesInput.value = defaultNames.join(", ");
giftsInput.value = defaultGifts.join(", ");

function randomColor() {
  return `hsl(${Math.random() * 360},80%,60%)`;
}

function drawWheel() {
  const size = canvas.width / 2;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if (!segments.length) return;
  arc = Math.PI * 2 / segments.length;
  for (let i=0;i<segments.length;i++){
    const angle = startAngle + i * arc;
    ctx.beginPath();
    ctx.fillStyle = segments[i].color;
    ctx.moveTo(size,size);
    ctx.arc(size,size,size,angle,angle+arc);
    ctx.fill();
    ctx.save();
    ctx.translate(size,size);
    ctx.rotate(angle + arc/2);
    ctx.fillStyle = "#000";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(segments[i].label, size-10, 5);
    ctx.restore();
  }
}

function updateSegments(){
  let gifts = giftsInput.value.split(",").map(x=>x.trim()).filter(x=>x);
  if (!gifts.length) gifts = defaultGifts;
  segments = gifts.map(g=>({label:g,color:randomColor()}));
  drawWheel();
}

function spin(){
  if (spinning || !segments.length) return;
  spinning = true;
  const spinTimeTotal = 4000 + Math.random()*2000;
  let spinTime = 0;
  let spinVel = 30 + Math.random()*10;

  function rotate(){
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
      finishSpin();
      return;
    }
    const ease = easeOut(spinTime, 0, spinVel, spinTimeTotal);
    startAngle += (ease * Math.PI/180);
    drawWheel();
    requestAnimationFrame(rotate);
  }
  rotate();
}

function easeOut(t,b,c,d){t/=d; t--; return c*(t*t*t+1)+b;}

function finishSpin(){
  spinning = false;
  const degrees = startAngle * 180/Math.PI + 90;
  const arcd = 360 / segments.length;
  const index = Math.floor((360 - (degrees % 360)) / arcd);
  const gift = segments[index].label;
  showPopup(gift);
}

function showPopup(gift){
  const names = namesInput.value.split(",").map(x=>x.trim()).filter(x=>x);
  const randomName = names.length ? names[Math.floor(Math.random()*names.length)] : "Người chơi";

  popup.classList.remove("hidden");
  popupText.innerHTML = `🎉 <b>Chúc mừng ${randomName}</b> đã nhận được <b>${gift}</b>! 🎁`;

  if (Math.random() < 0.01){ // Giải đặc biệt
    winSound.play();
  }

  saveHistory(randomName, gift);
}

closePopup.onclick = ()=> popup.classList.add("hidden");

function saveHistory(name, gift){
  const time = new Date().toLocaleString("vi-VN");
  const history = JSON.parse(localStorage.getItem("history")||"[]");
  history.push({name, gift, time});
  localStorage.setItem("history",JSON.stringify(history));
  renderHistory();
}

function renderHistory(){
  const history = JSON.parse(localStorage.getItem("history")||"[]");
  const last10 = history.slice(-10);
  historyTable.innerHTML = last10.map(h=>`<tr><td>${h.name}</td><td>${h.gift}</td><td>${h.time}</td></tr>`).join("");
}

toggleMusic.onclick = async ()=>{
  try {
    if (!musicOn) {
      await bgMusic.play();
      musicOn = true;
      toggleMusic.textContent = "🔇 Tắt nhạc";
    } else {
      bgMusic.pause();
      musicOn = false;
      toggleMusic.textContent = "🔊 Mở nhạc";
    }
  } catch(e) {
    alert("Hãy chạm vào màn hình hoặc bấm nút một lần để bật nhạc 🎵");
  }
};

menuToggle.onclick = ()=> menuContent.classList.toggle("hidden");
clearNames.onclick = ()=> namesInput.value="";
clearGifts.onclick = ()=>{ giftsInput.value=""; segments=[]; drawWheel(); };
clearHistoryBottom.onclick = ()=>{ localStorage.removeItem("history"); renderHistory(); };

namesInput.oninput = giftsInput.oninput = updateSegments;
spinBtn.onclick = spin;

updateSegments();
renderHistory();