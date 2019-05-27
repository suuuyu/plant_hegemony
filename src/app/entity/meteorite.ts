import Item from "./item";
import { moduleData, config } from '../config';
import util from '../util/util';
import { Scene } from '../scene/Scene';
import { Animation} from './animation';

export default class Meteorite extends Item {

  private deathAnimation: Animation;
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
        this.move();
    }
    super.update();
  }

  private move() {
    const mod = this.mod as moduleData;
    mod.x -= mod.speed;
    mod.y += mod.speed;
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