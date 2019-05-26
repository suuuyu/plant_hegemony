import Item from './item';
import { Scene } from '../scene/Scene';
import { moduleData, config } from '../config';
import { Animation} from './animation';
import Frequence from '../frequence';

export default class plane extends Item {
    /**
     * 死亡动画
     */
    private deathAnimation: Animation;
    /**
     * 射击频率
     */
    private bulletFrequence: Frequence | undefined;

    public canFire: boolean = true;

    constructor(scene: Scene) {
        super(scene);
        this.deathAnimation = new Animation(config.planeDeathAnimation(), scene);
    }

    public update() {
        super.update();
        const frequence = this.bulletFrequence as Frequence;
        frequence.update().active(() => {
            this.canFire = true;
        })
    }

    public move() {
        const mod = this.mod as moduleData;
        mod.x = <number> mod.x + <number> mod.speed;
    }

    public load(moduleKey: string) {
        const mod = this.mod as moduleData;
        super.load(moduleKey, this.deathing.bind(this));
        this.bulletFrequence = new Frequence(mod.bulletFrequence as number);
    }

    private deathing() {
        const mod = this.mod as moduleData;
        const animation =  this.deathAnimation.play({
            x: mod.x as number,
            y: mod.y as number,
            w: mod.w as number,
            h : mod.h as number,
        }) as Animation 
        animation.end(() => {
            this.hasDead = true;
        });
    }
}