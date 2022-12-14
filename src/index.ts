const player = (name: string, marker: string) => {
  const selectField = (field: HTMLElement) => {
    const index = parseInt(field.getAttribute('index'));
    if (gameBoard.getBoard()[index] === null) {
      gameBoard.addMarker(index, marker);
      placeMarker(field);
      return true;
    }
    displayController.displayTakenMessage();
    return false;
  };
  const placeMarker = (field: HTMLElement) => {
    const markerDiv = document.createElement('div');
    markerDiv.classList.add(marker);
    field.appendChild(markerDiv);
  };
  return { name, marker, selectField };
};

const game = (() => {
  let i = 0;
  let currentPlayer: {
    selectField(field: HTMLElement): unknown; marker: string; name: string; } = null;
  let playerAry: any[] = null;
  let round = 1;
  let difficulty: string = null;

  const initializeGame = (player1name: string, player2name: string) => {
    playerAry = [player(player1name, 'x'), player(player2name, 'o')];
    displayController.displayBoard(gameBoard.getBoard());
    displayController.addDisplayDivs();
    playGame();
  };

  const playGame = () => {
    currentPlayer = playerAry[0];
    displayController.displayCurrentPlayer(currentPlayer);
    const fields = document.querySelectorAll('.field');
    fields.forEach((field: HTMLElement) => {
      field.addEventListener('click', () => { handleFieldSelection(field); });
    });
  };

  const handleFieldSelection = (field: HTMLElement) => {
    if (currentPlayer.name === 'computer') {
      return;
    };
    const isFinished = currentPlayer.selectField(field);
    if (isFinished === true) {
      if (gameBoard.isWon() === true) {
        finishGame(false);
        return;
      } if (round === 9) {
        finishGame(true);
        return;
      }
      round += 1;
      changeCurrentPlayer();
    }
  };

  const initializePvCGame = (playerName: string, difficultyLevel: string) => {
    playerAry = [player(playerName, 'x'), computer];
    difficulty = difficultyLevel;
    displayController.displayBoard(gameBoard.getBoard());
    displayController.addDisplayDivs();
    playPvCGame();
  };

  const playPvCGame = () => {
    currentPlayer = playerAry[0];
    displayController.displayCurrentPlayer(currentPlayer);
    const fields = document.querySelectorAll('.field');
    fields.forEach((field: HTMLElement) => {
      field.addEventListener('click', () => { handleFieldSelection(field); });
    });
  };

  const computerSelection = () => {
    computer.selectField(difficulty);
    if (gameBoard.isWon() === true) {
      finishGame(false);
    }
    round += 1;
    changeCurrentPlayer();
  };

  const changeCurrentPlayer = () => {
    i = Math.abs(i - 1);
    currentPlayer = playerAry[i];
    displayController.displayCurrentPlayer(currentPlayer);
    if (currentPlayer.name === "computer") {
      setTimeout(() => { computerSelection(); }, 1000);
    }
  };
  const getCurrentPlayerMarker = () => currentPlayer.marker;

  const finishGame = (tie: boolean) => {
    if (tie) {
      displayController.displayTieMessage();
    } else {
      displayController.displayWinner(currentPlayer.name);
    }
    const fields = document.querySelectorAll('.field');
    fields.forEach((field) => {
      const newField = field.cloneNode(true);
      field.parentNode.replaceChild(newField, field);
    });
    displayController.displayResetButton();
  };

  const resetGame = () => {
    i = 0;
    currentPlayer = null;
    playerAry = null;
    round = 1;
    gameBoard.resetBoard();
    displayController.hideBoard();
    displayController.displayInitialButtons();
  };

  return {
    initializeGame, initializePvCGame, getCurrentPlayerMarker, resetGame,
  };
})();

