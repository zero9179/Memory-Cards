const cardContainer = document.getElementById("card-container");
const countShow = document.getElementById("countShow");
const countDownContainer = document.getElementById("countDown-container");
// const arr = ["A", "B", "C", "D", "A", "B", "C", "D"];
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

let arrLength = arr.length / 2; //for checking all flipped

// function for suffle Array
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

    const card = document.createElement("div");
    card.appendChild(imgDiv);
    card.classList.add("card", "temp"); // <-- include .temp for center animation
    card.dataset.value = item.name;
    card.dataset.index = idx;
    card.textContent = "";

    // delay the animation to stagger them
    card.style.animationDelay = `${idx * 100}ms`;

    // Append to grid
    cardContainer.appendChild(card);

    // After animation finishes (600ms + delay), switch to grid
    setTimeout(() => {
      card.classList.remove("temp"); // removes absolute
      card.style.position = "";
      card.style.transform = "";
      card.style.opacity = "";
      card.style.animation = "";
    }, 100 + idx * 100); // total = animation duration + delay

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
      time = timer();
      countDownContainer.textContent = timer();
    }, 1000);
  }

  count++;
  countShow.textContent = count;

  // let selectedCard = e.target;
  let selectedCard = e.target;


  if (lock || selectedCard.classList.contains("flipped")) return;
  console.log("selected:", selectedCard.dataset.value);

  selectedCard.classList.add("flipped");
  selectedCard.textContent = selectedCard.dataset.value;
 
  if (!first) {
    first = selectedCard;
  } else {
    second = selectedCard;
    lock = true;

    //if mattched
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
        first.textContent = "";
        second.textContent = "";
        first = null;
        second = null;
        lock = false;
      }, 800);
    }
  }
  // ======= If all Flipped ==========
  if (allFlipped === arrLength) {
    clearInterval(intervalId);
    cardContainer.innerHTML = "";

    const wonDisplay = document.createElement("div");
    wonDisplay.classList.add("wonDisplay-container");

    const restart = document.createElement("button");
    restart.classList.add("restar-btn");
    restart.textContent = "Replay";
    restart.addEventListener("click", restartGame);

    // =================output in card container =======================
    wonDisplay.innerHTML = `<h1>You Won in ${time} and ${count} chance</h1>`;
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

// ==============timer function ======================

function timer() {
  startS++;
  if (startS === 60) {
    startS = 0;
    startM++;
  }
  let seconds = startS < 10 ? `0${startS}` : startS;
  let minutes = startM < 10 ? `0${startM}` : startM;
  // console.log("time", minutes, ":", seconds);
  return `${minutes}:${seconds}`;
}
