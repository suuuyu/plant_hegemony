import Item from './item';
import { Scene } from '@/app/scene/Scene';
import Frequence from '../frequence';
import Bullet from './bullet';
import { Animation} from './animation';
import { config, moduleData } from '../config';
import resource from '../util/resource';
import fireStrategy from '../util/strategy';


interface bossImg {
    show: boolean;
    img: HTMLImageElement;
}

export default class Boss extends Item {
    /**
     * 死亡动画
     */
    private deathAnimation: Animation;
    /**
     * 射击频率
     */
    protected bulletFrequence: Frequence | undefined;

    /** 同阵营的子弹数组 */
    protected ourBullets: Bullet[] = [];

    public canFire: boolean = true;

    public isFriend: boolean = true;
    public speedY: number = 1;
    public speedX: number = -1;
    private unrivaled: boolean = true;
    private lockImg: boolean = false;
    /**Img[0]: boss, Img[1]: boss_angry, Img[2]: boss_hurt */
    private Img: bossImg[] = [{
        show: false,
        img: resource.findImgByKey('boss')
    }, {
        show: false,
        img: resource.findImgByKey('boss_angry')
    }, {
        show: false,
        img: resource.findImgByKey('boss_hurt')
    }];

    

    constructor(scene: Scene) {
        super(scene);
        this.deathAnimation = new Animation(config.bossDeathAnimation(), scene);
    }

    public init(isFriend: boolean, bulletArray: Bullet[]) {
        this.isFriend = isFriend;
        this.ourBullets = bulletArray;
    }

    public load() {
        const { w, h } = config.game;
        super.load('boss', this.deathing.bind(this));
        const mod = this.mod as moduleData;
        this.bulletFrequence = new Frequence(mod.bulletFrequence as number);
    }

    public update() {
        const mod = this.mod as moduleData;
        const frequence = this.bulletFrequence as Frequence;
        frequence.update().active(() => {
            this.canFire = true;
        })
        if (mod.x + mod.w <= config.game.w) {
            this.fire();
            this.stageA();
        }
        if (mod.life && this.life < mod.life * 0.5 ) {
            this.stageB();
        }
        if (this.run) {
            this.move();
        }
        super.update();
    }

    private fire() {
        if (this.canFire) {
            this.canFire = false;
            const fn = fireStrategy[this.Img[1].show?'lv6':'lv5'];
            fn(this, this.ourBullets, this.scene);
        }
    }

    private stageA() {
        this.showImg(0);
        resource.end('bg');
        resource.play('bgFinal', true);
        this.unrivaled = false;
    }

    private stageB() {
        this.showImg(1);
    }

    private move() {
        const mod = this.mod as moduleData;
        if(mod.x + mod.w > config.game.w) {
            // 到达右边界
            this.speedX = Math.abs(this.speedX) * -1;
        }
        if(mod.x < config.game.w / 2) {
            // 到达左边界
            this.speedX = Math.abs(this.speedX);
        }
        if(mod.y <= 5) {
            //到达上边界
            this.speedY = Math.abs(this.speedY);
        }
        if (mod.y + mod.h > config.game.h) {
            // 下边界
            this.speedY = Math.abs(this.speedY) * -1;
        }
        mod.x += mod.speed * this.speedX;
        this.Img[0].show? mod.y += mod.speed * this.speedY:'';
        
    }

    public hurt(num: number = 1) {
        if (!this.unrivaled) {
            super.hurt(num);
            if (!this.lockImg) {
                this.lockImg = true;
                this.img = this.Img[2].img;
                setTimeout(() => {
                    this.lockImg = false;
                }, 500);
            }
        }
        console.log(this.life);
    }

    private showImg(index: number) {
        if (!this.lockImg) {
            this.Img[index].show = true;
            this.img = this.Img[index].img;
        } else {
            if (!this.Img[index].show) {
                this.Img[index].show = true;
                this.img = this.Img[index].img;
            }
        }
    }


    private deathing() {
        const mod = this.mod as moduleData;
        this.deathAnimation.play({
            x: mod.x,
            y: mod.y + 30,
            w: 250,
            h : 250,
        }, () => {
          this.hasDead = true;
        })
      }
}