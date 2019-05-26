import {config} from '@/app/config';
import Frequence from '../frequence';
import util from '../util/util';
import Fuel from '../entity/fuel'
import Item from '../entity/item';
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

interface element {
    arr: Item[],
    type: typeof Fuel,
    appendFrequence: Frequence,
}

 class Scene {
    private canvas: any;
    private ctx: any;
    public data: Data;
    private register_id: string;
    private timeCounter: Frequence = new Frequence(config.game.fps, false)
    private fuels: element = {
        arr: [],
        type: Fuel,
        appendFrequence: new Frequence(config.game.appendFuelFrequence)
    };


    constructor() {
        this.data = new Data();
        this.register_id = '';
    }

    public load(canvas: any): void {
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
            this.data.time++;
        });
        this.ctx.clearRect(0, 0, config.game.w, config.game.h);
        this.appendElement();
        this.updateElement();
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

    private updateElement() {
        this.updateFuels();
    }

    /**
     * 更新油桶显示，油桶碰撞检测
     */
    private updateFuels() {
        this.updateArr(this.fuels.arr);
    }

    /**
     * 更新数组中的所有Item类型元素
     * @param arr 
     * @param callback 
     */
    private updateArr(arr: Item[], callback: Function | undefined = undefined) {
        for(let i = arr.length - 1; i>=0; i-- ) {
            const e = arr[i];
            if(e.hasDead) {
                arr.splice(i, 1);
                continue;
            }
            e.update();
            callback && callback(e);
        }
    }

    public get(obj: typeof Fuel): Fuel {
        let o = new obj(this);
        o.load();
        console.log(o);
        return o;
    }

    private initCanvas(): void {
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = config.game.w;
        this.canvas.height = config.game.h;
    }

    private appendElement() {
        this.append(this.fuels);
    }

    private append(e: element) {
        e.appendFrequence.update().active(() => {
            e.arr.push(
                this.get(e.type)
            )
        });
    }
}

export { Scene, Data };

