const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ======================================
// HTML ELEMENTS
// ======================================

const scoreDisplay =
    document.getElementById("score");

const highScoreDisplay =
    document.getElementById("highScore");

const gameMessage =
    document.getElementById("gameMessage");

const restartBtn =
    document.getElementById("restartBtn");


// ======================================
// GAME SETTINGS
// ======================================

const gridSize = 20;

let gameSpeed = 150;

let gameTimer;


// ======================================
// SNAKE
// ======================================

let snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
];

let dx = gridSize;
let dy = 0;


// ======================================
// SCORE
// ======================================

let score = 0;

let highScore = 0;


// ======================================
// GAME STATE
// ======================================

let gameOver = false;

let gameStarted = false;


// ======================================
// FOOD
// ======================================

let food = {
    x: 300,
    y: 200,
    type: "fruit"
};


// ======================================
// ANIMATIONS
// ======================================

// Stomach animation
let stomachAnimation = 0;

const stomachDuration = 18;


// Mouth animation
let mouthOpen = 0;


// ======================================
// WALL IMPACT ANIMATION
// ======================================

let wallImpact = 0;

const wallImpactDuration = 70;

let wallDirectionX = 0;

let wallDirectionY = 0;

let wallHeadX = 0;

let wallHeadY = 0;


// ======================================
// FALLING LEAVES
// ======================================

let leaves = [];

let lastLeafTime = 0;

const leafInterval = 1400;

const maxLeaves = 12;


// ======================================
// GARDEN
// ======================================

let grassBlades = [];


// ======================================
// CREATE GRASS
// ======================================

function createGrass() {

    grassBlades = [];

    for (let i = 0; i < 100; i++) {

        grassBlades.push({

            x:
                Math.random() *
                canvas.width,

            y:
                Math.random() *
                canvas.height,

            height:
                3 +
                Math.random() * 5
        });
    }
}


// ======================================
// CREATE LEAF
// ======================================

function createLeaf() {

    const leafTypes = [
        "#84cc16",
        "#65a30d",
        "#eab308",
        "#f59e0b",
        "#22c55e"
    ];

    leaves.push({

        x:
            Math.random() *
            canvas.width,

        y: -15,

        size:
            5 +
            Math.random() * 4,

        speed:
            0.5 +
            Math.random() * 1.2,

        sway:
            Math.random() *
            Math.PI * 2,

        swaySpeed:
            0.01 +
            Math.random() * 0.02,

        rotation:
            Math.random() *
            Math.PI * 2,

        rotationSpeed:
            -0.03 +
            Math.random() * 0.06,

        color:
            leafTypes[
                Math.floor(
                    Math.random() *
                    leafTypes.length
                )
            ]
    });
}


// ======================================
// UPDATE LEAVES
// ======================================

function updateLeaves(timestamp) {

    if (
        timestamp -
        lastLeafTime >
        leafInterval
    ) {

        if (
            leaves.length <
            maxLeaves
        ) {

            createLeaf();
        }

        lastLeafTime =
            timestamp;
    }


    leaves.forEach(leaf => {

        leaf.y +=
            leaf.speed;

        leaf.sway +=
            leaf.swaySpeed;

        leaf.rotation +=
            leaf.rotationSpeed;

        leaf.x +=
            Math.sin(leaf.sway) *
            0.4;
    });


    leaves =
        leaves.filter(
            leaf =>
                leaf.y <
                canvas.height + 20
        );
}


// ======================================
// DRAW LEAVES
// ======================================

