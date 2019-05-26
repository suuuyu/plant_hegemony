import {Scene} from '../scene/Scene';
import {config, moduleData} from '../config';
import resource from '../util/resource';
import util from '../util/util';
import {Animation} from './animation';
/**
 * 飞行元素的父类，定义了一些基本的行为
 */
export default class Item {
    protected scene: Scene;
    protected run: boolean = true;
    public hasDead: boolean = false;
    public deadFunc: Function | undefined = undefined; //死亡动画
    protected life: number = 1;
    protected rotateState: boolean = false; // 是否旋转
    protected rotateSpeed: number = 2; // 旋转速度
    private deg: number = 0; //旋转角度报错
    protected runAnimation: Animation | null = null;
    protected img: HTMLImageElement | null = null;
    public mod: moduleData | undefined = undefined;
    private hasEntered: boolean = false;

    constructor( scene: Scene) {
        this.scene = scene;
    }

    /**
     * 
     * @param moduleKey (具体装载种类的名称)
     * @param meth 装载死亡动画（如果有的话)
     */
    public load(moduleKey: string, func: Function | undefined = undefined) {
        this.deadFunc = func;
        // 根据相应的modeleKey找到对应的模板
        this.mod = config.module[moduleKey];
        const mod = this.mod;
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

    public update() {
        this.run? this.draw() : this.dead(this.deadFunc);
        this.isFarAway();
    }
    /**
     * 受撞击，生命值减少，如果生命值为0就不能动弹
     */
    public hurt() {
        if( -- this.life <= 0) {
            this.run = false;
        }
    }

    /**
     * 元素绘图
     */
    private draw() {
        // 绘制元素动画
        if (this.rotateState) {
            //绘制旋转图
            return this.rotate();
        }
        if (this.runAnimation){
            const mod = <moduleData>this.mod;
            return this.runAnimation.play({
                x: <number>mod.x,
                y: <number>mod.y,
                w: <number>mod.w,
                h : <number>mod.h,
            });
        }
        this.scene.draw(this.getDrawInfo());
    }

    /**
     * 得到绘图信息
     * @param isRotate 
     */
    public getDrawInfo(isRotate=false) {
        const mod = <moduleData> this.mod;
        return [
            this.img,
            isRotate ? - <number> mod.w / 2 : mod.x,
            isRotate ? - <number> mod.h / 2 : mod.y,
            mod.w,
            mod.h,
        ];
    }

    /**
     * 旋转绘图
     */
    private rotate() {
        const mod = <moduleData>this.mod;
        this.deg+=this.rotateSpeed;
        this.scene.rotateDraw({
            deg: this.deg,
            x: <number> mod.x + <number> mod.w / 2,
            y: <number> mod.y + <number> mod.h / 2,
            data: this.getDrawInfo(true),
        })
    }

    /**
     * 元素死亡 如过要求死亡之后有后续操作可以传入回调函数
     * @param callback 
     */
    private dead( callback: undefined | Function = undefined) {
        if(callback !== undefined) {
            callback();
        } else {
            this.hasDead = true;
        }
    }

    /**
     * 超出边界的元素自动死亡
     */
    private isFarAway() {
        if(this.isEnter()) {
            //进入荧幕区，标记进入
            this.hasEntered = true;
        } else {
            //不在荧幕区，检测是否已标记过进入
            if(this.hasEntered) {
                if(this.isOut()) {
                    //检测是否完全超出荧幕
                    this.hasDead = true;
                }
            }
        }
    }

    private isEnter() {
        const { w, h } = config.game;
        const mod = <moduleData>this.mod;
        return (
            <number> mod.x > 0 &&
            <number> mod.y > 0 &&
            <number> mod.x < w &&
            <number> mod.y < h
        );
    }

    private isOut() {
        const { w, h } = config.game;
        const mod = <moduleData>this.mod;
        return (
            <number> mod.x < -<number> mod.w ||
            <number> mod.y < -<number> mod.h ||
            <number> mod.x > w ||
            <number> mod.y > h
        );
    }
}