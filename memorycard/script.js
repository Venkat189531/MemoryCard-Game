const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves-count');
const timeDisplay = document.getElementById('time-display');
const newGameBtn = document.getElementById('new-game-btn');
const winModal = document.getElementById('win-modal');
const finalTimeDisplay = document.getElementById('final-time');
const finalMovesDisplay = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let time = 0;
let timerInterval;
let matchedPairs = 0;
//taken from google
const items = ['🚀', '🌟', '🎮', '🎨', '🎵', '🍕', '🐱', '🌈'];

function initGame() {
    moves = 0;
    time = 0;
    matchedPairs = 0;
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    movesDisplay.textContent = moves;
    timeDisplay.textContent = '00:00';
    winModal.classList.add('hidden');
    clearInterval(timerInterval);
    const deck = [...items, ...items];
    shuffle(deck);
    gameBoard.innerHTML = '';
    deck.forEach(item => {
        const card = createCard(item);
        gameBoard.appendChild(card);
    });
    startTimer();
}

function createCard(item) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.framework = item;

    const frontFace = document.createElement('div');
    frontFace.classList.add('card-face', 'card-front');

    const backFace = document.createElement('div');
    backFace.classList.add('card-face', 'card-back');
    backFace.textContent = item;

    card.appendChild(frontFace);
    card.appendChild(backFace);

    card.addEventListener('click', flipCard);
    return card;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
    incrementMoves();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    matchedPairs++;
    resetBoard();

    if (matchedPairs === items.length) {
        endGame();
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function incrementMoves() {
    moves++;
    movesDisplay.textContent = moves;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    const startTime = Date.now();
    timerInterval = setInterval(() => {
        const delta = Date.now() - startTime;
        time = Math.floor(delta / 1000);
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        timeDisplay.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    setTimeout(() => {
        finalMovesDisplay.textContent = moves;
        finalTimeDisplay.textContent = timeDisplay.textContent;
        winModal.classList.remove('hidden');
    }, 500);
}

newGameBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Start game on load
initGame();

