import renderMap from './rendermap';
import {width, height, gameGrid, gameArea, scoreArea, snakeStyle} from './conf';
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;
document.body.style.background = '#f9cc4d';
document.body.append(canvas);

export type area = [number, number, number, number];
export type grid = [number, number];
export type coord = [number, number];
export type direct = [0, 1] | [-1, 0] | [0, -1] | [1, 0];
export type gamestatus = 'running' | 'pause' | 'fail' | 'success';

const headimg = document.createElement('img');
headimg.src = 'imgs/head.png';
const targetimg = document.createElement('img');
targetimg.src = 'imgs/apple.jpg';

// global

let status: gamestatus = 'running';
let score = 0;
let step = 0;

// snake and target

const getRandomInArr: (arr: number[])=>number = arr => {
    return arr[Math.floor(Math.random() * arr.length)];
}
const getEmptyRandomPoint: () => coord = () => {
    const colSpare = Array
    .from({length: gameGrid[0]})
    .map((u: undefined, i) => (!snake.bodyInfo[i + 1] || [...snake.bodyInfo[i + 1]].length < gameGrid[0]) ? i + 1 : u)
    .filter(i => i);
    if (colSpare.length === 0) return [-1, -1];
    const column = getRandomInArr(colSpare);
    const lineSpare = Array
    .from({length: gameGrid[1]})
    .map((u: undefined, i) => snake.bodyInfo[column] && snake.bodyInfo[column].has(i + 1) ? u : i + 1)
    .filter(i => i);
    const line = getRandomInArr(lineSpare);
    return [column, line];
}

const getGridRect
    : (xno: number, yno: number) => area
    = (xno, yno) => {
        const tickx = (gameArea[2] - gameArea[0]) / gameGrid[0];
        const ticky = (gameArea[3] - gameArea[1]) / gameGrid[1];
        return [(xno - 1) * tickx + gameArea[0], (yno - 1) * ticky + gameArea[1], tickx, ticky];
    }

class Snake {
    body: coord[];
    direct: direct;
    bodyInfo: {
        [line: number]: Set<number>
    };
    constructor() {
        this.body = [[1, 1]];
        this.direct = [0, 1];
        this.bodyInfo = {1: new Set([1])}
    }
    setDirect(d: direct) {
        if (d[0] === this.direct[0] && d[1] + this.direct[1] === 0) return;
        if (d[1] === this.direct[1] && d[0] + this.direct[0] === 0) return;
        this.direct = d;
    }
    update() {
        const nextPosition: coord = [this.body[0][0] + this.direct[0], this.body[0][1] + this.direct[1]];
        const [x, y] = nextPosition;
        // judge if blocked
        if (x <= 0
            || x > gameGrid[0]
            || y <= 0
            || y > gameGrid[1]) {
            status = 'fail';
            return;
        }
        // judge if eat self
        if (this.bodyInfo[x] && this.bodyInfo[x].has(y)) {
            status = 'fail';
            return;
        }
        // push to body
        score += this.body.length;
        step += 1;
        this.body.unshift(nextPosition);
        this.bodyInfo[x] && this.bodyInfo[x].add(y) || (this.bodyInfo[x] = new Set([y]));
        // judge if reach target
        if (x === target[0] && y === target[1]) {
            score += 5 * this.body.length;
            target = getEmptyRandomPoint();
            if (target === [-1, -1]) {
                status = 'success';
            }
        } else {
            const [dx, dy] = this.body.pop();
            if ([...this.bodyInfo[dx]].length === 1) {
                delete this.bodyInfo[dx];
            } else {
                this.bodyInfo[dx].delete(dy);
            }
        }
    }
    render() {
        this.body.forEach(this.renderCell);
    }
    renderCell(cell: coord, index: number) {
        let angle;
        if (index === 0) {
            switch (snake.direct.toString()) {
                case '-1,0':
                    angle = Math.PI * 3 / 2;
                    break;
                case '0,-1':
                    angle = Math.PI * 2;
                    break;
                case '1,0': 
                    angle = Math.PI / 2;
                    break;
                case '0,1':
                    angle = Math.PI;
                    break;
            }
            ctx.save();
            const [x, y, w, h] = getGridRect(...cell);
            ctx.translate(x + w / 2, y + h / 2);
            ctx.rotate(angle);
            ctx.drawImage(headimg, w / -2, h / -2, w, h);
            ctx.restore();
        } else {
            ctx.fillStyle = snakeStyle;
            ctx.fillRect(...getGridRect(...cell));
        }
    } 
}

const snake = new Snake();
let target: coord = getEmptyRandomPoint();

const renderTarget = () => {
    ctx.drawImage(targetimg, ...getGridRect(...target));
}

const renderScore = () => {
    ctx.font = '30px microsoftyahei';
    ctx.fillStyle = '#000';
    ctx.fillText(
        `总分: ${score}, 步数: ${step}, 长度: ${snake.body.length}, 速度: ${(1 / Math.pow((1 / snake.body.length), 0.2)).toFixed(1)}`
        , 40
        , (scoreArea[3] - scoreArea[1]) / 2, scoreArea[2] - scoreArea[0] - 80);
}

const render: (init?: boolean) => void = (init = true) => {
    setTimeout(render, Math.pow((1 / snake.body.length), 0.2) * 1000, false);

    if (status === 'running') {
        ctx.clearRect(0, 0, width, height);
        renderMap(gameGrid, gameArea, ctx, width, height);
        !init && snake.update();
        snake.render();
        renderTarget();
        renderScore();
    } else {
        if (status === 'pause') {
            ctx.font = '80px bold pinfang';
            ctx.fillStyle = 'black';
            ctx.fillText('暂停', width / 2 - 80, height / 2 - 40);
        } else if (status === 'fail') {
            ctx.font = '80px bold pinfang';
            ctx.fillStyle = 'black';
            ctx.fillText('游戏结束', width / 2 - 160, height / 2 - 40);
        } else if (status === 'success') {
            ctx.font = '80px bold pinfang';
            ctx.fillStyle = 'black';
            ctx.fillText('完美', width / 2 - 160, height / 2 - 40);
        }
    }
}
render();

document.addEventListener('keyup', e => {
    if (e.keyCode === 37) { // left
        snake.setDirect([-1, 0]);
    }
    if (e.keyCode === 38) { // top
        snake.setDirect([0, -1]);
    }
    if (e.keyCode === 39) { // right
        snake.setDirect([1, 0]);
    }
    if (e.keyCode === 40) { // down
        snake.setDirect([0, 1]);
    }
    if (e.keyCode === 32) { // pause
        if (status === 'running') {
            status = 'pause';
        } else if (status === 'pause') {
            status = 'running';
        }
    }
})