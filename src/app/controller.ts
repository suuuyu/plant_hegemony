import Frequence from './frequence';
import { config } from './config';
import Bullet from './entity/bullet';
import Fuel from './entity/fuel';
import Planet from './entity/planet';
import Meteorite from './entity/meteorite';
import Plane from './entity/plane';
import Item from './entity/item';
import { Scene } from './scene/Scene';
import Playerplane from './entity/player';
import explosion from '@/app/scene/explosion';

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

interface Element {
    arr: Item[];
    type: typeof Item;
    appendFrequence: Frequence;
}

export default class Controller {
    private player: Playerplane | undefined;
    public data: Data;
    public friendBullets: Bullet[] = [];
    public enermyBullets: Bullet[] = [];
    private scene: Scene;
    private fuels: Element = {
        arr: [],
        type: Fuel,
        appendFrequence: new Frequence(config.game.appendFuelFrequence)
    };
    private planet: Element = {
        arr: [],
        type: Planet,
        appendFrequence: new Frequence(config.game.appendPlanetFrequence)
    }
    public meteorite: Element = {
        arr: [],
        type: Meteorite,
        appendFrequence: new Frequence(config.game.appendPlanetFrequence)
    }
    public friend: Element = {
        arr: [],
        type: Plane,
        appendFrequence: new Frequence(config.game.appendFriendFrequence)
    }
    public enermy: Element = {
        arr: [],
        type: Plane,
        appendFrequence: new Frequence(config.game.appendEnemyFrequence)
    }
    constructor(scene: Scene){
        this.scene = scene;
        this.data = new Data();
    }

    /**
     * 添加玩家，并为玩家绑定操作dom
     * @param dom 
     */
    public addPlayer(dom: HTMLElement) {
        if (this.player === undefined) {
            this.player = new Playerplane(this.scene);
            this.player.init(true, this.friendBullets);
            this.player.bindMoveEvent(dom);
            console.error(this.player);
        } else {
            console.error('用户已存在');
        }
    }

    // public movePlayer(x: number, y: number) {
    //     // explosion.clickThis(x, y);
    //     const player = this.player as Playerplane;
    //     player.controlMove(x, y);
    // }

    public sendElement() {
        this.send(this.fuels, this.get.bind(this));
        this.send(this.planet, this.get.bind(this));
        this.send(this.meteorite, this.get.bind(this));
        this.send(this.enermy, (e: any, isFriend: boolean = false) => {
            return this.getPlane(e, isFriend);
        });
        // this.send(this.friend, (e: any, isFriend: boolean = true) => {
        //     return this.getPlane(e, isFriend);
        // });
    }

    private getPlane(obj: any, isFriend: boolean) {
        let o = new obj(this.scene);
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
        let o = new obj(this.scene);
        o.load();
        return o;
    }

    /**
     * 
     * @param e 新建元素的元素组
     * @param fn 初始化元素的方法
     */
    private send(e: Element, fn: Function) {
        e.appendFrequence.update().active(() => {
            e.arr.push(
                fn(e.type)
            )
        });
    }


    public updateElement() {
        this.updateFuels();
        this.updatePlanet();
        this.updateMeteorite();
        this.updatePlane();
        this.updateBullet();
        this.player && this.player.update();
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
}