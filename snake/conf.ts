import {area, grid} from './index'

export const width = window.innerWidth;
export const height = window.innerHeight;

export const scoreArea: area = [0, 0, width, 100];
export const gameArea: area = [0, 100, width, height];

export const gameGrid: grid = [10, 5];
export const snakeStyle = '#70c7c6';