'use strict'

const MAX_ENEMIES = 7;
const HEIGHT_ELEM = 80;

const score = document.querySelector('.score'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.game-area'),
      gameAreaTexts = document.querySelectorAll('.game-area__text'),
      car = document.createElement('div'),
      btns = document.querySelectorAll('.btn'),
      modal = document.getElementById('modal'),
      modalContentText = document.querySelector('.modal-content__text'),
      modalClose = document.getElementById('close-modal');

const startmusic = new Audio('audio/Nine Thou.mp3');
const music = new Audio('audio/Shapeshifter.mp3');
const music2 = new Audio('audio/yoooo.mp3');  
const music3 = new Audio('audio/crash.mp3');  
const endmusic = new Audio('audio/Sets Go Up.mp3');

car.classList.add('car');

function startplaymusic(a) {
  if(a === true) {
    startmusic.play();
    startmusic.loop = true;
  } else {
    startmusic.pause();
  }
}
startplaymusic(true);
function endedmusic(a) {
  if(a === true) {
    endmusic.play();
    endmusic.loop = true;
  } else {
    endmusic.pause();
  }
}

// startplaymusic();

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 2
};



const changeLevel = (lvl) => {
  switch(lvl) {
    case '1':
      setting.traffic = 14;
      setting.speed = 6;
      break;
    case '2':
      setting.traffic = 9;
      setting.speed = 4;
      break;
    case '3':
      setting.traffic = 7;
      setting.speed = 2;
      break;
    case '4':
      setting.traffic = 1000;
      setting.speed = 5;
  }
}

function getQuantityElements(heightElement) {
  return gameArea.offsetHeight / heightElement + 1;
}

// const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1);

const getRandomEnemy = (max) => {
  const randomIndex = Math.floor(Math.random()*max) + 1;
  const randomEnemyImage = `./img/enemy${randomIndex}.png`;
  return {
    index: randomIndex,
    image: randomEnemyImage
  };
}


function startGame(event) {
  const target = event.target;
  if (!target.classList.contains('btn')) return;

  const levelGame = target.dataset.levelGame;

  changeLevel(levelGame);
  btns.forEach(btn => btn.disabled = true);

  gameArea.innerHTML = '';
  music.play(),music2.play();

  music.volume = 1;
  music.loop = true;
  startplaymusic(false);

  music2.play();
  music2.volume = .8;
  music2.loop = true;


  gameAreaTexts.forEach(text => text.classList.add('hide'));
  gameArea.style.outline = "2px solid #FFFFFF";
  gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM + 'px';

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement(`div`);
    line.classList.add('line');
    line.style.top = (i * HEIGHT_ELEM) + 'px';
    line.style.height = (HEIGHT_ELEM / 2) + 'px';
    line.y = i * HEIGHT_ELEM;
    gameArea.append(line);
  }


  // for (let i = 1; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
  //   const enemy = document.createElement('div');
  //   enemy.classList.add('enemy');
  //   enemy.y = -HEIGHT_ELEM * setting.traffic * i;
  //   const { index, image } = getRandomEnemy(MAX_ENEMIES);
  //   enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
  //   enemy.style.top = enemy.y + 'px';
  //   enemy.style.background = `
  //     transparent 
  //     url(${image})
  //     center / cover 
  //     no-repeat`;
  //   gameArea.appendChild(enemy);
  // }

    const numberOfEnemies = Math.floor(Math.random() * MAX_ENEMIES) + 1;

  for (let i = 1; i <= numberOfEnemies; i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ELEM * setting.traffic * i;
    const { index, image } = getRandomEnemy(MAX_ENEMIES);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `
      transparent 
      url(${image})
      center / cover 
      no-repeat`;
    gameArea.appendChild(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);
  car.style.left = '125px';
  car.style.top = 'auto ';
  car.style.bottom = '10px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}



function playGame() {
  if (setting.start) {
    moveRoad();
    moveEnemy();
    setting.score += .5;
    score.innerHTML = `<b>SCORE: ${setting.score}</b>`;

    if ((keys.ArrowLeft || keys.a) && setting.x > 0) {
      setting.x -= 5;
    }
    if ((keys.ArrowRight || keys.d) && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += 5;
    }
    if ((keys.ArrowUp || keys.w) && setting.y > 0) {
      setting.y -= setting.speed/2;
      // line.style.top = setting.speed + 'px';
      setting.speed+=0.4
    }
    if ((keys.ArrowDown || keys.s) && setting.y < (gameArea.offsetHeight + 1 - car.offsetHeight)) {
      setting.y += setting.speed/2;
      setting.speed-=0.4
    }

    if ((keys.f)) {
      setting.y += setting.speed/2;
      setting.speed-=0.4
    }
    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame);
  } else {
    music.pause();
    music2.pause();
    music3.play();
    music3.volume = 1;
    music3.loop = false;

    btns.forEach(btn => btn.disabled = false);
    showModal();
  }
}

function startRun(event) {
  if (keys.hasOwnProperty(event.key) && document.activeElement !== document.getElementById('nameInput')) {
    event.preventDefault();
    keys[event.key] = true;
  }
}

function stopRun(event) {
  if (keys.hasOwnProperty(event.key) && document.activeElement !== document.getElementById('nameInput')) {
    event.preventDefault();
    keys[event.key] = false;
  }
}


function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function(line) {
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if (line.y >= gameArea.offsetHeight) {
      line.y = -HEIGHT_ELEM;
    }
  })
}


function moveEnemy() {
  let enemies = document.querySelectorAll('.enemy');
  enemies.forEach(function(enemy) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = enemy.getBoundingClientRect();

    if (carRect.top <= enemyRect.bottom &&
        carRect.right >= enemyRect.left &&
        carRect.left <= enemyRect.right &&
        carRect.bottom >= enemyRect.top) {
          setting.start = false;
          start.classList.remove('hide');
    }
    enemy.y += setting.speed / 2;
    enemy.style.top = enemy.y + 'px';

    if (enemy.y >= gameArea.offsetHeight) {
      enemy.y = -HEIGHT_ELEM * setting.traffic;
      enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 80)) + 'px';
    }
  });
}

// Show Modal
function showModal() {
  modal.classList.add('show-modal');

  modalContentText.innerHTML = `Result: <span class="modal-content__score">${setting.score}</span>`;

  modalContentText.classList.add('show-modal__text');
  endedmusic(true);
  
}

modalClose.addEventListener('click', () => {
  modal.classList.remove('show-modal');
  window.location.href = 'index.html';
});


function addName() {
  var inputText = document.getElementById("nameInput").value;
  var inputNick = document.getElementById("nickInput").value;
  var motivationPhrases = [
      "Got Smoked out by silly traffic eh?",
      "You gotta go to some driving school.",
      "Oops ! was that a mistake?",
      "Think you can do it next time?",
      "Learn to cruse like a Cadillac roar like a jackal",
      "Keep your eyes on the road !",
      "Was the car too powerful for ya ?",
  ];
  var randomIndex = Math.floor(Math.random() * motivationPhrases.length);
  var randomPhrase = motivationPhrases[randomIndex];
  var gameOverText = "Hey " + inputText + " aka " + inputNick + ". " + randomPhrase;
  document.getElementById("gameOverText").innerHTML = gameOverText;
}

// Reset game

function resetGame() {
  window.location.href = 'index.html';
}
