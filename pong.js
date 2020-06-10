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

let lastTime;
function callback(ms) {
    if (lastTime) {
        updatePosition((ms - lastTime) / 1000);
    }
    lastTime = ms;
    requestAnimationFrame(callback); // requestAnimationFrame is a function which takes a callback to update an animation before the next repaint
}

// updatePosition allowed the position of the ball to be changed
function updatePosition(deltaTime) {
    ball.pos.x += ball.velocity.x * deltaTime;
    ball.pos.y += ball.velocity.y * deltaTime;
    context.fillStyle = '#000'; // fill the rectangle black
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (ball.left < 0 || ball.right > canvas.width) {
        ball.velocity.x = -ball.velocity.x;
    }

    if (ball.top < 0 || ball.bottom > canvas.height) {
        ball.velocity.y = -ball.velocity.y;
    }

    context.fillStyle = '#fff'; //fill the ball white
    context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
}

const canvas = document.getElementById('pong'); // initialize the canvas
const context = canvas.getContext('2d'); // we need a 2d context

const ball = new Ball;
ball.pos.x = 100;
ball.pos.y = 100;
ball.velocity.x = 100;
ball.velocity.y = 100;
console.log(ball);

callback();