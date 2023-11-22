const canvas = document.getElementById('ticTacToeCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const message = document.getElementById('message');
const boardSize = 3;
let cellSize; 
let currentPlayer;
let gameOver;


let winsX = 0;
let winsO = 0;


const playerDisplay = document.getElementById('playerDisplay');
const winsDisplay = document.getElementById('winsDisplay');


canvas.addEventListener('mousemove', (e) => {
  if (gameOver) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  
  const cellX = Math.floor(x / cellSize);
  const cellY = Math.floor(y / cellSize);
  
  drawBoard();
  if (board[cellY][cellX] === null) {
    ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'; 
    ctx.fillRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
  }
});

function updateDisplay() {
  const name = currentPlayer === 'X' ? nameX : nameO;
  playerDisplay.textContent = `Spieler ${name} ist dran`;
  winsDisplay.textContent = `Siege ${nameX}: ${winsX} | Siege ${nameO}: ${winsO}`;
  playerDisplay.classList.add("highlight");
}


function resetWins() {
  winsX = 0;
  winsO = 0;
  updateDisplay();
}


function handleWin(winner) {
  if (winner === 'X') {
    winsX++;
  } else if (winner === 'O') {
    winsO++;
  }
  updateDisplay();
}


const nameX = prompt("Name des Spielers X:", "Spieler X") || "Spieler X";
const nameO = prompt("Name des Spielers O:", "Spieler O") || "Spieler O";


window.addEventListener('load', updateDisplay);


let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));


function resizeCanvas() {
  canvas.width = window.innerWidth / 2;
  canvas.height = canvas.width;
  cellSize = canvas.width / boardSize;
  drawBoard(); 
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); 


function resetGame() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
  currentPlayer = 'X';
  gameOver = false;
  message.textContent = '';
  drawBoard();
}
resetButton.addEventListener('click', resetGame);

function resetGame() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
  currentPlayer = 'X';
  gameOver = false;
  message.textContent = '';
  drawBoard();
}

function drawX(x, y) {
  ctx.beginPath();
  ctx.moveTo(x + cellSize * 0.2, y + cellSize * 0.2);
  ctx.lineTo(x + cellSize * 0.8, y + cellSize * 0.8);
  ctx.moveTo(x + cellSize * 0.8, y + cellSize * 0.2);
  ctx.lineTo(x + cellSize * 0.2, y + cellSize * 0.8);
  ctx.stroke();
}

function drawO(x, y) {
  ctx.beginPath();
  ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.3, 0, Math.PI * 2);
  ctx.stroke();
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#000';
  for (let i = 1; i < boardSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * canvas.width / boardSize, 0);
    ctx.lineTo(i * canvas.width / boardSize, canvas.height);
    ctx.moveTo(0, i * canvas.height / boardSize);
    ctx.lineTo(canvas.width, i * canvas.height / boardSize);
    ctx.stroke();
  }
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      const posX = x * canvas.width / boardSize;
      const posY = y * canvas.height / boardSize;
      if (cell === 'X') {
        drawX(posX, posY);
      } else if (cell === 'O') {
        drawO(posX, posY);
      }
    });
  });
}

canvas.addEventListener('click', (e) => {
  if (gameOver) return;

 
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);

 
  const cellX = Math.floor(x / cellSize);
  const cellY = Math.floor(y / cellSize);

 
  if (board[cellY][cellX]) return;

  
  board[cellY][cellX] = currentPlayer;

  
  drawBoard();

  
  const winner = checkWin();
  if (checkWin()) {
    gameOver = true;
    handleWin(currentPlayer);
    message.textContent = winner === 'Draw' ? 'Unentschieden!' : currentPlayer + ' hat gewonnen!';
    if (winner !== 'Draw') {
      triggerFireworks();
    }
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateDisplay(); 
  }
});

function checkWin() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Reihen
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Spalten
    [0, 4, 8], [2, 4, 6]             // Diagonalen
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[Math.floor(a / 3)][a % 3] && 
        board[Math.floor(a / 3)][a % 3] === board[Math.floor(b / 3)][b % 3] && 
        board[Math.floor(a / 3)][a % 3] === board[Math.floor(c / 3)][c % 3]) {
      gameOver = true; 
      return board[Math.floor(a / 3)][a % 3]; 
    }
  }

  if (board.flat().every(cell => cell !== null)) {
    gameOver = true; 
    return 'Draw';
  }

  return null; 
}

//Inspiriert von Vorstellung in Vorlesung und Seminar 

function triggerFireworks() {
  const fireworkColors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];

  function randomColor() {
    return fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
  }

  function createFirework(x, y) {
    let particleCount = 30;
    let particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: x,
        y: y,
        radius: Math.random() * 2 + 1,
        color: randomColor(),
        velocity: {
          x: Math.random() - 0.5,
          y: Math.random() - 0.5
        },
        decay: Math.random() * 0.015 + 0.005
      });
    }

    function draw() {
      ctx.globalCompositeOperation = 'lighter';
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function update() {
      for (let i = 0; i < particles.length; i++) {
          let p = particles[i];
          p.x += p.velocity.x * 5;
          p.y += p.velocity.y * 5;
          p.radius -= p.decay;
          
          if (p.radius < 0) {
              particles.splice(i, 1);
              i--;
          }
      }
      draw();
  }

    let animationFrameId;
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBoard();
      update();
  }

  animate();
}
  
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      createFirework(x, y);
    }, i * 300);
  }
}

resetGame(); 

