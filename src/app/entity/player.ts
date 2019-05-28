import Plane from './plane';
import { Scene } from '../scene/Scene';
import Bullet from './bullet';
import Frequence from '../frequence';
import { moduleData, config } from '../config';

export default class Playerplane extends Plane {

    private controlSpeed: number = 0;
    private moveFrequence: Frequence = new Frequence(1, true);
    private canMove: boolean = true;
    constructor(scene: Scene) {
        super(scene);
    }

    public init(isFriend: boolean = true, bulletArray: Bullet[]) {
        super.init(true, bulletArray);
        super.load('player');
        this.speedY = 0;
        const mod = this.mod as moduleData;
        mod.y = config.game.h / 2;
        this.controlSpeed = mod.speed;
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
        }
        super.update();
    }

    public controlMove(x: number, y: number) {
        if (this.canMove) {
            this.canMove = false;
            const mod = this.mod as moduleData;
            const offsetX = x - mod.x - mod.w / 2;
            const offsetY = y - mod.y - mod.h / 2;
            if (Math.abs(offsetX) < 10 && Math.abs(offsetY) < 10) return;
            const z = Math.sqrt( offsetX * offsetX + offsetY *offsetY);
            mod.x += this.controlSpeed * offsetX / z;
            mod.y += this.controlSpeed * offsetY / z;
        }
    }
}