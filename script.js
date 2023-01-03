const Player = (name, marker) => {
    let health = 5;

    const winRound = (enemy) => {
        enemy.health--;
        display.removeHealthBar(enemy);

        if (enemy.health > 0) {
            Gameboard.reset();
            display.roundResult(name, 'WINS this round!');
        } else {
            display.roundResult(name, 'WINS THE GAME!', 'var(--green)');
            Gameboard.toggle(false);
        }
    };

    return { name, marker, health, winRound };
};

const Gameboard = (() => {
    let board = [];

    const _newRound = () => {
        board.length = 0;
        display.board();

        display.roundResult('', 'A new round begins!');

        setTimeout(() => {
            toggle(true);
            display.roundResult('', '');
        }, 1500);
    };

    const reset = () => {
        game.currentPlayer = game.playerTwo;
        toggle(false);
        setTimeout(_newRound, 2000);
    };

    const toggle = (add) => {
        display.boardCell.forEach((cell) => {
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

            display.board();
            game.checkWinner(game.currentPlayer);

            game.currentPlayer =
                game.currentPlayer === game.playerOne ? game.playerTwo : game.playerOne;
            display.currentPlayer();
        }
    };

    return { board, reset, toggle, addMarker };
})();

const game = (() => {
    const playerOne = Player('Player 1', 'x');
    const playerTwo = Player('Player 2', 'o');
    let currentPlayer = playerOne;

    const _tieRound = () => {
        Gameboard.reset();
        display.roundResult('', `It's a TIE!`);
    };

    const _getRow = (i, end, increment = 1) => {
        const row = [];

        while (i <= end) {
            row.push(Gameboard.board[i]);
            i += increment;
        }

        return row;
    };

    const _checkRound = (player, win) => {
        const enemy = player === playerOne ? playerTwo : playerOne;

        if (win) {
            player.winRound(enemy);
            return true;
        } else if (Gameboard.board.filter((x) => x).length === 9) {
            _tieRound();
        }
    };

    const checkWinner = (player) => {
        // check columns
        for (let i = 0; i < 3; i++) {
            const win = _getRow(i, i + 6, 3).every((n) => n === player.marker);

            if (_checkRound(player, win)) return;
            _checkRound(player, win);
        }

        // check rows
        for (let i = 0; i <= 6; i += 3) {
            const win = _getRow(i, i + 2).every((n) => n === player.marker);

            if (_checkRound(player, win)) return;
            _checkRound(player, win);
        }

        // check diagonally
        for (let i = 0; i < 3; i += 2) {
            const win =
                i === 0
                    ? _getRow(i, 8, 4).every((n) => n === player.marker)
                    : _getRow(i, 6, 2).every((n) => n === player.marker);

            if (_checkRound(player, win)) return;
            _checkRound(player, win);
        }
    };

    return { playerOne, playerTwo, currentPlayer, checkWinner };
})();

const display = (() => {
    const _winner = document.querySelector('#results p:first-child');
    const _results = document.querySelector('#results p:last-child');
    const _playerOneHealth = document.querySelector('#player-one .health');
    const _playerTwoHealth = document.querySelector('#player-two .health');
    const _playerOneHr = document.querySelector('#player-one hr');
    const _playerTwoHr = document.querySelector('#player-two hr');
    const boardCell = document.querySelectorAll('.cell');

    const _showHr = (rule) => {
        document.querySelectorAll('hr').forEach((r) => {
            r.style.display = 'none';
            r.style.width = '0px';

            rule.style.display = 'block';
            rule.style.width = '230px';
        });
    };

    const board = () => {
        for (let i = 0; i < 9; i++) {
            document.querySelector(`[data-index='${i}']`).textContent = Gameboard.board[i];
        }
    };

    const roundResult = (name, text, color = 'white') => {
        if (name) {
            _winner.textContent = name === 'Player 1' ? 'BLUE' : 'RED';
            _winner.style.color = name === 'Player 1' ? 'var(--blue)' : 'var(--red)';
        } else {
            _winner.textContent = name;
        }

        _results.textContent = text;
        _results.style.color = color;
    };

    const currentPlayer = () => {
        game.currentPlayer === game.playerOne ? _showHr(_playerOneHr) : _showHr(_playerTwoHr);
    };

    const removeHealthBar = (enemy) => {
        const removeBar = (parent) => {
            parent.lastElementChild.style.background = 'red';
            setTimeout(() => parent.removeChild(parent.lastElementChild), 100);
        };

        removeBar(enemy.name === 'Player 1' ? _playerOneHealth : _playerTwoHealth);
    };

    return { boardCell, board, roundResult, currentPlayer, removeHealthBar };
})();

display.boardCell.forEach((cell) => cell.addEventListener('click', Gameboard.addMarker));
