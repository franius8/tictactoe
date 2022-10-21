const player = (name, marker) => {
    const selectField = (field) => {
        const index = field.getAttribute('index');
            if (gameBoard.getBoard()[index] === null) {
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
    let round = 1;

    const initializeGame = (player1name, player2name) => {
        playerAry = [player(player1name, 'x'), player(player2name, 'o')];
        displayController.displayBoard(gameBoard.getBoard());
        displayController.addDisplayDivs();
        playGame(); 
    }

    const playGame = () => {
        currentPlayer = playerAry[0];
        displayController.displayCurrentPlayer(currentPlayer);
        const fields = document.querySelectorAll('.field');
        fields.forEach(field => {
            field.addEventListener('click', function() {handleFieldSelection(field)})
        });
    }

    const handleFieldSelection = (field) => {
            let isFinished = currentPlayer.selectField(field);
            if (isFinished === true) {
                if (gameBoard.isWon() === true) {
                    finishGame(false);
                    return;
                } else if (round === 9) {
                    finishGame(true);
                    return;
                }
                round++;
                changeCurrentPlayer();
            }
        }

    const initializePvCGame = (playerName) => {
        playerAry = [player(playerName, 'x'), computer];
        displayController.displayBoard(gameBoard.getBoard());
        displayController.addDisplayDivs();
        playPvCGame();
    }

    const playPvCGame = () => {
        currentPlayer = playerAry[0];
        displayController.displayCurrentPlayer(currentPlayer);
        const fields = document.querySelectorAll('.field');
        fields.forEach(field => {
            field.addEventListener('click', function() {handleFieldSelection(field)})
        });
    }

    const computerSelection = () => {
        computer.selectField('easy');
        if (gameBoard.isWon() === true) {
            finishGame(false);
        }
        round++;
        changeCurrentPlayer();
    }

    const changeCurrentPlayer = () => {
        i = Math.abs(i - 1);
        currentPlayer = playerAry[i];
        displayController.displayCurrentPlayer(currentPlayer);
        if (currentPlayer === computer) {
            setTimeout(function() {computerSelection()}, 1000);
        }
    }
    const getCurrentPlayerMarker = () => {return currentPlayer.marker};

    const finishGame = (tie) => {
        if (tie) {
            displayController.displayTieMessage();
        } else {
            displayController.displayWinner(currentPlayer.name);   
        }
        const fields = document.querySelectorAll('.field');
        fields.forEach(field => {
            field.removeEventListener('click', function() {handleFieldSelection(field)})
        });
        displayController.displayResetButton();
    }
    
    const resetGame = () => {
        i = 0;
        currentPlayer = null;
        playerAry = null;
        round = 1;
        gameBoard.resetBoard(); 
        displayController.hideBoard();
        displayController.displayInitialButtons();
    }

    return { initializeGame, initializePvCGame, getCurrentPlayerMarker, resetGame }
})();

const computer = (() => {
    const name = 'computer';
    const marker = 'o';
    const selectField = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                easyFieldSelection();
            break;
        }
    }

    const easyFieldSelection = () => {
        let finished = false;
        let index = null;
        while (finished === false) {
            let index = Math.floor(Math.random() * 9.99);
            console.log(index);
            if (gameBoard.getBoard()[index] === null) {
                placeMarker(index);
                finished = true;
            }
        }
    }

    const placeMarker = (index) => {
        const field = document.querySelector(`[index="${index}"]`);
        gameBoard.addMarker(index, 'o');
        const markerDiv = document.createElement('div');
        markerDiv.classList.add('o');
        field.appendChild(markerDiv);
    }
    return {name, marker, selectField};
})();

const gameBoard = (() => {
    let board = new Array(10).fill(null); //For simplicity 0 is not used
    const winningCombinations = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    const addMarker = (index, type) => board[index] = type;
    const isWon = () => winningCombinations.some(isPresent);
    const isPresent = (line) => line.every(isPlayerMarker);
    const isPlayerMarker = (field) => board[field] === game.getCurrentPlayerMarker();
    const resetBoard = () => {board = new Array(10).fill(null)}
    const getBoard = () => {return board}
    return {getBoard, addMarker, isWon, isPresent, resetBoard}
})();