function drawLeaves() {

    leaves.forEach(leaf => {

        ctx.save();

        ctx.translate(
            leaf.x,
            leaf.y
        );

        ctx.rotate(
            leaf.rotation
        );


        ctx.fillStyle =
            leaf.color;


        ctx.beginPath();

        ctx.moveTo(
            0,
            -leaf.size
        );

        ctx.quadraticCurveTo(
            leaf.size,
            -leaf.size / 2,
            0,
            leaf.size
        );

        ctx.quadraticCurveTo(
            -leaf.size,
            -leaf.size / 2,
            0,
            -leaf.size
        );

        ctx.closePath();

        ctx.fill();


        ctx.strokeStyle =
            "rgba(20, 83, 45, 0.5)";

        ctx.lineWidth = 1;


        ctx.beginPath();

        ctx.moveTo(
            0,
            -leaf.size + 1
        );

        ctx.lineTo(
            0,
            leaf.size - 1
        );

        ctx.stroke();


        ctx.restore();
    });
}


// ======================================
// DRAW CHECKERBOARD GARDEN
// ======================================

function drawGardenBackground() {

    const tileSize = 40;

    const lightGreen =
        "#a8d94e";

    const darkGreen =
        "#9fd147";


    for (
        let row = 0;
        row <
        canvas.height / tileSize;
        row++
    ) {

        for (
            let col = 0;
            col <
            canvas.width / tileSize;
            col++
        ) {

            if (
                (row + col) % 2 === 0
            ) {

                ctx.fillStyle =
                    lightGreen;

            } else {

                ctx.fillStyle =
                    darkGreen;
            }


            ctx.fillRect(

                col * tileSize,

                row * tileSize,

                tileSize,

                tileSize
            );
        }
    }


    // Small grass details

    ctx.strokeStyle =
        "rgba(70, 120, 35, 0.25)";

    ctx.lineWidth = 1;


    grassBlades.forEach(grass => {

        ctx.beginPath();

        ctx.moveTo(
            grass.x,
            grass.y
        );

        ctx.lineTo(
            grass.x - 1,
            grass.y - grass.height
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(
            grass.x + 2,
            grass.y
        );

        ctx.lineTo(
            grass.x + 3,
            grass.y -
            grass.height +
            1
        );

        ctx.stroke();
    });
}


// ======================================
// RESET GAME
// ======================================

function resetGame() {

    clearInterval(gameTimer);


    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];


    dx = gridSize;

    dy = 0;


    score = 0;


    scoreDisplay.textContent =
        score;


    gameSpeed = 150;


    gameOver = false;

    gameStarted = false;


    stomachAnimation = 0;

    mouthOpen = 0;


    wallImpact = 0;

    wallDirectionX = 0;

    wallDirectionY = 0;


    leaves = [];


    lastLeafTime =
        performance.now();


    generateFood();


    gameMessage.textContent =
        "Press any key to start the game";
}


// ======================================
// START GAME
// ======================================

function startGame() {

    if (
        gameStarted ||
        gameOver
    ) {

        return;
    }


    gameStarted = true;


    gameMessage.textContent =
        "Use Arrow Keys or WASD to move";


    gameTimer =
        setInterval(
            moveSnake,
            gameSpeed
        );
}


// ======================================
// CHECK FOOD DISTANCE
// ======================================

function checkFoodNearSnake() {

    if (
        !gameStarted ||
        gameOver
    ) {

        mouthOpen = 0;

        return;
    }


    const headX =
        snake[0].x +
        gridSize / 2;


    const headY =
        snake[0].y +
        gridSize / 2;


    const foodX =
        food.x +
        gridSize / 2;


    const foodY =
        food.y +
        gridSize / 2;


    const distance =
        Math.sqrt(

            Math.pow(
                headX - foodX,
                2
            ) +

            Math.pow(
                headY - foodY,
                2
            )
        );


    if (
        distance <= 70
    ) {

        mouthOpen += 0.08;


        if (
            mouthOpen > 1
        ) {

            mouthOpen = 1;
        }

    } else {

        mouthOpen -= 0.08;


        if (
            mouthOpen < 0
        ) {

            mouthOpen = 0;
        }
    }
}


// ======================================
// UPDATE ANIMATIONS
// ======================================

