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
        displayController.displayCurrentPlayer(currentPlayer.name);
        const fields = document.querySelectorAll('.field');
        fields.forEach(field => {
            field.addEventListener('click', function() {handleFieldSelection(field)},)
        });
    }
    const handleFieldSelection = (field) => {
        let isFinished = currentPlayer.selectField(field);
        if (isFinished === true) {
            console.log('a');
            changeCurrentPlayer();
        }
    }
    const changeCurrentPlayer = () => {
        i = Math.abs(i - 1);
        console.log(i);
        currentPlayer = playerAry[i];
        displayController.displayCurrentPlayer(currentPlayer.name);
    }

    return { initializeGame, changeCurrentPlayer }
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
    const display = document.getElementById('display');
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
    const addDisplayDivs = () => {
        const errorDiv = document.createElement('div');
        errorDiv.setAttribute('id', 'errordiv');
        const currentPlayerDiv = document.createElement('div');
        currentPlayerDiv.setAttribute('id', 'currentplayerdiv');
        display.appendChild(errorDiv);
        display.appendChild(currentPlayerDiv);
    }
    const displayCurrentPlayer = (playerName) => {
        const currentPlayerDiv = document.getElementById('currentplayerdiv');
        currentPlayerDiv.textContent = `${playerName}'s turn.`;
    }
    const displayTakenMessage = () => {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Space already taken.';
    }
    return { displayBoard, displayCurrentPlayer, displayTakenMessage, addDisplayDivs };
})();