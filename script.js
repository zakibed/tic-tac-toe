const Player = (name, marker, isTurn) => ({ name, marker, isTurn });

/*
handles game board array: stores/adds player markers that are rendered on screen, 
and handles ranges where winning combinations can be found
*/
const gameBoard = (() => {
    const board = [];

    const getBoard = () => board;

    // returns specified range of spaces from board
    const getRange = (start, stop, step = 1) => {
        const range = [];

        for (let i = start; i < stop; i += step) {
            range.push(board[i]);
        }

        return range;
    };

    // returns 2D array of all ranges where 3-in-a-row combinations can be found
    const getWinnableRanges = () => {
        const ranges = [];

        // get rows
        for (let i = 0; i < 7; i += 3) {
            const row = getRange(i, i + 3);
            ranges.push(row);
        }

        // get columns
        for (let i = 0; i < 3; i++) {
            const column = getRange(i, i + 7, 3);
            ranges.push(column);
        }

        // get diagonals
        ranges.push(getRange(0, 9, 4), getRange(2, 7, 2));

        return ranges;
    };

    const addMarker = (index, marker) => {
        board[index] = marker;
    };

    const reset = () => {
        board.length = 0;
    };

    return { getBoard, getWinnableRanges, addMarker, reset };
})();

/* 
handles core game logic: stores players, checks for wins, handles player/bot turns, 
current state of round, and sets up and plays games
*/
const gameController = (() => {
    const players = [
        Player("Player 1", "x", true),
        Player("Player 2", "o", false)
    ];
    let roundIsOver = false;
    let winner = "";

    const getPlayers = () => players;

    const getCurrentPlayer = () => players.find((player) => player.isTurn);

    const getWinner = () => winner;

    const getRoundState = () => roundIsOver;

    const getRandomIndex = () => {
        const board = gameBoard.getBoard();
        let index = Math.floor(Math.random() * 9);

        while (board[index]) {
            index = Math.floor(Math.random() * 9);
        }

        return index;
    };

    const setRound = () => {
        roundIsOver = false;
        winner = "";
        gameBoard.reset();
    };

    const setGame = (selectedPlayerTypes) => {
        setRound();
        players.forEach((player, index) => {
            player.health = 5;
            player.isBot = selectedPlayerTypes[index].value === "bot";
        });
    };

    const switchPlayerTurn = () => {
        players.forEach((player) => {
            player.isTurn = !player.isTurn;
        });

        // let every round start with player 1's turn
        if (roundIsOver) {
            players[0].isTurn = true;
            players[1].isTurn = false;
        }
    };

    const checkWinner = () => {
        // get 2D array where 3-in-a-row combinations can be found
        const winnableRanges = gameBoard.getWinnableRanges();

        players.forEach((player) => {
            /*
            loops through every winnable range in 2D array (rows, columns, diagonals)
            and returns true when at least one 3-in-a-row found
            */
            const hasWon = winnableRanges.some((range) =>
                range.every((cell) => cell === player.marker)
            );

            if (hasWon) winner = player;
        });
    };

    const playRound = () => {
        const board = gameBoard.getBoard();
        const boardIsFull = board.filter((cell) => cell).length === 9;

        checkWinner();

        if (winner) {
            const loser = players.find((player) => player !== winner);
            loser.health--;
            roundIsOver = true;
        } else if (boardIsFull) {
            roundIsOver = true;
        }

        switchPlayerTurn();
    };

    const playBotTurn = (currentPlayer) => {
        const index = getRandomIndex();

        gameBoard.addMarker(index, currentPlayer.marker);
        playRound();
    };

    return {
        getPlayers,
        getCurrentPlayer,
        getWinner,
        getRoundState,
        setRound,
        setGame,
        playRound,
        playBotTurn
    };
})();