function updateAnimations() {

    // Stomach
    if (
        stomachAnimation > 0
    ) {

        stomachAnimation--;
    }


    // Wall impact
    if (
        wallImpact > 0
    ) {

        wallImpact--;
    }
}


// ======================================
// DRAW SNAKE
// ======================================

function drawSnake() {

    if (
        snake.length === 0
    ) {

        return;
    }


    // ==================================
    // NORMAL BODY
    // ==================================

    if (
        snake.length > 1
    ) {

        ctx.save();


        ctx.strokeStyle =
            "#06b6d4";


        ctx.lineWidth = 17;


        ctx.lineCap =
            "round";


        ctx.lineJoin =
            "round";


        ctx.beginPath();


        ctx.moveTo(

            snake[0].x +
            gridSize / 2,

            snake[0].y +
            gridSize / 2
        );


        for (
            let i = 1;
            i < snake.length;
            i++
        ) {

            ctx.lineTo(

                snake[i].x +
                gridSize / 2,

                snake[i].y +
                gridSize / 2
            );
        }


        ctx.stroke();


        ctx.restore();
    }


    // ==================================
    // STOMACH EXPANSION
    // ==================================

    if (
        stomachAnimation > 0 &&
        snake.length > 2
    ) {

        const middleIndex =
            Math.floor(
                snake.length / 2
            );


        const stomach =
            snake[middleIndex];


        const x =
            stomach.x +
            gridSize / 2;


        const y =
            stomach.y +
            gridSize / 2;


        const progress =
            stomachAnimation /
            stomachDuration;


        const bulge =
            Math.sin(
                progress *
                Math.PI
            ) * 10;


        ctx.save();


        ctx.fillStyle =
            "#06b6d4";


        ctx.beginPath();


        ctx.ellipse(

            x,

            y,

            10 + bulge,

            9 + bulge,

            0,

            0,

            Math.PI * 2
        );


        ctx.fill();


        ctx.restore();
    }


    // ==================================
    // BODY HIGHLIGHT
    // ==================================

    if (
        snake.length > 2
    ) {

        ctx.save();


        ctx.strokeStyle =
            "rgba(165, 243, 252, 0.25)";


        ctx.lineWidth = 4;


        ctx.lineCap =
            "round";


        ctx.beginPath();


        ctx.moveTo(

            snake[1].x +
            gridSize / 2,

            snake[1].y +
            gridSize / 2 -
            3
        );


        for (
            let i = 2;
            i < snake.length;
            i++
        ) {

            ctx.lineTo(

                snake[i].x +
                gridSize / 2,

                snake[i].y +
                gridSize / 2 -
                3
            );
        }


        ctx.stroke();


        ctx.restore();
    }


    // ==================================
    // TAIL
    // ==================================

    if (
        snake.length >= 2
    ) {

        drawTail(

            snake[
                snake.length - 1
            ],

            snake[
                snake.length - 2
            ]
        );
    }


    // ==================================
    // NORMAL HEAD
    // ==================================

    if (
        wallImpact <= 0
    ) {

        drawSnakeHead(
            snake[0]
        );

    } else {

        // Draw special wall impact head
        drawWallImpactHead();
    }
}


// ======================================
// DRAW TAIL
// ======================================

function drawTail(
    tail,
    previousSegment
) {

    const tailX =
        tail.x +
        gridSize / 2;


    const tailY =
        tail.y +
        gridSize / 2;


    const previousX =
        previousSegment.x +
        gridSize / 2;


    const previousY =
        previousSegment.y +
        gridSize / 2;


    const directionX =
        tailX - previousX;


    const directionY =
        tailY - previousY;


    const distance =
        Math.sqrt(

            directionX *
            directionX +

            directionY *
            directionY
        );


    const nx =
        directionX /
        distance;


    const ny =
        directionY /
        distance;


    const px =
        -ny;


    const py =
        nx;


    const length = 16;

    const width = 10;


    const tipX =
        tailX +
        nx * length;


    const tipY =
        tailY +
        ny * length;


    ctx.fillStyle =
        "#facc15";


    ctx.beginPath();


    ctx.moveTo(

        tailX +
        px * width / 2,

        tailY +
        py * width / 2
    );


    ctx.quadraticCurveTo(

        tailX +
        nx * 7 +
        px * width / 2,

        tailY +
        ny * 7 +
        py * width / 2,

        tipX,

        tipY
    );


    ctx.quadraticCurveTo(

        tailX +
        nx * 7 -
        px * width / 2,

        tailY +
        ny * 7 -
        py * width / 2,

        tailX -
        px * width / 2,

        tailY -
        py * width / 2
    );


    ctx.closePath();


    ctx.fill();
}


