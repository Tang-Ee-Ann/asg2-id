var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

const MOVEMENT_SPEED = -1.312, UPWARD_BOOST = -1.8, DEFAULT_ACCELERATION = 0.032, PIPE_GAP = 270, PIPE_START = 500,
    CANVAS_BUFFER =  1936; var isRunning = true;

class Vector {
    constructor(x, y) {
        this.x = x; this.y = y;
    }
    translate (x, y) {
        return new Vector(this.x + x, this.y + y);
    }
}

class Rectangle {
    constructor(left, top, right, bottom) {
        this.left = left; this.top = top; this.right = right; this.bottom = bottom;
    }

    hasIntersection(rect) {
        return false;
    }

    hasIntersectionLine(y) {
        return this.top < y && this.bottom > y;
    }

    translate(X, Y) {
        this.left += X; this.right += X; this.top += Y; this.bottom += Y;
    }
}

class FlappyBird {
    constructor (startingPosition) {
        this.boundingBox = new Rectangle(startingPosition.x - 25, startingPosition.y -25,
            startingPosition.x + 25, startingPosition.y + 25);
        this.upwardvelocity = 0.0;
        this.upwardacceleration = DEFAULT_ACCELERATION;
    }

    renderBird() {
        context.fillStyle = 'yellow';
        context.fillRect(this.boundingBox.left, this.boundingBox.top,
            this.boundingBox.right - this.boundingBox.left,
            this.boundingBox.bottom - this.boundingBox.top);
    }
}

function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max-min));
}

class Pipe {
    constructor (startingPosition) {
        var height = getRandomInt(100, 300);
        this.bottomBoundingBox = new Rectangle(startingPosition -50, height, 
            startingPosition + 50, 0);

        this.upperBoundingBox = new Rectangle(startingPosition -50, 1600,
            startingPosition + 50, height + PIPE_GAP/2);
    }

    renderPipe() {
        context.fillStyle = 'green';
        context.fillRect(this.bottomBoundingBox.left, this.bottomBoundingBox.top, 
            this.bottomBoundingBox.right - this.bottomBoundingBox.left,
            this.bottomBoundingBox.bottom - this.bottomBoundingBox.top);
        context.fillStyle = 'orange';
        context.fillRect(this.upperBoundingBox.left, this.upperBoundingBox.top, 
            this.upperBoundingBox.right - this.upperBoundingBox.left,
            this.upperBoundingBox.bottom - this.upperBoundingBox.top);
    }

    translate(xoffset) {
        this.bottomBoundingBox.translate(xoffset, 0);
        this.upperBoundingBox.translate(xoffset, 0);
    }
}

var g_gamePipes = [];
function addnewPipes(startingPosition) {
    g_gamePipes.push(new Pipe(startingPosition));
}

function generateNewPipes() {
    if (0 == g_gamePipes.length) {
        for (i=PIPE_START; i < CANVAS_BUFFER; i+= PIPE_GAP) {
            addnewPipes(i);
        }
        return;
    }
    if (g_gamePipes[0].bottomBoundingBox.right < 0) {
        g_gamePipes.shift();
        addnewPipes(g_gamePipes[g_gamePipes.length -1].bottomBoundingBox.right - 50 + PIPE_GAP);
    }
}

var g_flappybird = new FlappyBird(new Vector(100, 250));
generateNewPipes();

function game_update() {
    generateNewPipes();
    g_gamePipes.forEach(function(item, index) {
        item.translate(MOVEMENT_SPEED);
        if (item.bottomBoundingBox.hasIntersection(g_flappybird.boundingBox) || 
            item.upperBoundingBox.hasIntersection(g_flappybird.boundingBox))
        {
            isRunning = false; return;
        }
    });
    if (g_flappybird.boundingBox.hasIntersectionLine(489) || g_flappybird.boundingBox.hasIntersectionLine(0))
    {
        isRunning = false; return;
    }
    g_flappybird.upwardvelocity += g_flappybird.upwardacceleration;
    g_flappybird.boundingBox.translate(0, g_flappybird.upwardvelocity + 
        0.5 * g_flappybird.upwardacceleration);
}

function game_render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    g_gamePipes.forEach(function(item, index) {
        item.renderPipe();
    });
    g_flappybird.renderBird();
}

function gameloop() {
    game_update(); game_render();
    if (isRunning) window.requestAnimationFrame(gameloop);
}

window.onkeyup = function(e) {
    if (" " == e.key)
    g_flappybird.upwardvelocity = UPWARD_BOOST;
};
window.requestAnimationFrame(gameloop);