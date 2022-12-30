const gameBoardGrid = document.querySelector('#gameboard');
const boardCell = document.querySelectorAll('#gameboard > div');

const Player = (name) => {
    let health = 3;

    const lose = () => console.log('YOU LOSE!');
    const removeHealth = () => (health > 0 ? health-- : lose());

    return { name, health, removeHealth };
};

const gameBoard = (() => {
    const arr = [];
    const playerOne = Player('playerOne');
    const playerTwo = Player('playerTwo');

    const _getThreeInARow = (i, end, increment = 1) => {
        const row = [];

        while (i <= end) {
            row.push(arr[i]);
            i += increment;
        }

        return row;
    };

    const _checkWinner = () => {
        // check columns
        for (let i = 0; i < 3; i++) {
            const jackpot = _getThreeInARow(i, i + 6, 3).every((n) => n === 'x');
            if (jackpot) console.log('YAHOO!');
        }

        // check rows
        for (let i = 0; i <= 6; i += 3) {
            const jackpot = _getThreeInARow(i, i + 2).every((n) => n === 'x');
            if (jackpot) console.log('YAHOO!');
        }

        // check diagonally
        for (let i = 0; i < 3; i += 2) {
            const jackpot =
                i === 0
                    ? _getThreeInARow(i, 8, 4).every((n) => n === 'x')
                    : _getThreeInARow(i, 6, 2).every((n) => n === 'x');
            if (jackpot) console.log('YAHOO!');
        }
    };

    const addMarker = (e) => {
        const index = e.target.dataset.index;

        if (!arr[index]) {
            arr[index] = 'x';
            displayController.showBoard();
            _checkWinner();
        }
    };

    return {
        arr,
        addMarker
    };
})();

const displayController = (() => {
    const showBoard = () => {
        for (let i = 0; i < 9; i++) {
            const cell = document.querySelector(`[data-index='${i}']`);

            cell.textContent = gameBoard.arr[i];
        }
    };

    return {
        showBoard
    };
})();

boardCell.forEach((cell) => cell.addEventListener('click', gameBoard.addMarker));
