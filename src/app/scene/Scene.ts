import {config} from '@/app/config';
import Frequence from '../frequence';
import util from '../util/util';
import Controller from '../controller';
import resource from '../util/resource';

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
    public canvas: HTMLCanvasElement | undefined;
    private ctx: any;
    private register_id: string;
    private timeCounter: Frequence = new Frequence(config.game.fps, false)
    public controller: Controller;
    private x1: number = config.game.w;
    private x2: number = 0;

    constructor() {
        this.register_id = '';
        this.controller = new Controller(this);
    }

    public load(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.register_id = 'play';
        this.initCanvas();
        this.start();
    }
    private start() {
        util.TimeKeeper.register(this.register_id, this.update.bind(this));
    }
    /**
     * 更新荧幕 (每秒被调用60次)
     */
    public update() {
        this.timeCounter.update().active(() => {
            this.controller.data.time++;
        });
        this.ctx.clearRect(0, 0, config.game.w, config.game.h);
        this.scroll();
        this.controller.sendElement();
        this.controller.updateElement();
    }

    /**
     * 基本绘图api
     * @param data 
     */
    public draw(data: any[]): void {
        this.ctx.drawImage.apply(this.ctx, data);
    }

    private drawBackground(offsetX: number = 0) {
        this.ctx.drawImage(resource.findImgByKey('background'), offsetX, 0);
    }

    private scroll(){
        const w = config.game.w;
        this.x1 = (this.x1 === -w) ? w : (this.x1 - 1);
        this.x2 = (this.x2 === -w) ? w : (this.x2 - 1);
        this.drawBackground(this.x1);
        this.drawBackground(this.x2);
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

    private initCanvas(): void {
        const canvas = this.canvas as HTMLCanvasElement;
        this.ctx = canvas.getContext('2d');
        canvas.width = config.game.w;
        canvas.height = config.game.h;
    }

}

export { Scene, Data };

