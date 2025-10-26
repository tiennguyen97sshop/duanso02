let names = [];
let gifts = [];
let spinning = false;
let soundEnabled = true;

const ctx = document.getElementById('wheel').getContext('2d');
let colors = ['#ff6384','#36a2eb','#ffce56','#4bc0c0','#9966ff','#ff9f40'];

function drawWheel() {
  let slices = gifts.length;
  let angle = 2 * Math.PI / slices;
  for (let i = 0; i < slices; i++) {
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, i * angle, (i + 1) * angle);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(i * angle + angle / 2);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'right';
    ctx.font = '16px Segoe UI';
    ctx.fillText(gifts[i], 180, 5);
    ctx.restore();
  }
}

function saveData() {
  names = document.getElementById('names').value.split(',').map(x => x.trim()).filter(x=>x);
  gifts = document.getElementById('gifts').value.split(',').map(x => x.trim()).filter(x=>x);
  localStorage.setItem('names', JSON.stringify(names));
  localStorage.setItem('gifts', JSON.stringify(gifts));
  if(gifts.length>0) drawWheel();
}

function resetData() {
  localStorage.clear();
  names=[]; gifts=[];
  document.getElementById('giftList').innerHTML='<tr><th>Tên</th><th>Quà</th><th>Thời gian</th></tr>';
}

function toggleMenu(){
  const menu=document.getElementById('settingsMenu');
  menu.style.display=(menu.style.display==='block')?'none':'block';
}

function toggleSound(){
  soundEnabled=!soundEnabled;
  if(!soundEnabled){document.getElementById('bgMusic').pause();}
  else{document.getElementById('bgMusic').play();}
}

window.onload = () => {
  const n = localStorage.getItem('names');
  const g = localStorage.getItem('gifts');
  if(n && g){
    names = JSON.parse(n); gifts = JSON.parse(g); drawWheel();
  }
  const bgm = document.getElementById('bgMusic');
  bgm.volume = 0.2; bgm.play();
};

function spinWheel() {
  if (spinning || gifts.length === 0 || names.length === 0) return;
  spinning = true;
  let deg = Math.floor(5000 + Math.random() * 5000);
  const sound = document.getElementById('tickSound');
  let rotation = 0;
  let spin = setInterval(() => {
    ctx.clearRect(0,0,400,400);
    ctx.save();
    ctx.translate(200,200);
    ctx.rotate((rotation * Math.PI)/180);
    ctx.translate(-200,-200);
    drawWheel();
    ctx.restore();
    rotation += 20;
    if (soundEnabled) sound.play();
    if (rotation >= deg) {
      clearInterval(spin);
      spinning = false;
      const index = Math.floor(((deg % 360) / 360) * gifts.length);
      const selectedGift = gifts[gifts.length - 1 - index];
      const selectedName = names[Math.floor(Math.random() * names.length)];
      showPopup(selectedName, selectedGift);
    }
  }, 20);
}

function showPopup(name, gift){
  const popup=document.getElementById('popup');
  const result=document.getElementById('popupResult');
  result.innerText = `${name} nhận được ${gift}!`;
  popup.style.display='flex';
  const now=new Date().toLocaleString();
  let table=document.getElementById('giftList');
  table.innerHTML+=`<tr><td>${name}</td><td>${gift}</td><td>${now}</td></tr>`;
  localStorage.setItem('giftList', table.innerHTML);
}

function closePopup(){
  document.getElementById('popup').style.display='none';
}
