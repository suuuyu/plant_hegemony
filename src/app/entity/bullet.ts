import Item from './item';
import { config, moduleData } from '../config';
import { Animation} from './animation';
import { Scene } from '../scene/Scene';
import resource from '../util/resource';

export default class Bullet extends Item {
  private deathAnimation: Animation;
  private bulletAnimation: Animation | undefined;
  private speedX: number = 1;
  private speedY: number = 0;

  constructor(scene: Scene) {
    super(scene);
    this.deathAnimation = new Animation(config.bulletDeathAnimation(), scene);
  }

  public load(bulletType: string) {
    super.load(bulletType, this.deathing.bind(this));
  }

  public setImg(img: string) {
    this.img = resource.findImgByKey(img);
    if (img === 'superBullet') {
      this.bulletAnimation = new Animation(config.superBulletAnimation(), this.scene);
    }
  }

  public setDamage(num: number) {
    num > 1? this.life = num : '';
  }

  public setSpeed(x: number, y: number) {
    this.speedX = x;
    this.speedY = y;
  }

  public setPositon(x: number, y: number) {
    const mod = this.mod as moduleData;
    mod.x = x;
    mod.y = y;
  }

  public update() {
    const mod = this.mod as moduleData;
    if (this.run) {
      this.bulletAnimation && this.bulletAnimation.play({
        x: mod.x,
        y: mod.y - 40,
        w: 147,
        h: 87,
     })
      this.move();
    }
    super.update();
  }

  private move() {
    const mod = this.mod as moduleData;
    mod.x += mod.speed * this.speedX;
    mod.y += mod.speed * this.speedY;
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