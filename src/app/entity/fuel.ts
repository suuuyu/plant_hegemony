import { config, moduleData } from '../config';
import Item from './item';
import util from '../util/util';

export default class Fuel extends Item {
    load() {
        super.load('fuel', this.deathing.bind(this));
        const w= config.game.w;
        const mod = this.mod as moduleData;
        mod.x = util.random(0, w);
        this.rotateState = true;
        this.rotateSpeed = 0.5;
    }

    move() {
        const mod = this.mod as moduleData;
        mod.y = <number> mod.y -  <number> mod.speed;
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