import Plane from './plane';
import { Scene } from '../scene/Scene';
import Bullet from './bullet';
import Frequence from '../frequence';
import { moduleData, config } from '../config';
import { hotkey, TkEvent } from '../util/util';

export default class Playerplane extends Plane {

    private moveFrequence: Frequence = new Frequence(1, true);
    private controllSpeed: number = 0;
    private canMove: boolean = true;
    constructor(scene: Scene) {
        super(scene);
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
            this.fire();
        } else {
            const scene = this.scene as Scene;
            const hook = scene.hook as Function;
            hook();
        }
        super.update();
    }

    /**生命增加 */
    public moreLife(num: number) {
        this.life += num;
        this.life = this.life > config.data().maxLife ? config.data().maxLife : this.life
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
        console.log('     ')
        const mod = this.mod as moduleData;
        const life = this.life / 2;
        this.life = life;
        for(let i=0; i<3; i++) {
            this.scene.controller.addFriend(mod.x, life / 2);
        }
    }


    up() {
        const mod = this.mod as moduleData;
        if (mod.y <= 0) return;
        console.log(mod.speed)
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
            if (this.life > config.data().maxLife / 2) {
                console.log(this.life + ' ' + config.data().maxLife / 2);
                this.skill1();
            }
        }, true);
    }
    
}