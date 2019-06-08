import { animationInterface } from './entity/animation';

/**
 * 
 * 配置文件
 */
const fps = 60;
const width = 1440;
const height = 700;
/**
 * 定义飞机，行星，陨石等模板类
 */
interface moduleData {
    w: number;
    h: number;
    x: number;
    y: number;
    img: string | string[];
    speed: number;
    bulletFrequence?: number;
    animation?: animationInterface;
    life?:number;
}

interface Imodules {
    [key: string]: moduleData
}

const player: moduleData = (() => {
    //玩家设置
    let o = plane();
    o.speed = 3;
    o.y = height / 2 - o.y / 2;
    o.bulletFrequence = 0.5 * fps;
    return  Object.assign(o, {
        life: 10
    })
})();

const enemy: moduleData = (() => {
    //敌人设置
    let o = plane();
    o.x = width + o.w;
    o.speed = -3;
    o.img = 'enemy';
    return  Object.assign(o, {
        life: 5
    })
})();

const friend: moduleData = (() => {
    //友军设置
    let o = plane();
    o.x = 0;
    o.speed = 3;
    // o.img = 'friend';
    return  Object.assign(o, {
        life: 5
    })
})();

const meteorite: moduleData = (() => {
    //陨石
    let o = plane();
    o.w = 85;
    o.h = 85;
    o.speed = 3;
    return Object.assign(
        o,
        {
            img: batchImport('meteorites_', 4),
            life: 8
        }
    )
})();

const fuel: moduleData = {
    //燃料设置
    w: 40,
    h: 40,
    x: 0,
    y: -40,
    speed: -1, 
    img: 'fuel',
};

const playerBullet: moduleData = (() => {
    //我方子弹
    let o = bullet();
    o.img = 'playerBullet';
    return o;
})();

const enemyBullet: moduleData = (() => {
    //敌军子弹
    let o = bullet();
    o.speed = -o.speed;
    o.img = 'enemyBullet';
    return o;
} )();

const planet: moduleData = {
    //行星
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    speed: 0,
    img: batchImport('star_', 12)
};

const modeles: Imodules = {
    'player': player,
    'enemy': enemy,
    'friend': friend,
    'meteorite': meteorite,
    'fuel': fuel,
    'playerBullet': playerBullet,
    'enemyBullet': enemyBullet,
    'planet': planet
}

const config = {

    data() {
        //初始数据
        return {
            fuel: 15,
            score: 0,
            shoot: 0,
            time : 0,
            name : '',
            maxLife: 25,
        }
    },
    game: {
        w: width,
        h: height,
        fontSize : 16,
        fps: fps,
        addFuel: 3,
        // 元素的添加频率
        appendEnemyFrequence: [2 * fps, 5 * fps],
        // appendFriendFrequence : [2 * fps, 5 * fps],
        appendFriendFrequence : 600000,
        appendFuelFrequence : [2 * fps, 5 * fps],
        appendPlanetFrequence : [1 * fps, 2 * fps],
        fireFrequence: 0.1 * fps
    },

    module: modeles,

    planeDeathAnimation(): animationInterface {
        //飞行器动画
        return {
            img: 'boom',
            loop : false,
            row: 4,
            col: 4,
            frequence: 0.05 * fps,
        }
    },

    bulletDeathAnimation(): animationInterface {
        //子弹动画
        return {
            img: 'boom',
            loop : false,
            row: 4,
            col: 4,
            frequence: 0.01 * fps,
        }
    },


    images: (() => {
        const path = '/img/';
        let images = {
            boom: path + 'boom.png',
            player: path + 'plane/player.png',
            friend: path + 'plane/friend.png',
            enemy: path + 'plane/enemy.png',
            playerBullet: path + 'playerBullet.png',
            enemyBullet: path + 'enemyBullet.png',
            fuel: path + 'fuel2.png',
            background: path + 'background-1.jpg'
        };
        return Object.assign(
            batchAdd(path+'/star/', 'star_', 12, 'png'),
            batchAdd(path+'/meteorites/', 'meteorites_', 4, 'png'),
            images,
        )

    })(),

    audios: (()=>{
        const path = '/sound/';
        return {
            bg : path + 'background.mp3',
            destroyed : path + 'destroyed.mp3',
            shoot : path + 'shoot.mp3',
        }
    })(),

};

function bullet() {
    return {
        // 子弹设置
        w: 20,
        h: 10,
        x: 0,
        y: 0,
        speed : 6,
        img: ''
    }
}

function plane() {
    // 飞机配置
    return {
        w: 70,
        h: 70,
        x: 0,
        y: 0,
        img : 'player',
        speed: 4,
        bulletFrequence : fps,
        animation: planeAnimation(),
    }
}

function planeAnimation(): animationInterface {
    //飞机动画
    return {
        loop : true,
        col : 1,
        row : 4,
        frequence : 0.1 * fps,
        img: ''
    }
}

function batchAdd(url: string, name: string, count: number, ext: string) {
    //批量生成图片
    let images: any = {};
    for (let i = 1; i <= count; i++){
        images[name + i] = url + name + i +'.'+ ext;
    }
    return images;
}

function batchImport(name: string, count: number): string[] {
    //生成图片数组
    let images: string[] = [];
    for (let i = 1; i <= count; i++){
        images.push(name + i);
    }
    return images;
};


export { config, moduleData};