const computer = (() => {
  const name = 'computer';
  const marker = 'o';
  const center = 5;
  const corners = [1, 3, 7, 9];
  const sides = [2, 4, 6, 8];
  let winningMoveIndex: number = null;
  let blockMoveIndex: number = null;

  const selectField = (difficulty: string) => {
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

  const easyFieldSelection = () => {
    let finished = false;
    while (finished === false) {
      const index = Math.floor(Math.random() * 9.99);
      if (index !== 0 && gameBoard.getBoard()[index] === null) {
        placeMarker(index);
        finished = true;
      }
    }
  };

  const standardFieldSelection = () => {
    if (checkWinningMoves()) {
      placeMarker(winningMoveIndex);
    } else if (checkBlocks()) {
      placeMarker(blockMoveIndex);
    } else if (gameBoard.getBoard()[center] === null) {
      placeMarker(center);
    } else {
      easyFieldSelection();
    }
  };

  const checkWinningMoves = () => {
    let winningIndex = null;
    gameBoard.winningCombinations.forEach((line) => {
      let computerMarkers = 0;
      let nullMarkers = 0;
      let nullIndex = null;
      line.forEach((field) => {
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

  const checkBlocks = () => {
    let blockIndex = null;
    gameBoard.winningCombinations.forEach((line) => {
      let playerMarkers = 0;
      let nullMarkers = 0;
      let nullIndex = null;
      line.forEach((field) => {
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

  const placeMarker = (index: number) => {
    const field = document.querySelector(`[index="${index}"]`);
    gameBoard.addMarker(index, 'o');
    const markerDiv = document.createElement('div');
    markerDiv.classList.add('o');
    field.appendChild(markerDiv);
  };
  return { name, marker, selectField };
})();

const gameBoard = (() => {
  let board = new Array(10).fill(null); // For simplicity 0 is not used
  const winningCombinations = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
  const addMarker = (index: number, type: string) => board[index] = type;
  const isWon = () => winningCombinations.some(isPresent);
  const isPresent = (line: number[]) => line.every(isPlayerMarker);
  const isPlayerMarker = (field: number) => board[field] === game.getCurrentPlayerMarker();
  const resetBoard = () => { board = new Array(10).fill(null); };
  const getBoard = () => board;
  return {
    winningCombinations, getBoard, addMarker, isWon, isPresent, resetBoard,
  };
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
    computerButton.addEventListener('click', () => { buildFormPvC(); });
    playerButtton.addEventListener('click', () => { buildFormPvP(); });
  };

  const buildFormPvC = () => {
    clearDisplay();
    const returnButton = document.createElement('button');
    returnButton.textContent = '\u2190 Return';
    const form = document.createElement('form');
    form.setAttribute('id', 'form');
    const player1Label = document.createElement('label');
    player1Label.setAttribute('for', 'player1name');
    player1Label.textContent = "First player's name:";
    const player1Input = document.createElement('input');
    player1Input.setAttribute('id', 'player1name');
    player1Input.setAttribute('type', 'text');
    player1Input.setAttribute('required', 'true');
    const difficultyLabel = document.createElement('label');
    difficultyLabel.setAttribute('for', 'radiocontainer');
    difficultyLabel.textContent = 'Select difficulty:';
    const radioContainer = document.createElement('div');
    radioContainer.setAttribute('id', 'radiocontainer');
    const difficultyLevelEasyLabel = document.createElement('label');
    difficultyLevelEasyLabel.setAttribute('for', 'difficultyleveleasy');
    difficultyLevelEasyLabel.textContent = 'Easy';
    const difficultyLevelEasy = document.createElement('input');
    difficultyLevelEasy.setAttribute('id', 'difficultyleveleasy');
    difficultyLevelEasy.setAttribute('type', 'radio');
    difficultyLevelEasy.setAttribute('value', 'easy');
    difficultyLevelEasy.setAttribute('required', 'true');
    difficultyLevelEasy.setAttribute('name', 'difficulty');
    const difficultyLevelStandardLabel = document.createElement('label');
    difficultyLevelStandardLabel.setAttribute('for', 'difficultylevelstandard');
    difficultyLevelStandardLabel.textContent = 'Standard';
    const difficultyLevelStandard = document.createElement('input');
    difficultyLevelStandard.setAttribute('id', 'difficultylevelstandard');
    difficultyLevelStandard.setAttribute('type', 'radio');
    difficultyLevelStandard.setAttribute('value', 'standard');
    difficultyLevelStandard.setAttribute('required', 'true');
    difficultyLevelStandard.setAttribute('name', 'difficulty');
    const submitButton = document.createElement('button');
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
    returnButton.addEventListener('click', () => { displayInitialButtons(); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const player1name = (document.getElementById('player1name') as HTMLInputElement).value;
      const difficultyLevel = (document.querySelector('input[name="difficulty"]:checked') as HTMLInputElement).value;
      const target = e.target as HTMLFormElement;
      target.reset();
      form.remove();
      game.initializePvCGame(player1name, difficultyLevel);
    });
  };

  const buildFormPvP = () => {
    clearDisplay();
    const returnButton = document.createElement('button');
    returnButton.textContent = '\u2190 Return';
    const form = document.createElement('form');
    form.setAttribute('id', 'form');
    const player1Label = document.createElement('label');
    player1Label.setAttribute('for', 'player1name');
    player1Label.textContent = "First player's name:";
    const player1Input = document.createElement('input');
    player1Input.setAttribute('id', 'player1name');
    player1Input.setAttribute('type', 'text');
    player1Input.setAttribute('required', 'true');
    const player2Label = document.createElement('label');
    player2Label.setAttribute('for', 'player2name');
    player2Label.textContent = "Second player's name:";
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
    returnButton.addEventListener('click', () => { displayInitialButtons(); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const player1name = (document.getElementById('player1name') as HTMLInputElement).value;
      const player2name = (document.getElementById('player2name') as HTMLInputElement).value;
      const target = e.target as HTMLFormElement;
      target.reset();
      form.remove();
      game.initializeGame(player1name, player2name);
    });
  };
  const displayBoard = (board: any[]) => {
    content.style.display = 'grid';
    board.forEach((field, index) => {
      const fieldDiv = document.createElement('div');
      fieldDiv.classList.add('field');
      fieldDiv.setAttribute('index', index.toString());
      if (index === 0) { return; }
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
  };
  const addDisplayDivs = () => {
    const errorDiv = document.createElement('div');
    errorDiv.setAttribute('id', 'errordiv');
    const currentPlayerLabel = document.createElement('div');
    currentPlayerLabel.setAttribute('id', 'currentplayerlabel');
    currentPlayerLabel.textContent = 'Current player:';
    const currentPlayerContainer = document.createElement('div');
    currentPlayerContainer.setAttribute('id', 'currentplayercontainer');
    const currentPlayerDiv = document.createElement('div');
    currentPlayerDiv.setAttribute('id', 'currentplayerdiv');
    const markerDiv = document.createElement('div');
    markerDiv.setAttribute('id', 'markerdiv');
    currentPlayerContainer.appendChild(currentPlayerDiv);
    currentPlayerContainer.appendChild(markerDiv)
    display.appendChild(errorDiv);
    display.appendChild(currentPlayerLabel);
    display.appendChild(currentPlayerContainer);
    displayResetButton();
  };
  const displayCurrentPlayer = (currentPlayer: { name: string; marker: string; }) => {
    const currentPlayerDiv = document.getElementById('currentplayerdiv');
    currentPlayerDiv.textContent = currentPlayer.name;
    displayMarker(currentPlayer);
    clearErrorMessage();
  };
  const displayTakenMessage = () => {
    const errorDiv = document.getElementById('errordiv');
    errorDiv.textContent = 'Space already taken';
    errorDiv.style.visibility = 'visible';
  };
  const displayMarker = (currentPlayer: { name: string; marker: string; }) => {
    const markerDiv = document.getElementById('markerdiv');
    const markerElement = document.createElement('div');
    markerDiv.innerHTML = '';
    markerElement.classList.add(currentPlayer.marker);
    markerDiv.appendChild(markerElement);
  };
  const clearErrorMessage = () => {
    const errorDiv = document.getElementById('errordiv');
    errorDiv.textContent = '';
    errorDiv.style.visibility = 'collapse';
  };

  const clearDisplay = () => {
    display.textContent = '';
  };

  const displayWinner = (name: string) => {
    clearDisplay();
    const winnerDiv = document.createElement('div');
    winnerDiv.textContent = `${name} won!`;
    winnerDiv.classList.add('winnerdiv');
    display.appendChild(winnerDiv);
  };
  const displayTieMessage = () => {
    clearDisplay();
    const tieDiv = document.createElement('div');
    tieDiv.textContent = 'Tie';
    tieDiv.classList.add('winnerdiv');
    display.appendChild(tieDiv);
  };
  const displayResetButton = () => {
    const resetButton = document.createElement('button');
    resetButton.setAttribute('id', 'resetbutton');
    resetButton.textContent = 'New game';
    display.appendChild(resetButton);
    resetButton.addEventListener('click', () => { game.resetGame(); });
  };
  return {
    displayBoard,
    displayCurrentPlayer,
    displayTakenMessage,
    addDisplayDivs,
    displayWinner,
    displayResetButton,
    hideBoard,
    displayTieMessage,
    displayInitialButtons,
  };
})();

displayController.displayInitialButtons();
