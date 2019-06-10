import { config, moduleData } from '../config';
import Item from './item';
import {util} from '../util/util';
import resource from '../util/resource';

/**
 * 道具类，60%血包，40%武器升级包
 */
export default class Fuel extends Item {
    /**种类标识，0为武器升级包，1为血包 */
    public type: number = 0;
    load() {
        super.load('fuel', this.deathing.bind(this));
        const w= config.game.w;
        const mod = this.mod as moduleData;
        mod.x = util.random(0, w);
        this.rotateState = true;
        this.rotateSpeed = 0.5;
        if (util.random(10, 0) > 2) {
            this.img = resource.findImgByKey('aid');
            this.type = 1;
        }
    }

    move() {
        const mod = this.mod as moduleData;
        mod.y -= mod.speed;
    }

    update() {
        if (this.run) {
            this.move();
        }
        super.update();
    }  

    deathing() {
        this.hasDead = true;
    }
}