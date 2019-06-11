import Plane from './plane';
import { Scene } from '../scene/Scene';
import Bullet from './bullet';
import Frequence from '../frequence';
import { moduleData, config } from '../config';
import { hotkey, TkEvent, util } from '../util/util';
import { Animation } from './animation';
import resource from '../util/resource';
import fireStrategy from '../util/strategy';
import Fuel from './fuel';

enum WeapenLevel {
    lv0 = 0,
    lv1 = 1,
    lv2 = 2,
    lv3 = 3,
    lv4 = 4
}
export default class Playerplane extends Plane {

    private moveFrequence: Frequence = new Frequence(1, true);
    private  weapenLevel: WeapenLevel = 0;
    private weapenUpdateAnimation: Animation | undefined;
    private showThunder: boolean = false;
    private thunderAnimation: Animation;
    private controllSpeed: number = 0;
    private canMove: boolean = true;
    constructor(scene: Scene) {
        super(scene);
        this.thunderAnimation = new Animation(config.thunderAnimation(), scene);
    }

    public init(isFriend: boolean = true, bulletArray: Bullet[]) {
        super.init(true, bulletArray);
        super.load('player');
        const mod = this.mod as moduleData;
        this.controllSpeed = mod.speed;
        mod.y = config.game.h / 2;
        this.speedY = 0;
    }

    public update() {
        this.moveFrequence.update().active(() => {
            this.canMove = true;
        });
        const frequence = this.bulletFrequence as Frequence;
        frequence.update().active(() => {
            this.canFire = true;
        })
        if (this.run) {
            // this.fire();
            if (this.canFire) {
                this.canFire = false;
                const fn = fireStrategy[WeapenLevel[this.weapenLevel]];
                fn(this, this.ourBullets, this.scene);
            }
        } else {
            const scene = this.scene as Scene;
            const hook = scene.hook as Function;
            hook();
        }
        super.update();
        const mod = this.mod as moduleData;
        this.weapenUpdateAnimation && this.weapenUpdateAnimation.play({
            x: mod.x - 2 * mod.w,
            y: mod.y - 2.5 * mod.h,
            w: 354,
            h: 465,
        }, () => {
            this.weapenUpdateAnimation = undefined;
            if (this.weapenLevel == 4) {
                this.showThunder = true;
            }
        })
        this.showThunder && this.thunderPlay();
    }

    public hurt(num: number = 1) {
        super.hurt(num);
        if (this.life <= 0) {
            resource.end('bg');
            resource.end('bgFinal');
        }
        this.showThunder = false;
        if (this.weapenLevel > 0) {
            this.weapenLevel --;
        }
    }

    public updateWeapen() {
        this.weapenUpdateAnimation = new Animation(config.weapenUpAnimation(), this.scene);
        this.weapenLevel ++;
        if(this.weapenLevel > 4) {
            this.weapenLevel = 4;
        }
    }
    private thunderPlay() {
        console.log(11111111111111);
        const mod = this.mod as moduleData;
        this.thunderAnimation.play({
            x: mod.x - 2 * mod.w,
            y: mod.y - 2.5 * mod.h,
            w: 354,
            h: 465,
        })
    }

    /**生命增加 */
    public getHelp(help: Fuel) {
        if (help.type === 0) {
            this.updateWeapen();
        } else if (help.type === 1) {
            this.life += config.game.addFuel;
            this.life = this.life > config.data().maxLife ? config.data().maxLife : this.life
        }
        
        /** */
    }

    public bindMoveEvent(dom: HTMLElement) {
        const mod = this.mod as moduleData;
        dom.addEventListener('mousedown', (ev: MouseEvent) => {
            let oldX = ev.offsetX;
            let oldY = ev.offsetY;
            const oldPlaneX = mod.x;
            const oldPlaneY = mod.y;
            const func = (ev: MouseEvent) => {
                const newmod = this.mod as moduleData;
                newmod.x = oldPlaneX + ev.offsetX - oldX;
                newmod.y = oldPlaneY + ev.offsetY - oldY;
            };
            const func2 = () => {
                dom.removeEventListener('mousemove', func);
            };
            dom.addEventListener('mousemove', func);
            dom.addEventListener('mouseup', func2);
        });
        dom.addEventListener('touchstart', (ev: TouchEvent) => {
            let oldX = ev.touches[0].clientX;
            let oldY = ev.touches[0].clientY;
            const oldPlaneX = mod.x;
            const oldPlaneY = mod.y;
            const func = (ev: TouchEvent) => {
                const newmod = this.mod as moduleData;
                newmod.x = oldPlaneX + ev.touches[0].clientX - oldX;
                newmod.y = oldPlaneY + ev.touches[0].clientY - oldY;
            };
            dom.addEventListener('touchmove', func);
        });
        this.addControllEvent();
    }

    private skill1() {
        if (this.life > config.data().maxLife / 2) {
            const mod = this.mod as moduleData;
            const life = this.life / 2;
            this.life = life;
            for(let i=0; i<3; i++) {
                this.scene.controller.addFriend(mod.x, life / 2);
            }
        }
    }

    private sharkFire() {
        if (this.scene.controller.data.fuel >= 25) {
            const fn = fireStrategy['shark'];
            fn(this, this.ourBullets, this.scene);
            this.scene.controller.data.fuel = 0;
        }
    }


    up() {
        const mod = this.mod as moduleData;
        if (mod.y <= 0) return;
        mod.y -= this.controllSpeed;
    }
    left() {
        const mod = this.mod as moduleData;
        if (mod.x <= 0) return;
        mod.x-=this.controllSpeed;
    }
    right() {
        const mod = this.mod as moduleData;
        if (mod.x+mod.w >= config.game.w) return;
        mod.x += this.controllSpeed;
    }
    down() {
        const mod = this.mod as moduleData;
        if (mod.y+mod.h >= config.game.h) return;
        mod.y += this.controllSpeed;
    }

    public addControllEvent() {
        const keys: TkEvent = {
            'w': this.up.bind(this),
            'a': this.left.bind(this),
            's': this.down.bind(this),
            'd': this.right.bind(this),
        };
        Object.keys(keys).map((key) => {
            hotkey.register(key, () => {
               const func = keys[key] as Function;
               func();
            }); 
        });
        
        hotkey.register(' ', () => {
            this.skill1();
        }, true);

        hotkey.register('g', () => {
            this.sharkFire();
        }, true);

    }
    
}