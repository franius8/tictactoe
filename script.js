const form = document.getElementById('form');
const display = document.getElementById('display');

document.addEventListener('click', function(e) {
    if (e.target && e.target.className === 'field') {
      const player1 = player('test', 'o');
        player1.selectField(e.target);  
    }
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const player1name = document.getElementById('player1name').value;
    const player2name = document.getElementById('player2name').value;
    e.target.reset();
    form.remove();
    game.playGame(player1name, player2name);
});

const player = (name, marker) => {
    const selectField = (field) => {
        const index = field.getAttribute('index');
        console.log(index);
        if (gameBoard.board[index] === null) {
            gameBoard.board[index] = marker;
            const markerDiv = document.createElement('div');
            markerDiv.classList.add(marker);
            field.appendChild(markerDiv);
        } else {
            displayController.displayTakenMessage();
        };
    }
    return { name, marker, selectField };
}

const game = (() => {
    let currentPlayer;
    let i = 0;
    const playGame = (player1name, player2name) => {
        const player1 = player(player1name, 'o');
        const player2 = player(player2name, 'x');
        const playerAry = [player1, player2];
        setCurrentPlayer(playerAry);
        console.log(currentPlayer);
        displayController.displayBoard(gameBoard.board);
        displayController.displayCurrentPlayer(currentPlayer.name);  
    }
    const changeCurrentPlayer = (playerAry) => {
        i = Math.abs(i - 1);
        currentPlayer = playerAry[i];
    }
    const setCurrentPlayer = (playerAry) => {
        currentPlayer = playerAry[i];
    }
    return { playGame, changeCurrentPlayer, currentPlayer }
})();

const gameBoard = (() => {
    const board = new Array(10).fill(null);
    const winningCombinations = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    const addMarker = (index, type) => board[index] = type;
    const isWon = (marker) => board.some(isWinningCombination());
    const isWinningCombination = (line) => line.every(isPlayerMarker);
    const isPlayerMarker = (marker) => marker === 'x';

    return {board, addMarker, isWon}
})();

const displayController = (() => {
    const boardDiv = document.getElementById('board');    
    const displayBoard = (board) => {
        board.forEach((field,index) => {
            const fieldDiv = document.createElement('div');
            fieldDiv.classList.add('field');
            fieldDiv.setAttribute('index', index)
            if (index === 0) { return };
            if (field === 'x') {
                const divX = document.createElement('div');
                divX.classList.add('x');
                fieldDiv.appendChild(divX);
            } else if (field === 'o') {
                const divO = document.createElement('div');
                divO.classList.add('o');
                fieldDiv.appendChild(divO);
            }
            boardDiv.appendChild(fieldDiv);
        });
    };
    const displayCurrentPlayer = (playerName) => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = `${playerName}'s turn.`;
        display.appendChild(messageDiv);
    }
    const displayTakenMessage = () => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = 'Space already taken.';
        display.appendChild(messageDiv);
    }
    return { displayBoard, displayCurrentPlayer, displayTakenMessage };
})();