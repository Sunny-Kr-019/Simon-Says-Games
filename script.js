let acceptingInput = false;

// ================= SCORE =================
const scoreBoard = document.querySelector("#scoreBoard");
let highScore = localStorage.getItem("highScore") || 0;
scoreBoard.innerText = `Score: 0 | High Score: ${highScore}`;

// ================= ELEMENTS =================
const statusText = document.querySelector(".text-muted"); // FIXED
const startBtn = document.querySelector("#startBtn");
const gameBtns = document.querySelectorAll(".game-btn"); // FIXED

// ================= GAME DATA =================
let gameSeq = [];
let userSeq = [];
let btns = ["red", "green", "blue", "purple"];

let started = false;
let level = 0;

// ================= BUTTON ENABLE / DISABLE =================
function disableGameButtons() {
  gameBtns.forEach(btn => {
    btn.disabled = true;
    btn.classList.add("opacity-50");
  });
}

function enableGameButtons() {
  gameBtns.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("opacity-50");
  });
}

// ================= SOUND =================
function playSound(name) {
  let sound = new Audio(`sounds/${name}.mp3`);
  sound.play();
}

// ================= START GAME =================
startBtn.addEventListener("click", function () {
  if (!started) {
    started = true;

    gameSeq = [];
    userSeq = [];
    level = 0;

    startBtn.disabled = true;
    statusText.innerText = "Game Started 🎮";

    setTimeout(levelUp, 500);
  }
});

// ================= FLASH =================
function gameFlash(btn) {
  playSound(btn.id);
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 300);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => btn.classList.remove("userflash"), 200);
}

// ================= LEVEL UP =================
function levelUp() {
  userSeq = [];
  level++;

  statusText.innerText = `Level ${level}`;
  scoreBoard.innerText = `Score: ${level - 1} | High Score: ${highScore}`;

  acceptingInput = false;
  disableGameButtons();

  let randColor = btns[Math.floor(Math.random() * btns.length)];
  gameSeq.push(randColor);

  setTimeout(() => {
    let randBtn = document.querySelector(`#${randColor}`);
    gameFlash(randBtn);
    acceptingInput = true;
    enableGameButtons();
  }, 700);
}

// ================= CHECK ANSWER =================
function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      // 👇 yahan buttons disable NAHI karenge
      acceptingInput = false;

      setTimeout(() => {
        levelUp();
      }, 600);
    }
  } else {
    gameOver();
  }
}


// ================= GAME OVER =================
function gameOver() {
  playSound("wrong");

  let finalScore = level - 1;
  if (finalScore > highScore) {
    highScore = finalScore;
    localStorage.setItem("highScore", highScore);
  }

  statusText.innerHTML = `❌ Game Over! Score: ${finalScore}`;
  scoreBoard.innerText = `Score: 0 | High Score: ${highScore}`;

  document.body.classList.add("bg-danger", "text-white");
  setTimeout(() => {
    document.body.classList.remove("bg-danger", "text-white");
  }, 400);

  reset();
}

// ================= USER CLICK =================
gameBtns.forEach(btn => {
  btn.addEventListener("click", function () {
    if (!acceptingInput) return;

    userFlash(this);
    playSound(this.id);

    userSeq.push(this.id);
    checkAns(userSeq.length - 1);
  });
});

// ================= RESET =================
function reset() {
  started = false;
  level = 0;
  gameSeq = [];
  userSeq = [];
  acceptingInput = false;

  enableGameButtons();
  startBtn.disabled = false;
  statusText.innerText = "Click Start Game to begin.";
}
