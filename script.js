const gameBoardGrid = document.querySelector('#gameboard');
const boardCell = document.querySelectorAll('.cell');

const Player = (name, marker) => {
    let health = 3;

    const lose = () => console.log('YOU LOSE!');
    const removeHealth = () => (health > 0 ? health-- : lose());

    return { name, marker, health, removeHealth };
};

const gameBoard = (() => {
    const board = [];
    const playerOne = Player('playerOne', 'x');
    const playerTwo = Player('playerTwo', 'o');
    let currentPlayer = playerOne;

    const addMarker = (e) => {
        const index = e.target.dataset.index;

        if (!board[index]) {
            board[index] = currentPlayer.marker;

            displayController.showBoard();
            _checkWinner(currentPlayer);

            currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
        }
    };

    const _getThreeInARow = (i, end, increment = 1) => {
        const row = [];

        while (i <= end) {
            row.push(board[i]);
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
        board,
        playerOne,
        playerTwo,
        addMarker
    };
})();

const displayController = (() => {
    const showBoard = () => {
        for (let i = 0; i < 9; i++) {
            const cell = document.querySelector(`[data-index='${i}']`);

            cell.textContent = gameBoard.board[i];
        }
    };

    return {
        showBoard
    };
})();

boardCell.forEach((cell) => cell.addEventListener('click', gameBoard.addMarker));
