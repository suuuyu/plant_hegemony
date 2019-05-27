import {config} from '@/app/config';
import Frequence from '../frequence';
import util from '../util/util';
import Fuel from '../entity/fuel'
import Item from '../entity/item';
import Planet from '../entity/planet';
import Meteorite from '../entity/meteorite';
import Bullet from '../entity/bullet';
import Plane from '../entity/plane';
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
    type: typeof Item,
    appendFrequence: Frequence,
}

 class Scene {
    private canvas: any;
    private ctx: any;
    public data: Data;
    private register_id: string;
    private timeCounter: Frequence = new Frequence(config.game.fps, false)
    public friendBullets: Bullet[] = [];
    public enermyBullets: Bullet[] = [];
    private fuels: element = {
        arr: [],
        type: Fuel,
        appendFrequence: new Frequence(config.game.appendFuelFrequence)
    };
    private planet: element = {
        arr: [],
        type: Planet,
        appendFrequence: new Frequence(config.game.appendPlanetFrequence)
    }
    public meteorite: element = {
        arr: [],
        type: Meteorite,
        appendFrequence: new Frequence(config.game.appendPlanetFrequence)
    }
    public friend: element = {
        arr: [],
        type: Plane,
        appendFrequence: new Frequence(config.game.appendFriendFrequence)
    }
    public enermy: element = {
        arr: [],
        type: Plane,
        appendFrequence: new Frequence(config.game.appendEnemyFrequence)
    }


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
        this.updatePlanet();
        this.updateMeteorite();
        this.updatePlane();
        this.updateBullet();
    }

    /**
     * 更新油桶显示，油桶碰撞检测
     */
    private updateFuels() {
        this.updateArr(this.fuels.arr);
    }
    private updatePlanet() {
        this.updateArr(this.planet.arr);
    }
    private updateMeteorite() {
        this.updateArr(this.meteorite.arr);
    }
    private updatePlane() {
        this.updateArr(this.friend.arr);
        this.updateArr(this.enermy.arr);
    }
    private updateBullet() {
        this.updateArr(this.enermyBullets);
        this.updateArr(this.friendBullets);
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

    private initCanvas(): void {
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = config.game.w;
        this.canvas.height = config.game.h;
    }

    private appendElement() {
        this.append(this.fuels, this.get.bind(this));
        this.append(this.planet, this.get.bind(this));
        this.append(this.meteorite, this.get.bind(this));
        this.append(this.enermy, (e: any, isFriend: boolean = false) => {
            return this.getPlane(e, isFriend);
        });
        this.append(this.friend, (e: any, isFriend: boolean = true) => {
            return this.getPlane(e, isFriend);
        });
    }

    private getPlane(obj: any, isFriend: boolean) {
        let o = new obj(this);
        if(isFriend) {
            //新建友军
            o.init(isFriend, this.friendBullets);
            o.load('friend');
        } else {
            //新建敌军
            o.init(isFriend, this.enermyBullets);
            o.load('enemy');
        }
        return o;
    }

    public get(obj: any): Item {
        let o = new obj(this);
        o.load();
        return o;
    }

    /**
     * 
     * @param e 新建元素的元素组
     * @param fn 初始化元素的方法
     */
    private append(e: element, fn: Function) {
        e.appendFrequence.update().active(() => {
            e.arr.push(
                fn(e.type)
            )
        });
    }
}

export { Scene, Data };

