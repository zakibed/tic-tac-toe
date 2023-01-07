const Player = (name, marker) => {
    let health = 5;
    let isBot = false;
    let isTurn = false;

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

    return { name, marker, health, isBot, isTurn, winRound };
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

    const addMarker = (e, index = e.target.dataset.index) => {
        if (!board[index]) {
            board[index] = game.currentPlayer.marker;

            display.board();
            game.checkWinner(game.currentPlayer);

            game.currentPlayer =
                game.currentPlayer === game.playerOne ? game.playerTwo : game.playerOne;

            display.players(game.currentPlayer);

            if (game.currentPlayer.isBot) {
                toggle(false);
                setTimeout(game.playBotTurn, 1500);
            }
        }
    };

    return { board, reset, toggle, addMarker };
})();

const game = (() => {
    let playerOne = Player('Player 1', 'x', false);
    let playerTwo = Player('Player 2', 'o', false);
    let currentPlayer = playerOne;

    const _tieRound = () => {
        Gameboard.reset();
        display.roundResult('', `It's a TIE!`);
    };

    const _getRandomMove = () => {
        let num = Math.floor(Math.random() * 9);
        return Gameboard.board[num] ? _getRandomMove() : num;
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

    const playBotTurn = () => {
        Gameboard.toggle(true);

        if (Gameboard.board.filter((x) => x).length < 9)
            Gameboard.addMarker(null, _getRandomMove());
    };

    const start = (e) => {
        document.querySelectorAll('.player').forEach((player) => (player.style.display = 'block'));
        display.gameBoard.style.display = 'grid';

        display.playerType();
        display.players(currentPlayer);
        display.form.reset();
        display.form.style.display = 'none';

        currentPlayer.isBot ? setTimeout(playBotTurn, 1000) : Gameboard.toggle(true);

        e.preventDefault();
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

    return { playerOne, playerTwo, currentPlayer, playBotTurn, start, checkWinner };
})();

const display = (() => {
    const _winner = document.querySelector('#results p:first-child');
    const _results = document.querySelector('#results p:last-child');
    const _playerOneHealth = document.querySelector('.player.one .health');
    const _playerTwoHealth = document.querySelector('.player.two .health');
    const _playerOneTurn = document.querySelector('.player.one .turn');
    const _playerTwoTurn = document.querySelector('.player.two .turn');
    const _playerOneType = document.querySelector('#player-one-player');
    const _playerTwoType = document.querySelector('#player-two-player');
    const startGameBtn = document.querySelector('#start-game-btn');
    const gameBoard = document.querySelector('#gameboard');
    const boardCell = document.querySelectorAll('.cell');
    const form = document.querySelector('form');

    const board = () => {
        for (let i = 0; i < 9; i++) {
            document.querySelector(`[data-index='${i}']`).textContent = Gameboard.board[i];
        }
    };

    const roundResult = (name, text, color = 'white') => {
        if (name) {
            _winner.textContent = name;
            _winner.style.color = name === 'Player 1' ? 'var(--blue)' : 'var(--red)';
        } else {
            _winner.textContent = name;
        }

        _results.textContent = text;
        _results.style.color = color;
    };

    const players = (player) => {
        const showTurn = (playerTurn, enemyTurn) => {
            playerTurn.closest('p').style.display = 'block';
            enemyTurn.closest('p').style.display = 'none';
            playerTurn.textContent = `${player.name}'s`;
        };

        document.querySelector('.player.one .name').textContent = game.playerOne.name;
        document.querySelector('.player.two .name').textContent = game.playerTwo.name;

        player === game.playerOne
            ? showTurn(_playerOneTurn, _playerTwoTurn)
            : showTurn(_playerTwoTurn, _playerOneTurn);
    };

    const removeHealthBar = (enemy) => {
        const remove = (parent) => {
            parent.lastElementChild.style.background = 'red';
            setTimeout(() => parent.removeChild(parent.lastElementChild), 100);
        };

        remove(enemy === game.playerOne ? _playerOneHealth : _playerTwoHealth);
    };

    const playerType = () => {
        if (!_playerOneType.checked) {
            document.querySelector('.player.one i').className = 'fa-solid fa-robot';
            game.playerOne.isBot = true;
        }

        if (!_playerTwoType.checked) {
            document.querySelector('.player.two i').className = 'fa-solid fa-robot';
            game.playerTwo.isBot = true;
        }

        console.log(game.playerOne);
        console.log(game.playerTwo);
    };

    return {
        startGameBtn,
        gameBoard,
        boardCell,
        board,
        form,
        roundResult,
        playerType,
        players,
        removeHealthBar
    };
})();

display.form.addEventListener('submit', game.start);
