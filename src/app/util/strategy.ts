import Plane from "../entity/plane";
import { moduleData } from '../config';
import Bullet from '../entity/bullet';
import { Scene } from '../scene/Scene';

interface Strategy {
    [key: string]: (plane: Plane, bullets: Bullet[], scene: Scene) => void;
}
const fireStrategy: Strategy = {
    lv0: function(plane: Plane, bullets: Bullet[], scene: Scene) {
        const mod = plane.mod as moduleData;
        let newBullet = getBullet(mod.x, mod.y + mod.h / 2, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene);
        bullets.push(newBullet);
    },
    lv1: function(plane: Plane, bullets: Bullet[], scene: Scene) {
        const mod = plane.mod as moduleData;
        let newLeftBullet = getBullet(mod.x, mod.y + mod.h / 3, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene);
        let newRightBullet = getBullet(mod.x, mod.y + mod.h * 2 / 3, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene);
        bullets.push(newLeftBullet, newRightBullet);
    },
    lv2: function(plane: Plane, bullets: Bullet[], scene: Scene) {
        const mod = plane.mod as moduleData;
        let newLeftBullet = getBullet(mod.x, mod.y, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 1, -0.1 );
        let newBullet = getBullet(mod.x, mod.y + mod.h / 2, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene);
        let newRightBullet = getBullet(mod.x, mod.y + mod.h, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 1, 0.1);
        bullets.push(newLeftBullet, newRightBullet, newBullet);
    },
    lv3: function(plane: Plane, bullets: Bullet[], scene: Scene) {
        const mod = plane.mod as moduleData;
        let newLeftBullet = getBullet(mod.x, mod.y, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 0.8, -0.1 );
        let newMid1Bullet = getBullet(mod.x, mod.y + mod.h / 3, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene);
        let newMid2Bullet = getBullet(mod.x, mod.y + mod.h * 2 / 3, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene);
        let newRightBullet = getBullet(mod.x, mod.y + mod.h, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 0.8, 0.1);
        bullets.push(newLeftBullet, newRightBullet, newMid1Bullet, newMid2Bullet);
    },
    lv4: function(plane: Plane, bullets: Bullet[], scene: Scene) {
        const mod = plane.mod as moduleData;
        let newLeftBullet = getBullet(mod.x, mod.y, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 0.8, -0.1 );
        let newMid2Bullet = getBullet(mod.x, mod.y + mod.h / 2, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 1.1, 0, 2, 'superBullet');
        let newRightBullet = getBullet(mod.x, mod.y + mod.h, plane.isFriend ? 'playerBullet' : 'enemyBullet', scene, 0.8, 0.1);
        bullets.push(newLeftBullet, newRightBullet, newMid2Bullet);
    },
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