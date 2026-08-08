// ===== 贪吃蛇游戏核心逻辑 =====

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayText = document.getElementById('overlayText');

// 网格设置
const GRID_SIZE = 20;
const COLS = canvas.width / GRID_SIZE;
const ROWS = canvas.height / GRID_SIZE;

// 游戏状态
let snake, direction, nextDirection, food, score, highScore;
let gameLoop, isPlaying, isPaused, speed;

// 从本地存储读取最高分
highScore = parseInt(localStorage.getItem('snakeHighScore') || '0', 10);
highScoreEl.textContent = highScore;

// 初始化游戏
function initGame() {
    snake = [
        { x: 8, y: 10 },
        { x: 7, y: 10 },
        { x: 6, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    speed = 130;
    scoreEl.textContent = score;
    spawnFood();
}

// 随机生成食物
function spawnFood() {
    let valid = false;
    while (!valid) {
        food = {
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS)
        };
        valid = !snake.some(seg => seg.x === food.x && seg.y === food.y);
    }
}

// 主更新循环
function update() {
    direction = nextDirection;
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // 碰墙检测
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        return gameOver();
    }
    // 碰自身检测
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        return gameOver();
    }

    snake.unshift(head);

    // 吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        spawnFood();
        // 每 50 分加速
        if (score % 50 === 0 && speed > 60) {
            clearInterval(gameLoop);
            speed -= 10;
            gameLoop = setInterval(update, speed);
        }
    } else {
        snake.pop();
    }

    draw();
}

// 绘制画面
function draw() {
    // 背景
    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 网格线
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            ctx.strokeRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }

    // 蛇身
    snake.forEach((seg, idx) => {
        const isHead = idx === 0;
        ctx.fillStyle = isHead ? '#4ade80' : `hsl(${140 - idx * 3}, 70%, ${55 - idx}%)`;
        ctx.beginPath();
        ctx.roundRect(
            seg.x * GRID_SIZE + 1,
            seg.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2,
            isHead ? 6 : 4
        );
        ctx.fill();

        // 蛇头画眼睛
        if (isHead) {
            ctx.fillStyle = '#0d1b2a';
            const eyeSize = 3;
            const offsetX = direction.x * 4;
            const offsetY = direction.y * 4;
            ctx.fillRect(seg.x * GRID_SIZE + 5 + offsetX, seg.y * GRID_SIZE + 5 + offsetY, eyeSize, eyeSize);
            ctx.fillRect(seg.x * GRID_SIZE + 12 + offsetX, seg.y * GRID_SIZE + 5 + offsetY, eyeSize, eyeSize);
        }
    });

    // 食物（带脉动效果）
    const pulse = Math.sin(Date.now() / 200) * 2 + 2;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 3 + pulse * 0.3,
        0, Math.PI * 2
    );
    ctx.fill();
    // 食物高光
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2 - 3,
        food.y * GRID_SIZE + GRID_SIZE / 2 - 3,
        2, 0, Math.PI * 2
    );
    ctx.fill();
}

// 游戏结束
function gameOver() {
    clearInterval(gameLoop);
    isPlaying = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreEl.textContent = highScore;
        overlayTitle.textContent = '🎉 新纪录！';
        overlayText.textContent = `得分 ${score}，按空格键再来一局`;
    } else {
        overlayTitle.textContent = '💀 游戏结束';
        overlayText.textContent = `得分 ${score}，按空格键重新开始`;
    }
    overlay.classList.remove('hidden');
}

// 开始游戏
function startGame() {
    initGame();
    overlay.classList.add('hidden');
    isPlaying = true;
    isPaused = false;
    draw();
    gameLoop = setInterval(update, speed);
}

// 暂停/继续
function togglePause() {
    if (!isPlaying) return;
    if (isPaused) {
        isPaused = false;
        overlay.classList.add('hidden');
        gameLoop = setInterval(update, speed);
    } else {
        isPaused = true;
        clearInterval(gameLoop);
        overlayTitle.textContent = '⏸ 已暂停';
        overlayText.textContent = '按空格键继续';
        overlay.classList.remove('hidden');
    }
}

// 方向控制（防止 180 度反转）
function setDirection(dx, dy) {
    if (direction.x === -dx && direction.y === -dy) return;
    if (direction.x === dx && direction.y === dy) return;
    nextDirection = { x: dx, y: dy };
}

// 键盘事件
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === ' ') {
        e.preventDefault();
        if (!isPlaying) {
            startGame();
        } else {
            togglePause();
        }
        return;
    }
    if (!isPlaying || isPaused) return;
    switch (key) {
        case 'arrowup':
        case 'w':
            setDirection(0, -1); break;
        case 'arrowdown':
        case 's':
            setDirection(0, 1); break;
        case 'arrowleft':
        case 'a':
            setDirection(-1, 0); break;
        case 'arrowright':
        case 'd':
            setDirection(1, 0); break;
    }
});

// 移动端按钮
document.querySelectorAll('.mobile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!isPlaying) { startGame(); return; }
        const dir = btn.dataset.dir;
        switch (dir) {
            case 'up': setDirection(0, -1); break;
            case 'down': setDirection(0, 1); break;
            case 'left': setDirection(-1, 0); break;
            case 'right': setDirection(1, 0); break;
        }
    });
});

// 点击画布开始
canvas.addEventListener('click', () => {
    if (!isPlaying) startGame();
});

// roundRect 兼容性 polyfill
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };
}

// 初始绘制
initGame();
draw();
