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
  private unrivaled: boolean = false;
  /** 延迟子弹，在延迟时间内无敌 */
  private lazyBullet: boolean = false;

  constructor(scene: Scene) {
    super(scene);
    this.deathAnimation = new Animation(config.bulletDeathAnimation(), scene);
  }

  public load(bulletType: string) {
    super.load(bulletType, this.deathing.bind(this));
  }

  public setImg(img: string) {
    const mod = this.mod as moduleData;
    if (img === 'superBullet') {
      this.img = null;
      mod.w = 147;
      mod.h = 88;
      this.bulletAnimation = new Animation(config.superBulletAnimation(), this.scene);
    }
    if (img === 'fishBullet') {
      this.img = null;
      mod.w = 93;
      mod.h = 59;
      this.bulletAnimation = new Animation(config.fishBulletAnimation(), this.scene);
    }
    if( img === 'sharkReady') {
      this.img = null;
      mod.w = 417;
      mod.h = 142;
      this.lazyBullet = true;
      this.unrivaled = true;
      this.bulletAnimation = new Animation(config.sharkReadyAnimation(), this.scene);
    }
    if (img === 'boss_bullet') {
      this.img = resource.findImgByKey(img);
      mod.w = 40;
      mod.h = 40;
    }
  }

  public hurt(num: number = 1) {
    if (!this.unrivaled) {
        super.hurt(num);
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
     if(this.lazyBullet && this.unrivaled) {
       // 延迟子弹 // 延迟期，不可移动
       let animation = this.bulletAnimation as Animation;
       // 播放延迟动画
       animation.play({
        x: mod.x,
        y: mod.y,
        w: 570,
        h: 255,
    }, () => {
        this.unrivaled = false;
        this.bulletAnimation = new Animation(config.sharkGoAnimation(), this.scene);
    })
     } else {
      this.bulletAnimation && this.bulletAnimation.play({
        x: mod.x,
        y: mod.y,
        w: mod.w,
        h: mod.h,
      })
       this.move();
     }
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