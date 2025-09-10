const cardContainer = document.getElementById("card-container");
const countShow = document.getElementById("countShow");
const countDownContainer = document.getElementById("countDown-container");

let arr = [
  { name: "A", img: "./assets/mongoDB.png" },
  { name: "B", img: "./assets/express.png" },
  { name: "C", img: "./assets/react.png" },
  { name: "D", img: "./assets/node.png" },
  { name: "A", img: "./assets/mongoDB.png" },
  { name: "B", img: "./assets/express.png" },
  { name: "C", img: "./assets/react.png" },
  { name: "D", img: "./assets/node.png" },
];

let arrLength = arr.length / 2;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const gameStart = () => {
  const shuffledArray = shuffleArray(arr);
  shuffledArray.forEach((item, idx) => {
    const imgDiv = document.createElement("div");
    imgDiv.style.backgroundImage = `url(${item.img})`;
    imgDiv.classList.add("imgHidden");
    imgDiv.style.opacity = "0";

    const card = document.createElement("div");
    card.appendChild(imgDiv);
    card.classList.add("card", "temp");
    card.dataset.value = item.name;
    card.dataset.index = idx;

    card.style.animationDelay = `${idx * 100}ms`;

    cardContainer.appendChild(card);

    setTimeout(() => {
      card.classList.remove("temp");
      card.style.position = "";
      card.style.transform = "";
      card.style.opacity = "";
      card.style.animation = "";
    }, 100 + idx * 100);

    card.addEventListener("click", handleClick);
  });
};
gameStart();

let first = null;
let second = null;
let lock = false;
let allFlipped = 0;
let count = 0;
let startS = 0;
let startM = 0;
let firstClick = true;
let intervalId = null;
let time = "00:00";

function handleClick(e) {
  if (firstClick) {
    firstClick = false;
    intervalId = setInterval(() => {
      countDownContainer.textContent = timer();
    }, 1000);
  }

  count++;
  countShow.textContent = count;

  let selectedCard = e.target.closest(".card");

  if (lock || selectedCard.classList.contains("flipped")) return;

  selectedCard.classList.add("flipped");

  const imgDiv = selectedCard.querySelector(".imgHidden");
  if (imgDiv) {
    imgDiv.style.opacity = "1";
  } else {
    console.warn("imgHidden not found in:", selectedCard);
  }

  if (!first) {
    first = selectedCard;
  } else {
    second = selectedCard;
    lock = true;

    if (first.dataset.value === second.dataset.value) {
      allFlipped++;
      first.classList.add("flipped");
      second.classList.add("flipped");
      first = null;
      second = null;
      lock = false;
    } else {
      first.classList.add("slide");
      second.classList.add("slide");
      setTimeout(() => {
        first.classList.remove("flipped", "slide");
        second.classList.remove("flipped", "slide");

        const img1 = first.querySelector(".imgHidden");
        const img2 = second.querySelector(".imgHidden");
        if (img1) img1.style.opacity = "0";
        if (img2) img2.style.opacity = "0";

        first = null;
        second = null;
        lock = false;
      }, 800);
    }
  }

  if (allFlipped === arrLength) {
    clearInterval(intervalId);
    cardContainer.innerHTML = "";

    const wonDisplay = document.createElement("div");
    wonDisplay.classList.add("wonDisplay-container");

    const restart = document.createElement("button");
    restart.classList.add("restar-btn");
    restart.textContent = "Replay";
    restart.addEventListener("click", restartGame);

    wonDisplay.innerHTML = `<h1>You Won in <span style="color: red;">${time}</span> s and ${count} chance</h1>`;
    wonDisplay.appendChild(restart);
    cardContainer.appendChild(wonDisplay);

    countDownContainer.textContent = "00:00";
    countShow.textContent = "0";
  }
}

function restartGame() {
  allFlipped = 0;
  first = null;
  second = null;
  lock = false;
  clearInterval(intervalId);
  firstClick = true;
  count = 0;
  startM = 0;
  startS = 0;
  countShow.textContent = count;
  cardContainer.innerHTML = "";
  countDownContainer.innerHTML = "00:00";
  gameStart();
}

function timer() {
  startS++;
  if (startS === 60) {
    startS = 0;
    startM++;
  }
  let seconds = startS < 10 ? `0${startS}` : startS;
  let minutes = startM < 10 ? `0${startM}` : startM;
  time = `${minutes}:${seconds}`
  return `${minutes}:${seconds}`;
}
