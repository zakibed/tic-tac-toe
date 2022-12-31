const boardGrid = document.querySelector('#gameboard');
const boardCell = document.querySelectorAll('.cell');
const playerOneHealth = document.querySelector('#player-one .health');
const playerTwoHealth = document.querySelector('#player-two .health');

const Player = (name, marker) => {
    let health = 5;

    const winRound = (enemy) => {
        enemy.loseRound();
        console.log(`%c${name} WINS this round!`, 'color: lime;');
    };

    const loseRound = () => {
        health--;
        display.removeHealthBar(name);
        Gameboard.reset();
        console.log(`%c${name}'s health: ${health}`, 'color: red;');
    };

    return { name, marker, health, winRound, loseRound };
};

const Gameboard = (() => {
    let board = [];

    const _setNewRound = () => {
        board.length = 0;
        display.showBoard();

        boardCell.forEach((cell) => {
            cell.classList.toggle('hover');
            cell.addEventListener('click', Gameboard.addMarker);
        });

        console.log('A new round begins');
    };

    const addMarker = (e) => {
        console.log(e.target);
        const index = e.target.dataset.index;

        if (!board[index]) {
            board[index] = game.currentPlayer.marker;

            display.showBoard();
            game.checkWinner(game.currentPlayer);

            game.currentPlayer =
                game.currentPlayer === game.playerOne ? game.playerTwo : game.playerOne;
        }
    };

    const reset = () => {
        boardCell.forEach((cell) => {
            cell.classList.toggle('hover');
            cell.removeEventListener('click', Gameboard.addMarker);
        });

        setTimeout(_setNewRound, 2000);
    };

    return { board, addMarker, reset };
})();

const game = (() => {
    const playerOne = Player('Player 1', 'x');
    const playerTwo = Player('Player 2', 'o');
    let currentPlayer = playerOne;

    const _getThreeInARow = (i, end, increment = 1) => {
        const row = [];

        while (i <= end) {
            row.push(Gameboard.board[i]);
            i += increment;
        }

        return row;
    };

    const checkWinner = (player) => {
        const enemy = player === playerOne ? playerTwo : playerOne;

        // check columns
        for (let i = 0; i < 3; i++) {
            const jackpot = _getThreeInARow(i, i + 6, 3).every((n) => n === player.marker);
            if (jackpot) player.winRound(enemy);
        }

        // check rows
        for (let i = 0; i <= 6; i += 3) {
            const jackpot = _getThreeInARow(i, i + 2).every((n) => n === player.marker);
            if (jackpot) player.winRound(enemy);
        }

        // check diagonally
        for (let i = 0; i < 3; i += 2) {
            const jackpot =
                i === 0
                    ? _getThreeInARow(i, 8, 4).every((n) => n === player.marker)
                    : _getThreeInARow(i, 6, 2).every((n) => n === player.marker);
            if (jackpot) player.winRound(enemy);
        }
    };

    return { playerOne, playerTwo, currentPlayer, checkWinner };
})();

const display = (() => {
    const showBoard = () => {
        for (let i = 0; i < 9; i++) {
            document.querySelector(`[data-index='${i}']`).textContent = Gameboard.board[i];
        }
    };

    const removeHealthBar = (name) => {
        if (name === 'Player 1') {
            playerOneHealth.removeChild(playerOneHealth.lastElementChild);
        } else {
            playerTwoHealth.removeChild(playerTwoHealth.lastElementChild);
        }
    };

    return {
        showBoard,
        removeHealthBar
    };
})();

boardCell.forEach((cell) => cell.addEventListener('click', Gameboard.addMarker));
