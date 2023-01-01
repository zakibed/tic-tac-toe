const boardGrid = document.querySelector('#gameboard');
const boardCell = document.querySelectorAll('.cell');
const playerOneHealth = document.querySelector('#player-one .health');
const playerTwoHealth = document.querySelector('#player-two .health');
const roundWinner = document.querySelector('#results p:first-child');
const results = document.querySelector('#results p:last-child');

const Player = (name, marker) => {
    let health = 5;

    const winRound = (enemy) => {
        enemy.health--;
        display.removeHealthBar(enemy);

        if (enemy.health > 0) {
            Gameboard.reset();
            display.showResults(name, 'WINS this round!');
        } else {
            display.showResults(name, 'WINS THE GAME!');
            Gameboard.toggle(false);
        }
    };

    return { name, marker, health, winRound };
};

const Gameboard = (() => {
    let board = [];

    const _setNewRound = () => {
        board.length = 0;
        display.showBoard();

        display.showResults('', 'A new round begins!');

        setTimeout(() => {
            toggle(true);
            display.showResults('', '');
        }, 1500);
    };

    const reset = () => {
        game.currentPlayer = game.playerTwo;
        toggle(false);
        setTimeout(_setNewRound, 2000);
    };

    const toggle = (add) => {
        boardCell.forEach((cell) => {
            if (add) {
                cell.classList.add('hover');
                cell.addEventListener('click', Gameboard.addMarker);
            } else {
                cell.classList.remove('hover');
                cell.removeEventListener('click', Gameboard.addMarker);
            }
        });
    };

    const addMarker = (e) => {
        const index = e.target.dataset.index;

        if (!board[index]) {
            board[index] = game.currentPlayer.marker;

            display.showBoard();
            game.checkWinner(game.currentPlayer);

            game.currentPlayer =
                game.currentPlayer === game.playerOne ? game.playerTwo : game.playerOne;
        }
    };

    return { board, reset, toggle, addMarker };
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

    const showResults = (name, text) => {
        if (name) {
            roundWinner.textContent = name === 'Player 1' ? 'BLUE' : 'RED';
            roundWinner.style.color = name === 'Player 1' ? 'var(--blue)' : 'var(--red)';
        } else {
            roundWinner.textContent = name;
        }

        results.textContent = text;
    };

    const removeHealthBar = (enemy) => {
        const removeBar = (parent) => {
            parent.lastElementChild.style.background = 'red';
            setTimeout(() => parent.removeChild(parent.lastElementChild), 100);
        };

        removeBar(enemy.name === 'Player 1' ? playerOneHealth : playerTwoHealth);
    };

    return {
        showBoard,
        showResults,
        removeHealthBar
    };
})();

boardCell.forEach((cell) => cell.addEventListener('click', Gameboard.addMarker));
