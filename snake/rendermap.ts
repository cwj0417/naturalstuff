import {area, grid} from './index';

let ctx: CanvasRenderingContext2D, width: number, height: number;

const mapGridColor = 'rgba(0, 0, 0, .1)';
const mapGridPadding = 10;

const renderMap:(grid: grid, area: area, c: CanvasRenderingContext2D, w: number, h: number)=>void = ([countx, county], [xfrom, yfrom, xto, yto], c, w, h) => {
    ctx = c;
    width = w;
    height = h
    ctx.strokeStyle = mapGridColor;
    for (let line = 0; line <= county; line++) {
        ctx.beginPath();
        ctx.moveTo(0, (yto - yfrom) / county * line + yfrom);
        ctx.lineTo(xto, (yto - yfrom) / county * line + yfrom);
        ctx.stroke();
    }
    for (let column = 0; column <= countx; column++) {
        ctx.beginPath();
        ctx.moveTo((xto - xfrom) / countx * column + xfrom, yfrom);
        ctx.lineTo((xto - xfrom) / countx * column + xfrom, yto);
        ctx.stroke();
    }
}

export default renderMap;
