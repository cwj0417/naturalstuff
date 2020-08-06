import {Shape, Partical, rand} from './shape';

export class RainPartical implements Partical {
    needDestroy: boolean = false;
    g: number = 5;
    color: string;
    ctx: CanvasRenderingContext2D;
    radius: number;
    w: number;
    h: number;
    x: number;
    y: number;
    vy: number;
    width: number;
    constructor (w: number, h: number, ctx: CanvasRenderingContext2D, index: number, num: number) {
        this.ctx = ctx;
        this.color = 'rgb(135,206,235)';
        this.radius = rand(0.1, 0.5);
        this.w = w;
        this.h = h;
        this.x = index / num * w + rand(-w / num / 2, w / num / 2);
        this.y = rand(-25, 45);
        this.vy = 0;
        this.width = 1;
    }
    update () {
        if (this.y < this.h && (this.x > 0) && (this.x < this.w)) {
            this.x += rand(3, -7);
            this.vy += this.g;
            this.y += this.vy;
            this.radius += rand(0.1, 0.2);
        } else {
            this.needDestroy = true;
        }

    }
    render () {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        const fillstyle= this.ctx.createLinearGradient(this.x - this.radius / 1 ,this.y - this.radius / 1, this.x + this.radius * 2, this.y + this.radius * 2);
        fillstyle.addColorStop(0, "#fff");
        fillstyle.addColorStop(1, this.color);
        this.ctx.fillStyle = fillstyle;
        this.ctx.strokeStyle = '#fff';
        this.ctx.fill();
        this.ctx.stroke();
    }
}

export class Rain implements Shape {
    particals: Partical[] = [];
    particalnum: number = 50;
    w: number;
    h: number;
    ctx: CanvasRenderingContext2D;
    constructor (w: number, h: number, ctx: CanvasRenderingContext2D) {
        this.w = w;
        this.h = h;
        this.ctx = ctx;
        Array.from({length: this.particalnum}).map((n, index) => {
            this.particals.push(new RainPartical(w, h, ctx, index, this.particalnum));
        })
    }
    render () {
        for (let i = 0; i < this.particals.length; i++) {
            this.particals[i].render();
            this.particals[i].update();
            if (this.particals[i].needDestroy) {
                this.particals.splice(i, 1);
            }
        }
        Array.from({length: this.particalnum}).map((n, index) => {
            this.particals.push(new RainPartical(this.w, this.h, this.ctx, index, this.particalnum));
        })
    }
}
