const namesInput = document.getElementById("names");
const giftsInput = document.getElementById("gifts");
const generateBtn = document.getElementById("generateWheel");
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

let segments = ["Quà 1","Quà 2","Quà 3","Quà 4","Quà 5","Quà 6"];
let arc = Math.PI * 2 / segments.length;
let startAngle = 0;
let spinTimeout = null;
let spinAngle = 0;
let spinning = false;

function drawWheel(){
  const colors = ["#FFEE58","#FF7043","#66BB6A","#29B6F6","#AB47BC","#EF5350"];
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<segments.length;i++){
    const angle = startAngle + i*arc;
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(150,150);
    ctx.arc(150,150,150,angle,angle+arc);
    ctx.fill();
    ctx.save();
    ctx.translate(150,150);
    ctx.rotate(angle+arc/2);
    ctx.textAlign="right";
    ctx.fillStyle="#000";
    ctx.font="bold 14px sans-serif";
    ctx.fillText(segments[i],130,5);
    ctx.restore();
  }
}

function spin(){
  if(spinning) return;
  spinning = true;
  let spinAngleStart = Math.random() * 10 + 10;
  let spinTime = 0;
  let spinTimeTotal = 3000 + Math.random()*2000;

  function rotateWheel(){
    spinTime += 30;
    if(spinTime >= spinTimeTotal){
      stopRotate();
      return;
    }
    const ease = easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (ease * Math.PI / 180);
    drawWheel();
    spinTimeout = setTimeout(rotateWheel,30);
  }
  rotateWheel();
}

function stopRotate(){
  clearTimeout(spinTimeout);
  const degrees = startAngle * 180 / Math.PI + 90;
  const arcd = 360 / segments.length;
  const index = Math.floor((360 - (degrees % 360)) / arcd);
  const gift = segments[index];
  showPopup(gift);
  spinning = false;
}

function easeOut(t,b,c,d){ return c*((t=t/d-1)*t*t + 1) + b; }

function showPopup(gift){
  popup.classList.remove("hidden");
  popupText.textContent = `Bạn đã trúng: ${gift}`;
  if(Math.random()<0.01){
    document.body.style.backgroundImage = "url('assets/fireworks.gif')";
    winSound.play();
  }
  saveHistory(gift);
}

closePopup.onclick=()=>{
  popup.classList.add("hidden");
  document.body.style.backgroundImage = "";
};

generateBtn.onclick=()=>{
  const gifts = giftsInput.value.split(",").map(g=>g.trim()).filter(g=>g);
  if(gifts.length>0){ segments = gifts; arc=Math.PI*2/segments.length; drawWheel(); wheelSection.classList.remove("hidden"); }
};

spinBtn.onclick=spin;

menuToggle.onclick=()=>menuContent.classList.toggle("hidden");
toggleMusic.onclick=()=> bgMusic.paused ? bgMusic.play() : bgMusic.pause();

function saveHistory(gift){
  const nameList = namesInput.value.split(",").map(n=>n.trim()).filter(n=>n);
  const randomName = nameList[Math.floor(Math.random()*nameList.length)] || "Người chơi";
  const time = new Date().toLocaleString("vi-VN");
  const data = {name:randomName,gift,time};
  const old = JSON.parse(localStorage.getItem("history")||"[]");
  old.push(data);
  localStorage.setItem("history",JSON.stringify(old));
  renderHistory();
}

function renderHistory(){
  const list = JSON.parse(localStorage.getItem("history")||"[]");
  historyTable.innerHTML = list.map(e=>`<tr><td>${e.name}</td><td>${e.gift}</td><td>${e.time}</td></tr>`).join("");
}
renderHistory();
drawWheel();