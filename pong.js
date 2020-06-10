// create a vector class
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
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
        this.reset();
    }

    collide(player, ball) {
        if (ball.right > player.left && ball.left < player.right
            && player.top < ball.bottom && player.bottom > ball.top) {
            this.ball.velocity.x = -this.ball.velocity.x;
        }
    }

    draw() {
        this._context.fillStyle = '#000'; // fill the rectangle black
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));
    }

    drawRect(rect) {
        this._context.fillStyle = '#fff';
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

    reset() {
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height / 2;
        this.ball.velocity.x = 0;
        this.ball.velocity.y = 0;
    }

    start() {
        if (this.ball.velocity.x === 0 && this.ball.velocity.y === 0) {
            this.ball.velocity.x = 300;
            this.ball.velocity.y = 300;
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
            this.reset();
        }
    
        if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.velocity.y = -this.ball.velocity.y;
        }

        this.players[1].pos.y = this.ball.pos.y;

        this.players.forEach(player => this.collide(player, this.ball));

        this.draw();
    }
}

const canvas = document.getElementById('pong'); // initialize the canvas

const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event => {
    pong.players[0].pos.y = event.offsetY;
})

canvas.addEventListener('click', event => {
    pong.start();
})