const gameBoardGrid = document.querySelector('#gameboard');
const boardCell = document.querySelectorAll('.cell');

const Player = (name, marker) => {
    let health = 5;

    const lose = () => console.log('YOU LOSE!');
    const removeHealth = () => (health > 0 ? health-- : lose());

    return { name, marker, health, removeHealth };
};

const Gameboard = (() => {
    const board = [];
    let playerOne = Player('Player 1', 'x');
    let playerTwo = Player('Player 2', 'o');

    return { board, playerOne, playerTwo };
})();

const game = (() => {
    let _currentPlayer = Gameboard.playerOne;

    const addMarker = (e) => {
        const index = e.target.dataset.index;

        if (!Gameboard.board[index]) {
            Gameboard.board[index] = _currentPlayer.marker;

            display.showBoard();
            _checkWinner(_currentPlayer);

            _currentPlayer =
                _currentPlayer === Gameboard.playerOne ? Gameboard.playerTwo : Gameboard.playerOne;
        }
    };

    const _getThreeInARow = (i, end, increment = 1) => {
        const row = [];

        while (i <= end) {
            row.push(Gameboard.board[i]);
            i += increment;
        }

        return row;
    };

    const _checkWinner = (player) => {
        const showWinner = () => console.log(`%c${player.name} WINS!`, 'color: lime;');

        // check columns
        for (let i = 0; i < 3; i++) {
            const jackpot = _getThreeInARow(i, i + 6, 3).every((n) => n === player.marker);
            if (jackpot) showWinner();
        }

        // check rows
        for (let i = 0; i <= 6; i += 3) {
            const jackpot = _getThreeInARow(i, i + 2).every((n) => n === player.marker);
            if (jackpot) showWinner();
        }

        // check diagonally
        for (let i = 0; i < 3; i += 2) {
            const jackpot =
                i === 0
                    ? _getThreeInARow(i, 8, 4).every((n) => n === player.marker)
                    : _getThreeInARow(i, 6, 2).every((n) => n === player.marker);
            if (jackpot) showWinner();
        }
    };

    return {
        addMarker
    };
})();

const display = (() => {
    const showBoard = () => {
        for (let i = 0; i < 9; i++) {
            const cell = document.querySelector(`[data-index='${i}']`);

            cell.textContent = Gameboard.board[i];
        }
    };

    return {
        showBoard
    };
})();

boardCell.forEach((cell) => cell.addEventListener('click', game.addMarker));
