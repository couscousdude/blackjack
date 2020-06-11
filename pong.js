// create a vector class
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set len(value) {
        const factor = value / this.len;
        this.x *= factor;
        this.y *= factor;
    }
}

// create a rectangle class
class Rect {
    constructor(w, h) {
        this.pos = new Vector;
        this.size = new Vector(w, h);
    }
    get left() {
        return this.pos.x - this.size.x / 2;
    }
    get right() {
        return this.pos.x + this.size.x / 2;
    }
    get top() {
        return this.pos.y - this.size.y / 2;
    }
    get bottom() {
        return this.pos.y + this.size.y / 2;
    }
}

// create a child of the rectangle class for the ball
class Ball extends Rect {
    constructor() {
        super(10, 10);
        this.velocity = new Vector;
    }
}

class Player extends Rect {
    constructor() {
        super(20, 100);
        this.score = 0;
    }
}

class Pong {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d'); // we need a 2d context

        this.ball = new Ball;

        this.players = [
            new Player,
            new Player
        ];

        this.hit = new Audio('hit.mp3');
        this.bounce = new Audio('bounce.mp3');
        this.loss = new Audio('loss.mp3');

        this.players[0].pos.x = 40;
        this.players[1].pos.x = this._canvas.width - 40;
        this.players.forEach(player => player.pos.y = this._canvas.height / 2);

        let lastTime;
        const callback = (ms) => {
            if (lastTime) {
                this.updatePosition((ms - lastTime) / 1000);
            }
            lastTime = ms;
            requestAnimationFrame(callback); // requestAnimationFrame is a function which takes a callback to update an animation before the next repaint  
        }
        callback();

        this.CHAR_PIXEL = 10;
        this.CHARS = [
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001111',
        ].map(str => {
            const canvas = document.createElement('canvas');
            const s = this.CHAR_PIXEL;
            canvas.height = s * 5;
            canvas.width = s * 3;
            const context = canvas.getContext('2d');
            context.fillStyle = '#fff';
            str.split('').forEach((fill, i) => {
                if (fill === '1') {
                    context.fillRect((i % 3) * s, (i / 3 | 0) * s, s, s);
                }
            });
            return canvas;
        });

        this.reset();
    }

    collide(player, ball) {
        if (ball.right > player.left && ball.left < player.right
            && player.top < ball.bottom && player.bottom > ball.top) {
            const len = ball.velocity.len;
            this.hit.play();
            this.ball.velocity.x = -this.ball.velocity.x;
            ball.velocity.y += 300 * (Math.random() - 0.5);
            ball.velocity.len = len * 1.05;
        }
    }

    draw() {
        this._context.fillStyle = '#000'; // fill the rectangle black
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));

        this.drawScore();
    }

    drawRect(rect) {
        this._context.fillStyle = '#fff';
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

    drawScore()
    {
        const align = this._canvas.width / 3;
        const cw = this.CHAR_PIXEL * 4;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split('');
            const offset = align * (index + 1) - (cw * chars.length / 2) + this.CHAR_PIXEL / 2;
            chars.forEach((char, pos) => {
                this._context.drawImage(this.CHARS[char|0], offset + pos * cw, 20);
            });
        });
    }

    reset() {
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height / 2;
        this.ball.velocity.x = 0;
        this.ball.velocity.y = 0;
        this.players.forEach(player => player.pos.y = this._canvas.height / 2);
    }

    start() {
        if (this.ball.velocity.x === 0 && this.ball.velocity.y === 0) {
            this.ball.velocity.x = 500 * (Math.random() > .5 ? 1 : -1);
            this.ball.velocity.y = 500 * (Math.random() * 2 -1);
            this.ball.velocity.len = 200;
        }
    }

    // updatePosition allows the position of the ball to change
    updatePosition(deltaTime) {
        this.ball.pos.x += this.ball.velocity.x * deltaTime;
        this.ball.pos.y += this.ball.velocity.y * deltaTime;

        if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
            let playerID;
            if (this.ball.velocity.x < 0) {
                playerID = 1;
            } else {
                playerID = 0;
            }
            console.log(playerID);
            this.players[playerID].score++;
            this.loss.play();
            this.reset();
        }
    
        if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.velocity.y = -this.ball.velocity.y;
            this.bounce.play();
        }

        if (this.players[1].pos.y < this.ball.pos.y) {
            let botSpeedIncrease;
            if (this.ball.velocity.len < 500) {
                botSpeedIncrease = this.ball.velocity.len / 200;
            } else if (this.ball.velocity.len === 500) {
                botSpeedIncrease = 3;
            }
            this.players[1].pos.y += 3 + botSpeedIncrease;
        }

        if (this.players[1].pos.y > this.ball.pos.y) {
            let botSpeedIncrease;
            if (this.ball.velocity.len < 500) {
                botSpeedIncrease = this.ball.velocity.len / 200;
            } else if (this.ball.velocity.len === 500) {
                botSpeedIncrease = 2.5;
            }
            this.players[1].pos.y -= 3 + botSpeedIncrease;
        }
        // this.players[1].pos.y = this.ball.pos.y;

        this.players.forEach(player => this.collide(player, this.ball));

        this.draw();
    }
}

const canvas = document.getElementById('pong'); // initialize the canvas

const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event => {
    const scale = event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].pos.y = canvas.height * scale;
})

canvas.addEventListener('click', event => {
    pong.start();
})