/* 
controls user interface and interaction: DOM manipulation, event handling, and
rendering game board, players, health bars, game results and buttons to browser
*/
const displayController = (() => {
    const container = document.querySelector(".game-container");
    const gameBoardElement = document.querySelector("#game-board");
    const healthBarElements = document.querySelectorAll(".health-bar");
    const playerNameElements = document.querySelectorAll(".name");
    const playerTurnElements = document.querySelectorAll(".turn");
    const playerIcons = document.querySelectorAll(".player i");
    const gameResults = document.querySelector("#game-results");
    const startMenu = document.querySelector(".start-menu");
    const nextRoundBtn = document.querySelector("#next-round-btn");
    const newGameBtn = document.querySelector("#new-game-btn");

    const displayGameBoard = (board, marker) => {
        gameBoardElement.textContent = "";

        // render each cell (box/square) on game board
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("button");

            cell.setAttribute("player-marker", marker); // show current player's marker on empty cell hover
            cell.classList.add("cell");
            cell.textContent = board[i];
            gameBoardElement.appendChild(cell);
        }
    };

    const displayPlayers = (players, currentPlayer) => {
        // display names
        playerNameElements.forEach((name, index) => {
            name.textContent = players[index].name;
        });

        // display health bars
        healthBarElements.forEach((healthbar, index) => {
            healthbar.textContent = "";

            for (let i = 0; i < players[index].health; i++) {
                healthbar.appendChild(document.createElement("div"));
            }
        });

        // display current player's turn
        playerTurnElements.forEach((turn, index) => {
            turn.textContent = "";

            if (index === players.indexOf(currentPlayer)) {
                const span = document.createElement("span");

                span.classList.add(index ? "red" : "blue");
                span.textContent = `${currentPlayer.name}'s`;
                turn.appendChild(span);
                turn.appendChild(document.createTextNode(" turn!"));
            }
        });
    };

    const displayRoundEnd = (players) => {
        // disable game board and hide player turn indicators
        document.querySelectorAll(".cell").forEach((cell) => {
            cell.disabled = true;
        });
        playerTurnElements.forEach((turn) => {
            turn.classList.add("hidden");
        });

        // if players are still alive, show next round and new game options
        // if game is over, show new game option only
        if (players.every((player) => player.health)) {
            setTimeout(() => {
                gameResults.textContent = "";
                nextRoundBtn.classList.remove("hidden");
                newGameBtn.classList.remove("hidden");
            }, 2500);
        } else {
            setTimeout(() => {
                gameResults.textContent = "";
                newGameBtn.classList.remove("hidden");
            }, 4000);
        }
    };

    const displayNewRound = () => {
        nextRoundBtn.classList.add("hidden");
        newGameBtn.classList.add("hidden");
        playerTurnElements.forEach((turn) => {
            turn.classList.remove("hidden");
        });
        gameController.setRound();
        displayGameBoard(
            gameBoard.getBoard(),
            gameController.getCurrentPlayer().marker
        );
        handleBotTurn();
    };

    const displayWinner = (board, players, winner) => {
        const boardIsFull = board.filter((cell) => cell).length === 9;

        gameResults.textContent = "";

        // check if player has won or game tied, then show appropriate message and display
        if (winner) {
            const span = document.createElement("span");
            const winnerIcon = document.createElement("i");
            const loser = players.find((player) => player !== winner);
            let winMessage = " wins the round!";

            // display health loss effect
            const loserHealthBar = healthBarElements[players.indexOf(loser)];
            const lostHealth = document.createElement("div");

            lostHealth.classList.add("health-loss");
            loserHealthBar.appendChild(lostHealth);
            setTimeout(() => {
                loserHealthBar.removeChild(lostHealth);
            }, 250);

            // if loser dead, show game over message and display
            if (loser.health === 0) {
                playerIcons.forEach((icon, index) => {
                    icon.classList.replace(
                        icon.classList[1],
                        index === players.indexOf(winner)
                            ? "fa-crown"
                            : "fa-skull"
                    );
                });
                gameResults.classList.add("game-over");
                winnerIcon.classList.add("fa-solid", "fa-crown");
                winMessage = " wins the game!!";
            }

            // display winner results
            winnerIcon.className =
                playerIcons[players.indexOf(winner)].classList;
            span.classList.add(winner === players[0] ? "blue" : "red");
            span.appendChild(winnerIcon);
            span.appendChild(document.createTextNode(winner.name));
            gameResults.appendChild(span);
            gameResults.appendChild(document.createTextNode(winMessage));
        } else if (boardIsFull) {
            gameResults.textContent = "It's a tie!";
        }

        displayRoundEnd(players);
    };

    const updateDisplay = () => {
        // get most recent values from gameBoard and gameController modules
        const board = gameBoard.getBoard();
        const players = gameController.getPlayers();
        const currentPlayer = gameController.getCurrentPlayer();
        const winner = gameController.getWinner();
        const roundIsOver = gameController.getRoundState();

        // render game/round played
        displayGameBoard(board, currentPlayer.marker);
        displayPlayers(players, currentPlayer);
        if (roundIsOver) displayWinner(board, players, winner);
    };

    const handleBotTurn = () => {
        const currentPlayer = gameController.getCurrentPlayer();
        const roundIsOver = gameController.getRoundState();

        if (currentPlayer.isBot && !roundIsOver) {
            // disable game board when bot's turn
            document.querySelectorAll(".cell").forEach((cell) => {
                cell.disabled = true;
            });

            // display bot's move after timeout
            setTimeout(() => {
                gameController.playBotTurn(currentPlayer);
                updateDisplay();
                handleBotTurn();
            }, 800);
        }
    };

    const startGame = (e) => {
        // get radio input elements of each selected player type (user or bot)
        const selectedPlayerTypes = [
            document.querySelector("input[name='player-one-type']:checked"),
            document.querySelector("input[name='player-two-type']:checked")
        ];

        playerIcons.forEach((icon, index) => {
            icon.className =
                selectedPlayerTypes[
                    index
                ].nextElementSibling.children[0].classList;
        });
        startMenu.classList.add("hidden");
        container.classList.remove("hidden");
        e.preventDefault();
        gameController.setGame(selectedPlayerTypes);
        updateDisplay();
        handleBotTurn();
    };

    const addMarkerToBoard = (e) => {
        // check if cell is occupied
        if (e.target.textContent) return;

        const index = [...gameBoardElement.children].indexOf(e.target);
        const currentPlayer = gameController.getCurrentPlayer();

        gameBoard.addMarker(index, currentPlayer.marker);
        gameController.playRound();
        updateDisplay();
        handleBotTurn();
    };

    const returnToMenu = () => {
        container.classList.add("hidden");
        nextRoundBtn.classList.add("hidden");
        newGameBtn.classList.add("hidden");
        startMenu.classList.remove("hidden");
        playerTurnElements.forEach((turn) => {
            turn.classList.remove("hidden");
        });
        gameResults.classList.remove("game-over");
    };

    startMenu.addEventListener("submit", startGame);
    gameBoardElement.addEventListener("click", addMarkerToBoard);
    nextRoundBtn.addEventListener("click", displayNewRound);
    newGameBtn.addEventListener("click", returnToMenu);
})();
