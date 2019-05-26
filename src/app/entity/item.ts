import {Scene} from '../scene/Scene';
import { animationInterface } from './animation';
import config from '../config';
import resource from '../util/resource';
import util from '../util/util';
import {Animation} from './animation';
/**
 * 飞行元素的父类，定义了一些基本的行为
 */
export default class Item {
    private scene: Scene;
    private run: boolean;
    private enter: boolean;
    private dead: false;
    private life: number;
    private rotateState: boolean; // 是否旋转
    private rotateSpeed: number; // 旋转速度
    private runAnimation: Animation | null;
    private img: HTMLImageElement | null;

    constructor( scene: Scene) {
        this.scene = scene;
        this.run = true;
        this.enter = false;
        this.dead = false;
        this.life = 1;
        this.rotateState = false;
        this.rotateSpeed = 2;
        this.runAnimation = null;
        this.img = null;
    }

    public load(moduleKey: string) {
        // 找到对应的模板
        const mod = config.module[moduleKey];
        Object.keys(mod).map(key => {
            //遍历模板
            if(key === 'img' && mod.img !== undefined) {
                if( mod.img instanceof Array) {
                    this.img = resource.findImgByKey(util.randomArrayItem(mod.img));
                } else {
                    this.img = resource.findImgByKey(mod.img);
                }
            }
            
            if(key === 'animation' && mod.animation !== undefined) {
                let animation = mod.animation;
                animation = Object.assign( animation, {
                    img: this.img
                })
                this.runAnimation = new Animation(animation, this.scene);
            }

            if(key === 'life' && mod.life !== undefined) {
                this.life = mod.life;
            }
        });
    }
}