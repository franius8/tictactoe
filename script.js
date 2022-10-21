const form = document.getElementById('form');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const player1name = document.getElementById('player1name').value;
    const player2name = document.getElementById('player2name').value;
    e.target.reset();
    form.remove();
    game.initializeGame(player1name, player2name);
});

const player = (name, marker) => {
    const selectField = (field) => {
        const index = field.getAttribute('index');
            if (gameBoard.board[index] === null) {
                gameBoard.addMarker(index, marker);
                placeMarker(field);
                return true;
            } else {
                displayController.displayTakenMessage();
            };    
        }
    const placeMarker = (field) => {
        const markerDiv = document.createElement('div');
        markerDiv.classList.add(marker);
        field.appendChild(markerDiv);
    }
    return { name, marker, selectField };
};

const game = (() => {
    let i = 0;
    let currentPlayer = null;
    let playerAry = null;

    const initializeGame = (player1name, player2name) => {
        playerAry = [player(player1name, 'o'), player(player2name, 'x')];
        displayController.displayBoard(gameBoard.board);
        displayController.addDisplayDivs();
        playGame(); 
    }
    const playGame = () => {
        currentPlayer = playerAry[0];
        displayController.displayCurrentPlayer(currentPlayer);
        const fields = document.querySelectorAll('.field');
        fields.forEach(field => {
            field.addEventListener('click', function() {handleFieldSelection(field)},)
        });
    }
    const handleFieldSelection = (field) => {
        let isFinished = currentPlayer.selectField(field);
        if (isFinished === true) {
            if (gameBoard.isWon() === true) {
                finishGame();
                return;
            }
            changeCurrentPlayer();
        }
    }
    const changeCurrentPlayer = () => {
        i = Math.abs(i - 1);
        currentPlayer = playerAry[i];
        displayController.displayCurrentPlayer(currentPlayer);
    }
    const getCurrentPlayerMarker = () => {return currentPlayer.marker};

    const finishGame = () => {
        displayController.displayWinner(currentPlayer.name);
        const fields = document.querySelectorAll('.field');
        fields.forEach(field => {
            field.removeEventListener('click', function() {handleFieldSelection(field)},)
        });
        displayController.displayResetButton();
    }

    return { initializeGame, getCurrentPlayerMarker }
})();

const gameBoard = (() => {
    const board = new Array(10).fill(null);
    const winningCombinations = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    const addMarker = (index, type) => board[index] = type;
    const isWon = () => winningCombinations.some(isPresent);
    const isPresent = (line) => line.every(isPlayerMarker);
    const isPlayerMarker = (field) => board[field] === game.getCurrentPlayerMarker();

    return {board, addMarker, isWon, isPresent}
})();

const displayController = (() => {
    const display = document.getElementById('display');
    const boardDiv = document.getElementById('board');
    const content = document.getElementById('content');   
    const displayBoard = (board) => {
        content.style.display = 'grid';
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
        boardDiv.style.display = 'grid';
    };
    const addDisplayDivs = () => {
        const errorDiv = document.createElement('div');
        errorDiv.setAttribute('id', 'errordiv');
        const currentPlayerDiv = document.createElement('div');
        currentPlayerDiv.setAttribute('id', 'currentplayerdiv');
        const currentPlayerLabel = document.createElement('div');
        currentPlayerLabel.setAttribute('id', 'currentplayerlabel');
        currentPlayerLabel.textContent = 'Current player:';
        const markerDiv = document.createElement('div');
        markerDiv.setAttribute('id', 'markerdiv')
        display.appendChild(errorDiv);
        display.appendChild(currentPlayerLabel);
        display.appendChild(currentPlayerDiv);
        display.appendChild(markerDiv);
    }
    const displayCurrentPlayer = (player) => {
        const currentPlayerDiv = document.getElementById('currentplayerdiv');
        currentPlayerDiv.textContent = player.name;
        displayMarker(player);
        clearErrorMessage();
    }
    const displayTakenMessage = () => {
        const errorDiv = document.getElementById('errordiv');
        errorDiv.textContent = 'Space already taken';
        errorDiv.style.visibility = 'visible';
    }
    const displayMarker = (player) => {
        const markerDiv = document.getElementById('markerdiv');
        const markerElement = document.createElement('div');
        markerDiv.innerHTML = '';
        markerElement.classList.add(player.marker);
        markerDiv.appendChild(markerElement);
    }
    const clearErrorMessage = () => {
        const errorDiv = document.getElementById('errordiv');
        errorDiv.textContent = '';
        errorDiv.style.visibility = 'collapse';
    }

    const clearDisplay = () => {
        display.textContent = ''
    }

    const displayWinner = (name) => {
        clearDisplay();
        const winnerDiv = document.createElement('div');
        winnerDiv.textContent = `${name} won!`;
        winnerDiv.classList.add('winnerdiv');
        display.appendChild(winnerDiv);
    }
    const displayResetButton = () => {
        const resetButton = document.createElement('button');
        resetButton.setAttribute('id', 'resetbutton');
        resetButton.textContent = "Play again"
        display.appendChild(resetButton);
    }
    return { displayBoard, displayCurrentPlayer, displayTakenMessage, addDisplayDivs, displayWinner, displayResetButton };
})();