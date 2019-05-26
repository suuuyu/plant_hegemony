import {config} from '@/app/config';
interface drawData {
    img: string
}

class Data {
    public time: number;
    public fuel: number;
    public score: number;
    constructor() {
        this.time = 0;
        this.fuel = 0;
        this.score = 0;
    }
}

 class Scene {
    private canvas: any;
    private ctx: any;
    public data: Data;
    private register_id: string;

    constructor(canvas: any) {
        this.canvas = canvas;
        this.register_id = '';
        this.initCanvas();
        this.data = new Data();
    }

    private initCanvas(): void {
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = config.game.w;
        this.canvas.height = config.game.h;
    }

    public load(): void {

    }

    /**
     * 基本绘图api
     * @param data 
     */
    public draw(data: any[]): void {
        this.ctx.drawImage.apply(this.ctx, data);
    }

    /**
     * 绘制旋转图形
     * @param conf 
     */
    public rotateDraw(conf: {deg: number, x: number, y: number, data: any}) {
        this.ctx.save();
        this.ctx.translate(conf.x, conf.y);
        this.ctx.rotate(conf.deg * Math.PI / 180);
        this.draw(conf.data);
        this.ctx.restore();
    }
}

export { Scene, Data };

