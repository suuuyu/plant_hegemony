import Plane from "../entity/plane";
import { moduleData, config } from '../config';
import Bullet from '../entity/bullet';
import { Scene } from '../scene/Scene';
import Boss from '../entity/boss';
import { Animation } from '@/app/entity/animation'

interface Strategy {
    [key: string]: (plane: Plane | Boss, bullets: Bullet[], scene: Scene) => void;
}
const fireStrategy: Strategy = {
    lv0: function(plane: Plane | Boss, bullets: Bullet[], scene: Scene) {
        const mod = plane.mod as moduleData;
        let newBullet = getBullet(mod.x, mod.y + mod.h / 2, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene);
        bullets.push(newBullet);
    },
    lv1: function(plane: Plane | Boss, bullets: Bullet[], scene: Scene) {
        const mod = plane.mod as moduleData;
        let newLeftBullet = getBullet(mod.x, mod.y + mod.h / 3, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene);
        let newRightBullet = getBullet(mod.x, mod.y + mod.h * 2 / 3, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene);
        bullets.push(newLeftBullet, newRightBullet);
    },
    lv2: function(plane: Plane | Boss, bullets: Bullet[], scene: Scene) {
        const mod = plane.mod as moduleData;
        let newLeftBullet = getBullet(mod.x, mod.y, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 1, -0.1 );
        let newBullet = getBullet(mod.x, mod.y + mod.h / 2, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene);
        let newRightBullet = getBullet(mod.x, mod.y + mod.h, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 1, 0.1);
        bullets.push(newLeftBullet, newRightBullet, newBullet);
    },
    lv3: function(plane: Plane | Boss, bullets: Bullet[], scene: Scene) {
        const mod = plane.mod as moduleData;
        let newLeftBullet = getBullet(mod.x, mod.y, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 0.8, -0.1 );
        let newMid1Bullet = getBullet(mod.x, mod.y + mod.h / 3, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene);
        let newMid2Bullet = getBullet(mod.x, mod.y + mod.h * 2 / 3, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene);
        let newRightBullet = getBullet(mod.x, mod.y + mod.h, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 0.8, 0.1);
        bullets.push(newLeftBullet, newRightBullet, newMid1Bullet, newMid2Bullet);
    },
    lv4: function(plane: Plane | Boss, bullets: Bullet[], scene: Scene) {
        const mod = plane.mod as moduleData;
        let newLeftBullet = getBullet(mod.x, mod.y, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 0.8, -0.1 );
        let newMid2Bullet = getBullet(mod.x, mod.y, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 1.1, 0, 2, 'superBullet');
        let newRightBullet = getBullet(mod.x, mod.y + mod.h, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 0.8, 0.1);
        bullets.push(newLeftBullet, newRightBullet, newMid2Bullet);
    },
    lv6: function(plane: Plane | Boss, bullets: Bullet[], scene: Scene) {
        const mod = plane.mod as moduleData;
        let newLeftBullet = getBullet(mod.x, mod.y, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 0.8, -0.1, 2, 'boss_bullet' );
        let newMid1Bullet = getBullet(mod.x, mod.y + mod.h / 3, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 1.1,0,2, 'boss_bullet');
        let newMid2Bullet = getBullet(mod.x, mod.y + mod.h / 2, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 2, 0, 5, 'fishBullet');
        let newMid3Bullet = getBullet(mod.x, mod.y + mod.h * 2 / 3, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 1.1,0,2, 'boss_bullet');
        let newRightBullet = getBullet(mod.x, mod.y + mod.h, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 0.8, 0.1, 2, 'boss_bullet');
        bullets.push(newLeftBullet, newRightBullet, newMid2Bullet, newMid1Bullet, newMid3Bullet);
    },
    lv5: function(plane: Plane | Boss, bullets: Bullet[], scene: Scene) {
        const mod = plane.mod as moduleData;
        let newLeftBullet = getBullet(mod.x, mod.y, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 0.8, -0.1 );
        let newMid2Bullet = getBullet(mod.x, mod.y + mod.h / 2, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 1.1, 0, 2, 'fishBullet');
        let newRightBullet = getBullet(mod.x, mod.y + mod.h, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 0.8, 0.1);
        bullets.push(newLeftBullet, newRightBullet, newMid2Bullet);
    },
    shark: function(plane: Plane | Boss, bullets: Bullet[], scene: Scene) {
        const mod = plane.mod as moduleData;
        let newLeftBullet = getBullet(mod.x - 2 * mod.w, config.game.h * 0.25 - mod.h, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 2, 0, 10, 'sharkReady' );
        let newMid2Bullet = getBullet(mod.x - 2 * mod.w, config.game.h * 0.5 - mod.h, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 2, 0, 10, 'sharkReady');
        let newRightBullet = getBullet(mod.x - 2 * mod.w, config.game.h * 0.75 - mod.h, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 2, 0, 10, 'sharkReady');
        bullets.push(newLeftBullet, newMid2Bullet, newRightBullet);
    }
}

function getBullet(x: number, y: number, loadType: string, scene: Scene, 
    speedX?: number, speedY?: number, damage?: number, img?: string) {
    const bullet = new Bullet(scene);
    bullet.load(loadType);
    bullet.setPositon(x, y);
    img && bullet.setImg(img);
    damage && bullet.setDamage(damage);
    speedY && speedX && bullet.setSpeed(speedX, speedY);
    return bullet;
}

export default fireStrategy;