// ======================================
// NORMAL SNAKE HEAD
// ======================================

function drawSnakeHead(head) {

    const x =
        head.x +
        gridSize / 2;


    const y =
        head.y +
        gridSize / 2;


    drawHeadFace(
        x,
        y,
        13,
        13,
        0
    );
}


// ======================================
// WALL IMPACT HEAD
// ======================================

function drawWallImpactHead() {

    /*
       Animation:

       1. Head moves toward wall
       2. Head touches wall
       3. Head slowly squashes
       4. Head stays pressed briefly
    */


    const progress =
        1 -
        wallImpact /
        wallImpactDuration;


    // Smooth animation
    const eased =
        progress *
        progress *
        (3 -
        2 * progress);


    const originalX =
        snake[0].x +
        gridSize / 2;


    const originalY =
        snake[0].y +
        gridSize / 2;


    // ==================================
    // DETERMINE WALL
    // ==================================

    let targetX =
        originalX;

    let targetY =
        originalY;


    if (
        wallDirectionX > 0
    ) {

        // Right wall
        targetX =
            canvas.width - 8;

    } else if (
        wallDirectionX < 0
    ) {

        // Left wall
        targetX = 8;

    } else if (
        wallDirectionY > 0
    ) {

        // Bottom wall
        targetY =
            canvas.height - 8;

    } else if (
        wallDirectionY < 0
    ) {

        // Top wall
        targetY = 8;
    }


    // Move toward wall
    const x =
        originalX +
        (targetX - originalX) *
        eased;


    const y =
        originalY +
        (targetY - originalY) *
        eased;


    // ==================================
    // SQUASH AMOUNT
    // ==================================

    let squash =
        Math.sin(
            eased * Math.PI
        );


    // Make final squeeze stronger
    squash =
        Math.pow(
            squash,
            0.7
        );


    let radiusX = 13;

    let radiusY = 13;


    if (
        wallDirectionX !== 0
    ) {

        // Horizontal wall:
        // wider + flatter

        radiusX =
            13 +
            squash * 10;


        radiusY =
            13 -
            squash * 8;

    } else {

        // Vertical wall:
        // taller + narrower

        radiusX =
            13 -
            squash * 8;


        radiusY =
            13 +
            squash * 10;
    }


    // ==================================
    // DRAW HEAD
    // ==================================

    drawHeadFace(

        x,

        y,

        radiusX,

        radiusY,

        squash
    );
}


// ======================================
// DRAW HEAD FACE
// ======================================

