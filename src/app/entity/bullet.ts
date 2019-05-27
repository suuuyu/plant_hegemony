import Item from './item';
import { config, moduleData } from '../config';
import { Animation} from './animation';
import { Scene } from '../scene/Scene';

export default class Bullet extends Item {
  private deathAnimation: Animation;

  constructor(scene: Scene) {
    super(scene);
    this.deathAnimation = new Animation(config.bulletDeathAnimation(), scene);
  }

  public load(bulletType: string) {
    super.load(bulletType, this.deathing.bind(this));
  }

  public setPositon(x: number, y: number) {
    const mod = this.mod as moduleData;
    mod.x = x;
    mod.y = y;
  }

  public update() {
      if (this.run) {
          this.move();
      }
      super.update();
  }

  private move() {
    const mod = this.mod as moduleData;
    mod.x += mod.speed;
  }

  private deathing() {
    const mod = this.mod as moduleData;
    this.deathAnimation.play({
        x: mod.x,
        y: mod.y,
        w: mod.w,
        h : mod.h * 1.5,
    }, () => {
      this.hasDead = true;
  })
  }
}