"use strict";
var player = function (name, marker) {
    var selectField = function (field) {
        var index = parseInt(field.getAttribute('index'));
        if (gameBoard.getBoard()[index] === null) {
            gameBoard.addMarker(index, marker);
            placeMarker(field);
            return true;
        }
        displayController.displayTakenMessage();
    };
    var placeMarker = function (field) {
        var markerDiv = document.createElement('div');
        markerDiv.classList.add(marker);
        field.appendChild(markerDiv);
    };
    return { name: name, marker: marker, selectField: selectField };
};
var game = (function () {
    var i = 0;
    var currentPlayer = null;
    var playerAry = null;
    var round = 1;
    var difficulty = null;
    var initializeGame = function (player1name, player2name) {
        playerAry = [player(player1name, 'x'), player(player2name, 'o')];
        displayController.displayBoard(gameBoard.getBoard());
        displayController.addDisplayDivs();
        playGame();
    };
    var playGame = function () {
        currentPlayer = playerAry[0];
        displayController.displayCurrentPlayer(currentPlayer);
        var fields = document.querySelectorAll('.field');
        fields.forEach(function (field) {
            field.addEventListener('click', function () { handleFieldSelection(field); });
        });
    };
    var handleFieldSelection = function (field) {
        var isFinished = currentPlayer.selectField(field);
        if (isFinished === true) {
            if (gameBoard.isWon() === true) {
                finishGame(false);
                return;
            }
            if (round === 9) {
                finishGame(true);
                return;
            }
            round += 1;
            changeCurrentPlayer();
        }
    };
    var initializePvCGame = function (playerName, difficultyLevel) {
        playerAry = [player(playerName, 'x'), computer];
        difficulty = difficultyLevel;
        displayController.displayBoard(gameBoard.getBoard());
        displayController.addDisplayDivs();
        playPvCGame();
    };
    var playPvCGame = function () {
        currentPlayer = playerAry[0];
        displayController.displayCurrentPlayer(currentPlayer);
        var fields = document.querySelectorAll('.field');
        fields.forEach(function (field) {
            field.addEventListener('click', function () { handleFieldSelection(field); });
        });
    };
    var computerSelection = function () {
        computer.selectField(difficulty);
        if (gameBoard.isWon() === true) {
            finishGame(false);
        }
        round += 1;
        changeCurrentPlayer();
    };
    var changeCurrentPlayer = function () {
        i = Math.abs(i - 1);
        currentPlayer = playerAry[i];
        displayController.displayCurrentPlayer(currentPlayer);
        if (currentPlayer === computer) {
            setTimeout(function () { computerSelection(); }, 1000);
        }
    };
    var getCurrentPlayerMarker = function () { return currentPlayer.marker; };
    var finishGame = function (tie) {
        if (tie) {
            displayController.displayTieMessage();
        }
        else {
            displayController.displayWinner(currentPlayer.name);
        }
        var fields = document.querySelectorAll('.field');
        fields.forEach(function (field) {
            var newField = field.cloneNode(true);
            field.parentNode.replaceChild(newField, field);
        });
        displayController.displayResetButton();
    };
    var resetGame = function () {
        i = 0;
        currentPlayer = null;
        playerAry = null;
        round = 1;
        gameBoard.resetBoard();
        displayController.hideBoard();
        displayController.displayInitialButtons();
    };
    return {
        initializeGame: initializeGame,
        initializePvCGame: initializePvCGame,
        getCurrentPlayerMarker: getCurrentPlayerMarker,
        resetGame: resetGame,
    };
})();
var computer = (function () {
    var name = 'computer';
    var marker = 'o';
    var center = 5;
    var corners = [1, 3, 7, 9];
    var sides = [2, 4, 6, 8];
    var winningMoveIndex = null;
    var blockMoveIndex = null;
    var selectField = function (difficulty) {
        switch (difficulty) {
            case 'easy':
                easyFieldSelection();
                break;
            case 'standard':
                standardFieldSelection();
                break;
            default:
                break;
        }
    };
    var easyFieldSelection = function () {
        var finished = false;
        while (finished === false) {
            var index = Math.floor(Math.random() * 9.99);
            if (index !== 0 && gameBoard.getBoard()[index] === null) {
                placeMarker(index);
                finished = true;
            }
        }
    };
    var standardFieldSelection = function () {
        if (checkWinningMoves()) {
            placeMarker(winningMoveIndex);
        }
        else if (checkBlocks()) {
            placeMarker(blockMoveIndex);
        }
        else if (gameBoard.getBoard()[center] === null) {
            placeMarker(center);
        }
        else {
            easyFieldSelection();
        }
    };
    var checkWinningMoves = function () {
        var winningIndex = null;
        gameBoard.winningCombinations.forEach(function (line) {
            var computerMarkers = 0;
            var nullMarkers = 0;
            var nullIndex = null;
            line.forEach(function (field) {
                switch (gameBoard.getBoard()[field]) {
                    case 'o':
                        computerMarkers += 1;
                        break;
                    case null:
                        nullMarkers += 1;
                        nullIndex = field;
                        break;
                    default:
                        break;
                }
            });
            if (computerMarkers === 2 && nullMarkers === 1) {
                winningIndex = nullIndex;
            }
        });
        if (winningIndex !== null) {
            winningMoveIndex = winningIndex;
            return true;
        }
        return false;
    };
    var checkBlocks = function () {
        var blockIndex = null;
        gameBoard.winningCombinations.forEach(function (line) {
            var playerMarkers = 0;
            var nullMarkers = 0;
            var nullIndex = null;
            line.forEach(function (field) {
                switch (gameBoard.getBoard()[field]) {
                    case 'x':
                        playerMarkers += 1;
                        break;
                    case null:
                        nullMarkers += 1;
                        nullIndex = field;
                        break;
                }
            });
            if (playerMarkers === 2 && nullMarkers === 1) {
                blockIndex = nullIndex;
            }
        });
        if (blockIndex !== null) {
            blockMoveIndex = blockIndex;
            return true;
        }
        return false;
    };
    var placeMarker = function (index) {
        var field = document.querySelector("[index=\"".concat(index, "\"]"));
        gameBoard.addMarker(index, 'o');
        var markerDiv = document.createElement('div');
        markerDiv.classList.add('o');
        field.appendChild(markerDiv);
    };
    return { name: name, marker: marker, selectField: selectField };
})();
var gameBoard = (function () {
    var board = new Array(10).fill(null); // For simplicity 0 is not used
    var winningCombinations = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    var addMarker = function (index, type) { return board[index] = type; };
    var isWon = function () { return winningCombinations.some(isPresent); };
    var isPresent = function (line) { return line.every(isPlayerMarker); };
    var isPlayerMarker = function (field) { return board[field] === game.getCurrentPlayerMarker(); };
    var resetBoard = function () { board = new Array(10).fill(null); };
    var getBoard = function () { return board; };
    return {
        winningCombinations: winningCombinations,
        getBoard: getBoard,
        addMarker: addMarker,
        isWon: isWon,
        isPresent: isPresent,
        resetBoard: resetBoard,
    };
})();
var displayController = (function () {
    var display = document.getElementById('display');
    var boardDiv = document.getElementById('board');
    var content = document.getElementById('content');
    var displayInitialButtons = function () {
        clearDisplay();
        var computerButton = document.createElement('button');
        var middleDiv = document.createElement('div');
        var playerButtton = document.createElement('button');
        computerButton.textContent = 'Player vs Computer';
        middleDiv.textContent = 'or';
        playerButtton.textContent = 'Player vs Player';
        display.appendChild(computerButton);
        display.appendChild(middleDiv);
        display.appendChild(playerButtton);
        computerButton.addEventListener('click', function () { buildFormPvC(); });
        playerButtton.addEventListener('click', function () { buildFormPvP(); });
    };
    var buildFormPvC = function () {
        clearDisplay();
        var returnButton = document.createElement('button');
        returnButton.textContent = '\u2190 Return';
        var form = document.createElement('form');
        form.setAttribute('id', 'form');
        var player1Label = document.createElement('label');
        player1Label.setAttribute('for', 'player1name');
        player1Label.textContent = "First player's name:";
        var player1Input = document.createElement('input');
        player1Input.setAttribute('id', 'player1name');
        player1Input.setAttribute('type', 'text');
        player1Input.setAttribute('required', 'true');
        var difficultyLabel = document.createElement('label');
        difficultyLabel.setAttribute('for', 'radiocontainer');
        difficultyLabel.textContent = 'Select difficulty:';
        var radioContainer = document.createElement('div');
        radioContainer.setAttribute('id', 'radiocontainer');
        var difficultyLevelEasyLabel = document.createElement('label');
        difficultyLevelEasyLabel.setAttribute('for', 'difficultyleveleasy');
        difficultyLevelEasyLabel.textContent = 'Easy';
        var difficultyLevelEasy = document.createElement('input');
        difficultyLevelEasy.setAttribute('id', 'difficultyleveleasy');
        difficultyLevelEasy.setAttribute('type', 'radio');
        difficultyLevelEasy.setAttribute('value', 'easy');
        difficultyLevelEasy.setAttribute('required', 'true');
        difficultyLevelEasy.setAttribute('name', 'difficulty');
        var difficultyLevelStandardLabel = document.createElement('label');
        difficultyLevelStandardLabel.setAttribute('for', 'difficultylevelstandard');
        difficultyLevelStandardLabel.textContent = 'Standard';
        var difficultyLevelStandard = document.createElement('input');
        difficultyLevelStandard.setAttribute('id', 'difficultylevelstandard');
        difficultyLevelStandard.setAttribute('type', 'radio');
        difficultyLevelStandard.setAttribute('value', 'standard');
        difficultyLevelStandard.setAttribute('required', 'true');
        difficultyLevelStandard.setAttribute('name', 'difficulty');
        var submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = 'New game';
        radioContainer.appendChild(difficultyLevelEasy);
        radioContainer.appendChild(difficultyLevelEasyLabel);
        radioContainer.appendChild(difficultyLevelStandard);
        radioContainer.appendChild(difficultyLevelStandardLabel);
        form.appendChild(returnButton);
        form.appendChild(player1Label);
        form.appendChild(player1Input);
        form.appendChild(difficultyLabel);
        form.appendChild(radioContainer);
        form.appendChild(submitButton);
        display.appendChild(form);
        returnButton.addEventListener('click', function () { displayInitialButtons(); });
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var player1name = document.getElementById('player1name').value;
            var difficultyLevel = document.querySelector('input[name="difficulty"]:checked').value;
            var target = e.target;
            target.reset();
            form.remove();
            game.initializePvCGame(player1name, difficultyLevel);
        });
    };
    var buildFormPvP = function () {
        clearDisplay();
        var returnButton = document.createElement('button');
        returnButton.textContent = '\u2190 Return';
        var form = document.createElement('form');
        form.setAttribute('id', 'form');
        var player1Label = document.createElement('label');
        player1Label.setAttribute('for', 'player1name');
        player1Label.textContent = "First player's name:";
        var player1Input = document.createElement('input');
        player1Input.setAttribute('id', 'player1name');
        player1Input.setAttribute('type', 'text');
        player1Input.setAttribute('required', 'true');
        var player2Label = document.createElement('label');
        player2Label.setAttribute('for', 'player2name');
        player2Label.textContent = "Second player's name:";
        var player2Input = document.createElement('input');
        player2Input.setAttribute('id', 'player2name');
        player2Input.setAttribute('type', 'text');
        player2Input.setAttribute('required', 'true');
        var submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = 'New game';
        form.appendChild(returnButton);
        form.appendChild(player1Label);
        form.appendChild(player1Input);
        form.appendChild(player2Label);
        form.appendChild(player2Input);
        form.appendChild(submitButton);
        display.appendChild(form);
        returnButton.addEventListener('click', function () { displayInitialButtons(); });
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var player1name = document.getElementById('player1name').value;
            var player2name = document.getElementById('player2name').value;
            var target = e.target;
            target.reset();
            form.remove();
            game.initializeGame(player1name, player2name);
        });
    };
    var displayBoard = function (board) {
        content.style.display = 'grid';
        board.forEach(function (field, index) {
            var fieldDiv = document.createElement('div');
            fieldDiv.classList.add('field');
            fieldDiv.setAttribute('index', index.toString());
            if (index === 0) {
                return;
            }
            if (field === 'x') {
                var divX = document.createElement('div');
                divX.classList.add('x');
                fieldDiv.appendChild(divX);
            }
            else if (field === 'o') {
                var divO = document.createElement('div');
                divO.classList.add('o');
                fieldDiv.appendChild(divO);
            }
            boardDiv.appendChild(fieldDiv);
        });
        boardDiv.style.display = 'grid';
    };
    var hideBoard = function () {
        content.style.display = 'flex';
        boardDiv.textContent = '';
        boardDiv.style.display = 'none';
    };
    var addDisplayDivs = function () {
        var errorDiv = document.createElement('div');
        errorDiv.setAttribute('id', 'errordiv');
        var currentPlayerDiv = document.createElement('div');
        currentPlayerDiv.setAttribute('id', 'currentplayerdiv');
        var currentPlayerLabel = document.createElement('div');
        currentPlayerLabel.setAttribute('id', 'currentplayerlabel');
        currentPlayerLabel.textContent = 'Current player:';
        var markerDiv = document.createElement('div');
        markerDiv.setAttribute('id', 'markerdiv');
        display.appendChild(errorDiv);
        display.appendChild(currentPlayerLabel);
        display.appendChild(currentPlayerDiv);
        display.appendChild(markerDiv);
        displayResetButton();
    };
    var displayCurrentPlayer = function (currentPlayer) {
        var currentPlayerDiv = document.getElementById('currentplayerdiv');
        currentPlayerDiv.textContent = currentPlayer.name;
        displayMarker(currentPlayer);
        clearErrorMessage();
    };
    var displayTakenMessage = function () {
        var errorDiv = document.getElementById('errordiv');
        errorDiv.textContent = 'Space already taken';
        errorDiv.style.visibility = 'visible';
    };
    var displayMarker = function (currentPlayer) {
        var markerDiv = document.getElementById('markerdiv');
        var markerElement = document.createElement('div');
        markerDiv.innerHTML = '';
        markerElement.classList.add(currentPlayer.marker);
        markerDiv.appendChild(markerElement);
    };
    var clearErrorMessage = function () {
        var errorDiv = document.getElementById('errordiv');
        errorDiv.textContent = '';
        errorDiv.style.visibility = 'collapse';
    };
    var clearDisplay = function () {
        display.textContent = '';
    };
    var displayWinner = function (name) {
        clearDisplay();
        var winnerDiv = document.createElement('div');
        winnerDiv.textContent = "".concat(name, " won!");
        winnerDiv.classList.add('winnerdiv');
        display.appendChild(winnerDiv);
    };
    var displayTieMessage = function () {
        clearDisplay();
        var tieDiv = document.createElement('div');
        tieDiv.textContent = 'Tie';
        tieDiv.classList.add('winnerdiv');
        display.appendChild(tieDiv);
    };
    var displayResetButton = function () {
        var resetButton = document.createElement('button');
        resetButton.setAttribute('id', 'resetbutton');
        resetButton.textContent = 'New game';
        display.appendChild(resetButton);
        resetButton.addEventListener('click', function () { game.resetGame(); });
    };
    return {
        displayBoard: displayBoard,
        displayCurrentPlayer: displayCurrentPlayer,
        displayTakenMessage: displayTakenMessage,
        addDisplayDivs: addDisplayDivs,
        displayWinner: displayWinner,
        displayResetButton: displayResetButton,
        hideBoard: hideBoard,
        displayTieMessage: displayTieMessage,
        displayInitialButtons: displayInitialButtons,
    };
})();
displayController.displayInitialButtons();
