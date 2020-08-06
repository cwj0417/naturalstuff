import {Rain} from './rain';
import {Fire} from './fire';

export const rand: (min: number, max: number)=>number =  (min, max) =>{
    return Math.floor((Math.random() * (max - min + 1)) + min);
};
export interface Shape {
    w: number;
    h: number;
    ctx: CanvasRenderingContext2D;
    render: ()=>void;
    particals: Partical[];
}
export interface Partical {
    update: ()=>void;
    render: ()=>void;
    color: string;
    needDestroy: boolean;
    ctx: CanvasRenderingContext2D;
    radius?: number;
    x?: number;
    y?: number;
    width?: number;
}

const factory = {
    get:(type: 'fire' | 'rain', w:number, h:number, ctx: CanvasRenderingContext2D):Shape =>{
        const provider = {
            fire: new Fire(w, h, ctx),
            rain: new Rain(w, h, ctx),
        }
        return provider[type];
    }
}

export default factory;
