// Initialize variables
let player1Health = 20;
let player2Health = 20;
let currentPlayer = null;  // 1 for Player 1, 2 for Player 2
let isGameActive = true;
let player1Deck = [];
let player2Deck = [];

// Elements
const player1HealthEl = document.getElementById('player1Health');
const player2HealthEl = document.getElementById('player2Health');
const player1RollBtn = document.getElementById('player1Roll');
const player2RollBtn = document.getElementById('player2Roll');
const rollDiceBtn = document.getElementById('rollDice');
const statusText = document.getElementById('statusText');
const player1DeckEl = document.getElementById('player1Deck');
const player2DeckEl = document.getElementById('player2Deck');

// Helper function to generate random cards with values between 1 and 50
// Helper function to generate a shuffled array of unique cards between 1 and 50
function generateRandomDeck() {
    const deck = [];
    const cardPool = Array.from({ length: 50 }, (_, i) => i + 1); // Array [1, 2, ..., 50]
    
    // Shuffle the cardPool using the Fisher-Yates algorithm
    for (let i = cardPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPool[i], cardPool[j]] = [cardPool[j], cardPool[i]]; // Swap
    }
    
    // Take the first 20 cards for each player
    for (let i = 0; i < 20; i++) {
        deck.push(cardPool[i]);
    }

    return deck;
}

// Function to render the deck as a list
function renderDeck(deck, deckElement) {
    deckElement.innerHTML = '';  // Clear the previous deck display
    deck.forEach(card => {
        const li = document.createElement('li');
        li.textContent = card;
        deckElement.appendChild(li);
    });
}

// Start the game by generating decks and rendering them
function initializeGame() {
    player1Deck = generateRandomDeck();
    player2Deck = generateRandomDeck();
    player1Health = 1000;
    player2Health = 1000;
    player1HealthEl.textContent = player1Health;
    player2HealthEl.textContent = player2Health;
    isGameActive = true;
    rollDiceBtn.disabled = false;
    player1RollBtn.disabled = true;
    player2RollBtn.disabled = true;
    statusText.textContent = 'Click to roll the dice to see who attacks first!';
    renderDeck(player1Deck, player1DeckEl);  // Display Player 1's deck
    renderDeck(player2Deck, player2DeckEl);  // Display Player 2's deck
}

// Roll Dice to determine who attacks first
rollDiceBtn.addEventListener('click', function() {
    if (!isGameActive) return;

    const player1Roll = Math.floor(Math.random() * 6) + 1;
    const player2Roll = Math.floor(Math.random() * 6) + 1;

    statusText.textContent = `Player 1 rolled ${player1Roll}, Player 2 rolled ${player2Roll}.`;

    if (player1Roll > player2Roll) {
        statusText.textContent += ' Player 1 attacks first!';
        currentPlayer = 1;
        player1RollBtn.disabled = false;
    } else if (player2Roll > player1Roll) {
        statusText.textContent += ' Player 2 attacks first!';
        currentPlayer = 2;
        player2RollBtn.disabled = false;
    } else {
        statusText.textContent += ' It\'s a tie! Roll again.';
    }

    rollDiceBtn.disabled = true;  // Disable the dice roll button after first roll
});

// Attack functionality for Player 1
player1RollBtn.addEventListener('click', function() {
    if (currentPlayer !== 1 || !isGameActive) return;

    if (player1Deck.length === 0) {
        statusText.textContent = 'Player 1 is out of cards!';
        return;
    }

    const attackPower = player1Deck.pop();  // Get the last card from Player 1's deck
    player2Health -= attackPower;

    statusText.textContent = `Player 1 attacks with ${attackPower} damage using a card!`;
    player2HealthEl.textContent = Math.max(player2Health, 0);  // Update health display

    renderDeck(player1Deck, player1DeckEl);  // Update Player 1's deck display

    if (player2Health <= 0) {
        endGame(1); // Player 1 wins
    } else {
        switchTurns(); // Switch to Player 2
    }
});

// Attack functionality for Player 2
player2RollBtn.addEventListener('click', function() {
    if (currentPlayer !== 2 || !isGameActive) return;

    if (player2Deck.length === 0) {
        statusText.textContent = 'Player 2 is out of cards!';
        return;
    }

    const attackPower = player2Deck.pop();  // Get the last card from Player 2's deck
    player1Health -= attackPower;

    statusText.textContent = `Player 2 attacks with ${attackPower} damage using a card!`;
    player1HealthEl.textContent = Math.max(player1Health, 0);  // Update health display

    renderDeck(player2Deck, player2DeckEl);  // Update Player 2's deck display

    if (player1Health <= 0) {
        endGame(2); // Player 2 wins
    } else {
        switchTurns(); // Switch to Player 1
    }
});

// Switch turns between players
function switchTurns() {
    if (currentPlayer === 1) {
        currentPlayer = 2;
        player1RollBtn.disabled = true;
        player2RollBtn.disabled = false;
        statusText.textContent = 'Player 2\'s turn to attack!';
    } else {
        currentPlayer = 1;
        player2RollBtn.disabled = true;
        player1RollBtn.disabled = false;
        statusText.textContent = 'Player 1\'s turn to attack!';
    }
}

// End the game
function endGame(winner) {
    isGameActive = false;
    statusText.textContent = `Player ${winner} wins the game!`;
    player1RollBtn.disabled = true;
    player2RollBtn.disabled = true;
}

// Initialize the game
initializeGame();

// If you want to restart the game after each round, call initializeGame again