function drawHeadFace(
    x,
    y,
    radiusX,
    radiusY,
    squash
) {

    ctx.save();


    // ==================================
    // HEAD
    // ==================================

    ctx.fillStyle =
        "#06b6d4";


    ctx.beginPath();


    ctx.ellipse(

        x,

        y,

        radiusX,

        radiusY,

        0,

        0,

        Math.PI * 2
    );


    ctx.fill();


    ctx.strokeStyle =
        "rgba(165, 243, 252, 0.7)";


    ctx.lineWidth = 2;


    ctx.stroke();


    // ==================================
    // EYES
    // ==================================

    const eyeSpread =
        5 *
        (1 +
        squash * 0.15);


    const eyeY =
        y - radiusY * 0.30;


    ctx.fillStyle =
        "#ffffff";


    // Left eye
    ctx.beginPath();


    ctx.ellipse(

        x - eyeSpread,

        eyeY,

        4,

        5,

        0,

        0,

        Math.PI * 2
    );


    ctx.fill();


    // Right eye
    ctx.beginPath();


    ctx.ellipse(

        x + eyeSpread,

        eyeY,

        4,

        5,

        0,

        0,

        Math.PI * 2
    );


    ctx.fill();


    // ==================================
    // PUPILS
    // ==================================

    ctx.fillStyle =
        "#111827";


    ctx.beginPath();


    ctx.arc(

        x - eyeSpread,

        eyeY,

        1.5,

        0,

        Math.PI * 2
    );


    ctx.fill();


    ctx.beginPath();


    ctx.arc(

        x + eyeSpread,

        eyeY,

        1.5,

        0,

        Math.PI * 2
    );


    ctx.fill();


    // ==================================
    // MOUTH
    // ==================================

    if (
        squash > 0.2
    ) {

        // Shocked/open mouth
        ctx.fillStyle =
            "#7f1d1d";


        ctx.beginPath();


        ctx.ellipse(

            x,

            y + radiusY * 0.45,

            7,

            4 +
            squash * 5,

            0,

            0,

            Math.PI * 2
        );


        ctx.fill();


        // Tongue
        ctx.strokeStyle =
            "#ef4444";


        ctx.lineWidth = 2;


        ctx.lineCap =
            "round";


        ctx.beginPath();


        ctx.moveTo(

            x,

            y + radiusY * 0.45
        );


        ctx.lineTo(

            x,

            y +
            radiusY * 0.75
        );


        ctx.stroke();

    } else {

        // Normal mouth

        ctx.fillStyle =
            "#f7d98b";


        ctx.beginPath();


        ctx.ellipse(

            x,

            y + 6,

            9,

            5,

            0,

            0,

            Math.PI * 2
        );


        ctx.fill();


        ctx.strokeStyle =
            "#374151";


        ctx.lineWidth = 1.5;


        ctx.beginPath();


        ctx.arc(

            x,

            y + 3,

            7,

            0,

            Math.PI
        );


        ctx.stroke();
    }


    ctx.restore();
}


// ======================================
// MOVE SNAKE
// ======================================

function moveSnake() {

    if (
        gameOver ||
        !gameStarted
    ) {

        return;
    }


    const head = {

        x:
            snake[0].x + dx,

        y:
            snake[0].y + dy
    };


    // ==================================
    // WALL COLLISION
    // ==================================

    if (
        checkWallCollision(head)
    ) {

        gameOver = true;

        gameStarted = false;


        clearInterval(
            gameTimer
        );


        // Save direction
        wallDirectionX =
            dx > 0
                ? 1
                : dx < 0
                    ? -1
                    : 0;


        wallDirectionY =
            dy > 0
                ? 1
                : dy < 0
                    ? -1
                    : 0;


        // Start slow impact
        wallImpact =
            wallImpactDuration;


        gameMessage.textContent =
            "💥 Game Over! You hit the wall.";

        return;
    }


    // ==================================
    // SELF COLLISION
    // ==================================

    if (
        checkSelfCollision(head)
    ) {

        gameOver = true;

        gameStarted = false;


        clearInterval(
            gameTimer
        );


        gameMessage.textContent =
            "Game Over! You hit your own body.";

        return;
    }


    // Add head
    snake.unshift(head);


    // ==================================
    // FOOD
    // ==================================

    const ateFood =
        head.x === food.x &&
        head.y === food.y;


    if (
        ateFood
    ) {

        // Start stomach animation
        stomachAnimation =
            stomachDuration;


        // Fruit
        if (
            food.type === "fruit"
        ) {

            score++;

            scoreDisplay.textContent =
                score;
        }


        // Mouse
        else if (
            food.type === "mouse"
        ) {

            score += 2;

            scoreDisplay.textContent =
                score;


            const tail =
                snake[
                    snake.length - 1
                ];


            snake.push({

                x: tail.x,

                y: tail.y
            });


            snake.push({

                x: tail.x,

                y: tail.y
            });
        }


        // High score
        if (
            score >
            highScore
        ) {

            highScore =
                score;


            highScoreDisplay.textContent =
                highScore;
        }


        updateDifficulty();


        generateFood();


        mouthOpen = 0;

    } else {

        snake.pop();
    }
}


