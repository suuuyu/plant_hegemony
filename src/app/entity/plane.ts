import Item from './item';
import { Scene } from '../scene/Scene';
import { moduleData, config } from '../config';
import { Animation} from './animation';
import Frequence from '../frequence';
import Bullet from './bullet';
import util from '../util/util';

/**
 * 飞船类
 * @ 请务必按照new -> init -> load的方式完成加载
 */
export default class Plane extends Item {
    /**
     * 死亡动画
     */
    private deathAnimation: Animation;
    /**
     * 射击频率
     */
    protected bulletFrequence: Frequence | undefined;

    /** 同阵营的子弹数组 */
    private ourBullets: Bullet[] = [];

    public canFire: boolean = true;

    private isFriend: boolean = true;

    public speedY: number = 0;

    /**
     * 
     * @param scene 场景实例
     * @param isFriend 判断新建的飞机对象是友军还是敌军
     * @param bulletArray 我方的子弹数组
     */
    constructor(scene: Scene) {
        super(scene);
        this.deathAnimation = new Animation(config.planeDeathAnimation(), scene);
    }

    public init(isFriend: boolean, bulletArray: Bullet[]) {
        this.isFriend = isFriend;
        this.speedY = isFriend ? 2: 0;
        this.ourBullets = bulletArray;
    }
    /**
     * 装载新建的飞船对象
     * @param moduleKey 新建飞船的关键字：可选 friend or enemy
     */
    public load(moduleKey: string) {
        const { w, h } = config.game;
        super.load(moduleKey, this.deathing.bind(this));
        const mod = this.mod as moduleData;
        mod.y = this.isFriend ? h / 2 : util.random(0, h - mod.h);
        this.bulletFrequence = new Frequence(mod.bulletFrequence as number);
    }

    public update() {
        const frequence = this.bulletFrequence as Frequence;
        frequence.update().active(() => {
            this.canFire = true;
        })
        if (this.run) {
            this.move();
            if (this.isEnter()) {
                this.fire();
            }
        }
        super.update();
    }

    public fire() {
        if (!this.canFire) return;
        this.canFire = false;
        const bullet = new Bullet(this.scene);
        const mod = this.mod as moduleData;
        bullet.load(this.isFriend ? 'playerBullet' : 'enemyBullet');
        bullet.setPositon(mod.x, mod.y + mod.h / 2);
        this.ourBullets.push(bullet);
    }

    private move() {
        const mod = this.mod as moduleData;
        if (this.isFriend) {
            if (mod.x >= config.game.w / 10) {
                mod.speed = 0;
            }
            if (mod.y > config.game.h * 4 / 5) {
                this.speedY = - this.speedY
            }
            if (mod.y < config.game.h / 5) {
                this.speedY = - this.speedY
            }
        }
        mod.x += mod.speed;
        mod.y += this.speedY;
    }

    protected deathing() {
        const mod = this.mod as moduleData;
        this.deathAnimation.play({
            x: mod.x,
            y: mod.y,
            w: mod.w,
            h : mod.h,
        }, () => {
            this.hasDead = true;
        });
    }
}
