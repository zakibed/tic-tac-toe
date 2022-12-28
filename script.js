const gameBoardEl = document.querySelector('#gameboard');
const boardCellEl = document.querySelectorAll('#gameboard > div');

const Player = (name) => {
    let health = 3;

    const lose = () => console.log('YOU LOSE!');
    const removeHealth = () => (health > 0 ? health-- : lose());

    return { name, health, removeHealth };
};

const gameBoard = (() => {
    const arr = [];

    let row1 = 0,
        row2 = 0,
        row3 = 0;

    let col1 = 0,
        col2 = 0,
        col3 = 0;

    let diagLR = 0,
        diagRL = 0;

    const _checkWinner = (index) => {
        if (index < 3) {
            row1++;
            index == 0 ? col1++ : index == 1 ? col2++ : col3++;
        } else if (index < 6) {
            row2++;
            index == 3 ? col1++ : index == 4 ? col2++ : col3++;
        } else {
            row3++;
            index == 6 ? col1++ : index == 7 ? col2++ : col3++;
        }

        if (index == 0 || index == 8) {
            diagLR++;
        } else if (index == 2 || index == 6) {
            diagRL++;
        } else if (index == 4) {
            diagLR++;
            diagRL++;
        }

        if (
            row1 == 3 ||
            row2 == 3 ||
            row3 == 3 ||
            col1 == 3 ||
            col2 == 3 ||
            col3 == 3 ||
            diagLR == 3 ||
            diagRL == 3
        ) {
            console.log('winner!');
        }
    };

    const addMarker = (e) => {
        const index = e.target.dataset.index;

        if (!arr[index]) {
            arr[index] = 'x';
            displayController.showBoard();
            _checkWinner(index);
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
            document.querySelector(`[data-index='${i}']`).textContent = gameBoard.arr[i];
        }
    };

    return {
        showBoard
    };
})();

const playerOne = Player('playerOne');
const playerTwo = Player('playerTwo');

boardCellEl.forEach((cell) => cell.addEventListener('click', gameBoard.addMarker));