// ======================================
// DIFFICULTY
// ======================================

function updateDifficulty() {

    let newSpeed;


    if (
        score < 5
    ) {

        newSpeed = 150;

    } else if (
        score < 10
    ) {

        newSpeed = 120;

    } else if (
        score < 15
    ) {

        newSpeed = 90;

    } else {

        newSpeed = 70;
    }


    if (
        newSpeed !==
        gameSpeed
    ) {

        gameSpeed =
            newSpeed;


        clearInterval(
            gameTimer
        );


        gameTimer =
            setInterval(
                moveSnake,
                gameSpeed
            );
    }
}


// ======================================
// WALL COLLISION CHECK
// ======================================

function checkWallCollision(head) {

    return (

        head.x < 0 ||

        head.x >=
        canvas.width ||

        head.y < 0 ||

        head.y >=
        canvas.height
    );
}


// ======================================
// SELF COLLISION CHECK
// ======================================

function checkSelfCollision(head) {

    for (
        let i = 1;
        i < snake.length;
        i++
    ) {

        if (

            head.x ===
            snake[i].x &&

            head.y ===
            snake[i].y

        ) {

            return true;
        }
    }


    return false;
}


// ======================================
// KEYBOARD CONTROLS
// ======================================

document.addEventListener(
    "keydown",
    changeDirection
);


function changeDirection(event) {

    const key =
        event.key.toLowerCase();


    // Start
    if (
        !gameStarted &&
        !gameOver
    ) {

        startGame();
    }


    // UP
    if (

        (
            key === "arrowup" ||
            key === "w"
        )

        &&

        dy === 0

    ) {

        dx = 0;

        dy =
            -gridSize;
    }


    // DOWN
    else if (

        (
            key === "arrowdown" ||
            key === "s"
        )

        &&

        dy === 0

    ) {

        dx = 0;

        dy =
            gridSize;
    }


    // LEFT
    else if (

        (
            key === "arrowleft" ||
            key === "a"
        )

        &&

        dx === 0

    ) {

        dx =
            -gridSize;

        dy = 0;
    }


    // RIGHT
    else if (

        (
            key === "arrowright" ||
            key === "d"
        )

        &&

        dx === 0

    ) {

        dx =
            gridSize;

        dy = 0;
    }
}


// ======================================
// GENERATE FOOD
// ======================================

function generateFood() {

    let validPosition =
        false;


    while (
        !validPosition
    ) {

        food.x =

            Math.floor(

                Math.random() *

                (
                    canvas.width /
                    gridSize
                )

            ) * gridSize;


        food.y =

            Math.floor(

                Math.random() *

                (
                    canvas.height /
                    gridSize
                )

            ) * gridSize;


        // 75% fruit
        // 25% mouse

        if (
            Math.random() < 0.75
        ) {

            food.type =
                "fruit";

        } else {

            food.type =
                "mouse";
        }


        validPosition =
            true;


        // Don't spawn on snake

        for (
            let i = 0;
            i < snake.length;
            i++
        ) {

            if (

                food.x ===
                snake[i].x &&

                food.y ===
                snake[i].y

            ) {

                validPosition =
                    false;

                break;
            }
        }
    }
}


// ======================================
// DRAW FOOD
// ======================================

function drawFood() {

    if (
        food.type === "fruit"
    ) {

        drawFruit();

    } else {

        drawMouse();
    }
}


// ======================================
// DRAW FRUIT
// ======================================

