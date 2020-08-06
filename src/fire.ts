import {Shape, Partical, rand} from './shape';

export class FirePartical implements Partical {
    needDestroy: boolean = false;
    color: string;
    radius: number;
    x: number;
    y: number;
    width: number;
    ctx: CanvasRenderingContext2D;
    constructor (w: number, h: number, ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.color = 'rgba(200,5,0,0.3)';
        this.radius = rand(5, 25);
        this.x = w / 2;
        this.y = h / 2;
        this.width = 1;
    }
    update () {
        if (this.radius > 0) {
            this.x -= rand(-3, 3);
            this.y -= rand(3, 4);
            this.radius -= 0.5;
        } else {
            this.needDestroy = true;
        }
    }
    render () {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.width;
        this.ctx.fill();
        this.ctx.stroke();
    }
}

export class Fire implements Shape {
    particals: Partical[] = [];
    w: number;
    h: number;
    ctx: CanvasRenderingContext2D;
    constructor (w: number, h: number,  ctx: CanvasRenderingContext2D) {
        this.w = w;
        this.h = h;
        this.ctx = ctx;
        Array.from({length: 150}).map(() => {
            this.particals.push(new FirePartical(w, h, ctx));
        })
    }
    render () {
        for (let i = 0; i < this.particals.length; i++) {
            this.particals[i].render();
            this.particals[i].update();
            if (this.particals[i].needDestroy) {
                this.particals[i] = new FirePartical(this.w, this.h, this.ctx);
            }
        }
    }
}
