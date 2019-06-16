import Frequence from './frequence';
import { config, moduleData } from './config';
import Bullet from './entity/bullet';
import Fuel from './entity/fuel';
import Planet from './entity/planet';
import Meteorite from './entity/meteorite';
import Plane from './entity/plane';
import Item from './entity/item';
import { Scene } from './scene/Scene';
import Playerplane from './entity/player';
import explosion from '@/app/scene/explosion';
import {util} from './util/util';
import Boss from './entity/boss';
import resource from './util/resource';

class Data {
    public time: number;
    public fuel: number;
    public score: number;
    public level: number = 0;
    public Boss: Boss | undefined;
    constructor() {
        this.time = 0;
        this.fuel = 0;
        this.score = 0;
    }
    public arr: boolean[] = [
        false,
        false,
        false,
    ];

    public updateScore(num: number) {
        this.score += num;
        if (this.score > 5000) {this.level = 3;}
        else if (this.score > 2000) {this.level = 2;}
        else if (this.score > 1000) {this.level = 1;}
    }

    public updateFuel(num: number) {
        this.fuel += num;
    }
}

interface Element {
    arr: Item[];
    type: typeof Item;
    appendFrequence: Frequence;
}

export default class Controller {
    public player: Playerplane | undefined;
    public data: Data;
    public friendBullets: Bullet[] = [];
    public enermyBullets: Bullet[] = [];
    private scene: Scene;
    private isBossCome: boolean [] = [false];
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
        this.data.fuel = config.data().fuel;
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
            resource.play('bg', true);
        } else {
            console.error('用户已存在');
        }
    }

    /** 出现第index个boss */
    public addBoss(index: number, e: Element) {
        if(!this.isBossCome[index]) {
            resource.play('warning');
            this.isBossCome[index] = true;
            let boss = new Boss(this.scene);
            boss.init(false, this.enermyBullets);
            boss.load();
            e.arr.push(boss);
            this.data.Boss = boss;
        }
    }

    public addFriend(x: number, life: number) {
        let friend = new Plane(this.scene);
        friend.init(true, this.friendBullets);
        friend.load('friend');
        friend.setAttribute(x, util.random(config.game.h * 4 / 5,config.game.h / 5), life);
        this.friend.arr.push(friend);
    }


    public sendElement() {
        this.send(this.fuels, this.get.bind(this));
        this.send(this.planet, this.get.bind(this));
        this.send(this.meteorite, this.get.bind(this));
        this.send(this.enermy, (e: any, isFriend: boolean = false) => {
            return this.getPlane(e, isFriend);
        });
        if (this.data.level >= 3 ) {
            this.addBoss(0, this.enermy);
        }
        if (this.data.level >= 2 ) {
            this.send(this.enermy, (e: any, isFriend: boolean = false) => {
                return this.getPlane(e, isFriend);
            });
        }
        if (this.data.level >= 3 ) {
            this.send(this.meteorite, this.get.bind(this));
        }
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
        this.data.Boss && this.data.Boss.hasDead ? this.data.Boss = undefined : '';
    }

    /**只能碰撞玩家，碰撞后玩家加血 */
    private updateFuels() {
        const fuels = this.fuels;
        if (this.player) {
            const player = this.player
            const mod = player.mod as moduleData;
            fuels.arr.forEach((fuel, index) => {
                if (util.isCollision(mod, fuel.mod as moduleData)) {
                    // 玩家和油桶碰撞
                    if(fuel.life > 0) {
                        player.getHelp(fuel as Fuel);
                        fuels.arr[index].hurt();
                    }
                    
                }
            });
        }
        
        this.updateArr(fuels.arr);
    }
    /**行星是背景，没有碰撞检测 */
    private updatePlanet() {
        this.updateArr(this.planet.arr);
    }
    /**友军和玩家有碰撞检测 */
    private updateMeteorite() {
        this.collisionTestForMe(this.meteorite.arr);
        this.updateArr(this.meteorite.arr);
    }
    private updatePlane() {
        this.updateArr(this.friend.arr);
        /**友军和玩家碰撞检测 */
        const enermy = this.enermy;
        this.collisionTestForMe(enermy.arr);
        this.updateArr(enermy.arr);
    }
    private updateBullet() {
        /**友军和玩家碰撞检测 */
        this.collisionTestForMe(this.enermyBullets);
        this.updateArr(this.enermyBullets);
        /**敌军和陨石碰撞检测 出烟花特效 */
        this.collisionTestForArr(this.friendBullets, this.enermy.arr);
        this.collisionTestForArr(this.friendBullets, this.enermyBullets);
        this.collisionTestForArr(this.friendBullets, this.meteorite.arr);
        this.updateArr(this.friendBullets);
    }

    /**
     * 
     * @param ele1 bullet
     * @param ele2 
     */
    private collisionTestForArr(ele1: Bullet[], ele2: Item[]) {
        ele1.forEach((e1) => {
            ele2.forEach((e2) => {
                const mod1 = e1.mod as moduleData;
                const mod2 = e2.mod as moduleData;
                if (util.isCollision(mod1, mod2)) {
                    let life = e2.life;
                    if (e1.life > 0 && e2.life > 0) {
                        e2.hurt(e1.life);
                        e1.hurt(life);
                        if (e2.life <= 0) {
                            resource.play('destroyed');
                            if (!e1.isShark()) {
                                // 普通子弹才能加油
                                this.data.fuel +=  e2.maxLife / 2;
                                this.data.fuel = this.data.fuel > 30 ? 30 : this.data.fuel;
                            }
                        }
                        explosion.clickThis(mod1.x, mod1.y);
                    } else if (e2.life <= 0){
                        this.data.updateScore(mod2.life?mod2.life:1);
                    }
                    return;
                }
            });
        });
    }

    private collisionTestForMe(arr: Item[]) {
        if (!this.player) {
            return;
        }
        const player = this.player as Playerplane;
        const playerMod = player.mod as moduleData;
        for (let index = 0; index < arr.length; index++){
            const itemMod = arr[index].mod as moduleData;
            if (util.isCollision(playerMod, itemMod)) {
                if (arr[index].life > 0) {
                    player.hurt(arr[index].life);
                    arr[index].hurt(arr[index].life);
                    explosion.clickThis(itemMod.x, itemMod.y);
                }
                break;
            }
            this.friend.arr.forEach(element => {
                const mod = element.mod as moduleData;
                if (util.isCollision(mod, itemMod)) {
                    let life = element.life;
                    if (arr[index].life > 0 && element.life > 0) {
                        element.hurt(arr[index].life);
                        arr[index].hurt(life)
                    }
                }
            });
        }
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