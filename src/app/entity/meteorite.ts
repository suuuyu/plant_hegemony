import Item from "./item";
import { moduleData, config } from '../config';
import {util} from '../util/util';
import { Scene } from '../scene/Scene';
import { Animation} from './animation';

export default class Meteorite extends Item {

  private deathAnimation: Animation;
  private direction: number = 1;
  private rebound: Function | undefined;
  constructor(scene: Scene) {
    super(scene);
    this.deathAnimation = new Animation(config.planeDeathAnimation(), scene);
}
  public load () {
    super.load('meteorite', this.deathing.bind(this));
    const mod = this.mod as moduleData;
    const { w } = config.game;
    const y = util.random(w, w/8);
    const x = util.random(w/8, 0)
    mod.x = w + x;
    mod.y = -y;
    this.rotateSpeed = -5;
    this.rotateState = true;
  }

  public update() {
    if (this.run) {
      if (this.scene.controller.data.level >= 1 ) {
        this.addRebound();
      }
        this.move();
    }
    super.update();
  }

  private move() {
    const mod = this.mod as moduleData;
    mod.x -= mod.speed * this.percent;
    mod.y += mod.speed * this.percent * this.direction;
    this.rebound && this.rebound();
  }

  private addRebound() {
    this.rebound = () => {
      if (this.hasEntered) {
        const mod = this.mod as moduleData;
        if (mod.y + 20 > config.game.h) {
          this.direction = -1;
          return;
        }
        if (mod.y - 20 < 0) {
          this.direction = 1;
        }
      }
    }
  }

  private deathing() {
    const mod = this.mod as moduleData;
    this.deathAnimation.play({
        x: mod.x,
        y: mod.y,
        w: mod.w,
        h : mod.h,
    }, () => {
        this.hasDead = true;
    })
}
}