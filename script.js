document.addEventListener("DOMContentLoaded", () => {
    const gameArena = document.getElementById("game-arena")
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0;
    let gameStarted = false;
    let food = { x: 300, y: 200 };
    let snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
    let dx = cellSize;
    let dy = 0;
    let gameSpeed = 250; 

    function drawScoreBoard() {
        const scoreBoard = document.getElementById('score-board')
        scoreBoard.textContent = `Score : ${score}`;
    }

    function drawDiv(x, y, classname) {
        const div = document.createElement('div');
        div.classList.add(classname);
        div.style.top = `${y}px`;
        div.style.left = `${x}px`;
        return div;
    }
    function drawFoodAndSnake() {
        gameArena.innerHTML = ''; //if previously something drawn,remove it
        //wipe out and redraw with new coordinates

        snake.forEach((snakeCell) => {
            const element = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(element);
        })

        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);
    }

    function moveFood() {
        let newX, newY;
        do {
            newX = Math.floor(Math.random() * ((arenaSize - cellSize) / cellSize) )* cellSize;
            newY = Math.floor(Math.random() * ((arenaSize - cellSize) / cellSize) )* cellSize;
        } while (snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY))

        food = { x: newX, y: newY }
    }

    function updateSnake() {
        const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(newHead);
        if (newHead.x === food.x && newHead.y === food.y) {
            score += 5;
            moveFood();
            increaseSpeed();
        }
        else {
            snake.pop();
        }
    }
    function increaseSpeed() {
        // Decrease the game speed (interval time) for each food eaten, but set a minimum speed limit
        if (gameSpeed > 100) {
            gameSpeed -= 10; // Decrease interval time by 10 ms (increasing game speed)
        }
    }
    function isGameOver() {
        //check snake body hit
        for (i = 1; i < snake.length; i++) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true; //game over
        }
        //check for boundary wall
        const isHittingLeftWall = snake[0].x < 0;
        const isHittingTopWall = snake[0].y < 0;
        const isHittingRightWall = snake[0].x >= arenaSize;
        const isHittingDownWall = snake[0].y >= arenaSize;

        return isHittingDownWall || isHittingLeftWall || isHittingRightWall || isHittingTopWall;
    }


    function gameLoop() {
        setInterval(() => {
            if (!gameStarted) return;
            //check for game over
            if (isGameOver()) {
                gameStarted = false;
                alert(`Game over, Score = ${score}`)
                window.location.reload();
                return;
            }
            isGameOver();
            updateSnake();
            drawScoreBoard();
            drawFoodAndSnake();
        }, gameSpeed );
    }

    function changeDirection(e) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        const keyPressed = e.keyCode;

        if (keyPressed === LEFT_KEY && dx === 0) {
            dx = -cellSize;
            dy = 0;
        }
        if (keyPressed === RIGHT_KEY && dx === 0) {
            dx = cellSize;
            dy = 0;
        }
        if (keyPressed === UP_KEY && dy === 0) {
            dx = 0;
            dy = -cellSize;
        }
        if (keyPressed === DOWN_KEY && dy === 0) {
            dx = 0;
            dy = cellSize;
        }
    }

    function rungame() {
        if (!gameStarted) {
            gameStarted = true;
            gameLoop();
            document.addEventListener('keydown', changeDirection);
        }
    }


    function intitateGame() {
        const scoreBoard = document.createElement('div')
        scoreBoard.id = 'score-board';
        document.body.insertBefore(scoreBoard, gameArena);

        const startButton = document.createElement('button')
        startButton.textContent = 'Start Game'
        startButton.classList.add('start-button')
        document.body.appendChild(startButton)

        startButton.addEventListener('click', () => {
            startButton.style.display = 'none';
            rungame();
        })

    }


    intitateGame();//this is the first fucntion to be executed

})