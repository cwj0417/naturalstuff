import shapes, {Shape} from './shape';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
document.body.append(canvas);

const renderList: Shape[] = [];

renderList.push(shapes.get('fire', width, height, ctx));
renderList.push(shapes.get('rain', width, height, ctx));

const render: ()=>void = () => {
    window.requestAnimationFrame(render);
    // setTimeout(render, 500);
    ctx.globalCompositeOperation="destination-out";
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.2)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    renderList.forEach(shape => shape.render());
}
render();