function drawFruit() {

    const centerX =
        food.x +
        gridSize / 2;


    const centerY =
        food.y +
        gridSize / 2;


    ctx.shadowColor =
        "#ef4444";


    ctx.shadowBlur = 12;


    ctx.fillStyle =
        "#ef4444";


    ctx.beginPath();


    ctx.arc(

        centerX,

        centerY + 2,

        7,

        0,

        Math.PI * 2
    );


    ctx.fill();


    ctx.shadowBlur = 0;


    // Leaf

    ctx.fillStyle =
        "#16a34a";


    ctx.beginPath();


    ctx.ellipse(

        centerX + 4,

        centerY - 6,

        4,

        2,

        -0.5,

        0,

        Math.PI * 2
    );


    ctx.fill();


    // Highlight

    ctx.fillStyle =
        "#fecaca";


    ctx.beginPath();


    ctx.arc(

        centerX - 3,

        centerY,

        2,

        0,

        Math.PI * 2
    );


    ctx.fill();
}


// ======================================
// DRAW MOUSE
// ======================================

function drawMouse() {

    const centerX =
        food.x +
        gridSize / 2;


    const centerY =
        food.y +
        gridSize / 2;


    ctx.shadowColor =
        "#c084fc";


    ctx.shadowBlur = 8;


    // Body

    ctx.fillStyle =
        "#a78b7b";


    ctx.beginPath();


    ctx.ellipse(

        centerX,

        centerY + 2,

        7,

        6,

        0,

        0,

        Math.PI * 2
    );


    ctx.fill();


    // Ears

    ctx.fillStyle =
        "#f0b6b6";


    ctx.beginPath();


    ctx.arc(

        centerX - 5,

        centerY - 5,

        4,

        0,

        Math.PI * 2
    );


    ctx.fill();


    ctx.beginPath();


    ctx.arc(

        centerX + 5,

        centerY - 5,

        4,

        0,

        Math.PI * 2
    );


    ctx.fill();


    // Face

    ctx.fillStyle =
        "#c4a99a";


    ctx.beginPath();


    ctx.arc(

        centerX,

        centerY,

        5,

        0,

        Math.PI * 2
    );


    ctx.fill();


    // Eyes

    ctx.fillStyle =
        "#111827";


    ctx.beginPath();


    ctx.arc(

        centerX - 2,

        centerY - 1,

        1,

        0,

        Math.PI * 2
    );


    ctx.fill();


    ctx.beginPath();


    ctx.arc(

        centerX + 2,

        centerY - 1,

        1,

        0,

        Math.PI * 2
    );


    ctx.fill();


    // Nose

    ctx.fillStyle =
        "#f472b6";


    ctx.beginPath();


    ctx.arc(

        centerX,

        centerY + 2,

        1.5,

        0,

        Math.PI * 2
    );


    ctx.fill();


    // Tail

    ctx.strokeStyle =
        "#a78b7b";


    ctx.lineWidth = 1.5;


    ctx.beginPath();


    ctx.moveTo(

        centerX + 6,

        centerY + 5
    );


    ctx.quadraticCurveTo(

        centerX + 10,

        centerY + 9,

        centerX + 8,

        centerY + 11
    );


    ctx.stroke();


    ctx.shadowBlur = 0;
}


// ======================================
// RENDER
// ======================================

function render(
    timestamp = 0
) {

    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height
    );


    // Background
    drawGardenBackground();


    // Leaves
    updateLeaves(timestamp);

    drawLeaves();


    // Food proximity
    checkFoodNearSnake();


    // Animations
    updateAnimations();


    // Snake
    drawSnake();


    // Food
    drawFood();


    requestAnimationFrame(
        render
    );
}


// ======================================
// RESTART BUTTON
// ======================================

restartBtn.addEventListener(

    "click",

    resetGame
);


// ======================================
// INITIALIZE
// ======================================

createGrass();

resetGame();

requestAnimationFrame(
    render
);