const displayController = (() => {
    const display = document.getElementById('display');
    const boardDiv = document.getElementById('board');
    const content = document.getElementById('content');   
    
    const displayInitialButtons = () => {
        clearDisplay();
        const computerButton = document.createElement('button');
        const middleDiv = document.createElement('div');
        const playerButtton = document.createElement('button');
        computerButton.textContent = 'Player vs Computer';
        middleDiv.textContent = 'or';
        playerButtton.textContent = 'Player vs Player';
        display.appendChild(computerButton);
        display.appendChild(middleDiv);
        display.appendChild(playerButtton);
        computerButton.addEventListener('click', function () {buildFormPvC()});
        playerButtton.addEventListener('click', function () {buildFormPvP()});
    }
    
    const buildFormPvC = () => {
        clearDisplay();
        const returnButton = document.createElement('button');
        returnButton.textContent = '\u2190 Return'
        const form = document.createElement('form');
        form.setAttribute('id', 'form');
        const player1Label = document.createElement('label');
        player1Label.setAttribute('for', 'player1name');
        player1Label.textContent = "First player's name:"
        const player1Input = document.createElement('input');
        player1Input.setAttribute('id', 'player1name');
        player1Input.setAttribute('type', 'text');
        player1Input.setAttribute('required', 'true');
        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = 'New game';
        form.appendChild(returnButton);
        form.appendChild(player1Label);
        form.appendChild(player1Input);
        form.appendChild(submitButton);
        display.appendChild(form);
        returnButton.addEventListener('click', function() {displayInitialButtons()});
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const player1name = document.getElementById('player1name').value;
            e.target.reset();
            form.remove();
            game.initializePvCGame(player1name);
        });
    }
    
    const buildFormPvP = () => {
        clearDisplay();
        const returnButton = document.createElement('button');
        returnButton.textContent = '\u2190 Return'
        const form = document.createElement('form');
        form.setAttribute('id', 'form');
        const player1Label = document.createElement('label');
        player1Label.setAttribute('for', 'player1name');
        player1Label.textContent = "First player's name:"
        const player1Input = document.createElement('input');
        player1Input.setAttribute('id', 'player1name');
        player1Input.setAttribute('type', 'text');
        player1Input.setAttribute('required', 'true');
        const player2Label = document.createElement('label');
        player2Label.setAttribute('for', 'player2name');
        player2Label.textContent = "Second player's name:"
        const player2Input = document.createElement('input');
        player2Input.setAttribute('id', 'player2name');
        player2Input.setAttribute('type', 'text');
        player2Input.setAttribute('required', 'true');
        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = 'New game';
        form.appendChild(returnButton);
        form.appendChild(player1Label);
        form.appendChild(player1Input);
        form.appendChild(player2Label);
        form.appendChild(player2Input);
        form.appendChild(submitButton);
        display.appendChild(form);
        returnButton.addEventListener('click', function() {displayInitialButtons()});
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const player1name = document.getElementById('player1name').value;
            const player2name = document.getElementById('player2name').value;
            e.target.reset();
            form.remove();
            game.initializeGame(player1name, player2name);
        });
    }
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
    const hideBoard = () => {
        content.style.display = 'flex';
        boardDiv.textContent = '';
        boardDiv.style.display = 'none';
    }
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
        displayResetButton();
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
    const displayTieMessage = () => {
        clearDisplay();
        const tieDiv = document.createElement('div');
        tieDiv.textContent = 'Tie';
        tieDiv.classList.add('winnerdiv');
        display.appendChild(tieDiv);
    }
    const displayResetButton = () => {
        const resetButton = document.createElement('button');
        resetButton.setAttribute('id', 'resetbutton');
        resetButton.textContent = "New game"
        display.appendChild(resetButton);
        resetButton.addEventListener('click', function() {game.resetGame()});
    }
    return { displayBoard, displayCurrentPlayer, displayTakenMessage, 
        addDisplayDivs, displayWinner, displayResetButton, 
        hideBoard, displayTieMessage, displayInitialButtons };
})();

displayController.displayInitialButtons();