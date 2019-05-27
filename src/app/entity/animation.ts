/**
 * 动画管理
 */

import resource from '../util/resource';
import {Scene} from '../scene/Scene';
import util from '../util/util';
import Frequence from '../frequence';

/**
 * @img： 图片资源
 * @loop： 图片是否循环切换
 * @row： 图片组的行数
 * @col：图片组的列数
 * @frequence： 图片切换的频率
 */
interface animationInterface {
    img: string | HTMLImageElement;
    loop: boolean;
    row: number;
    col: number;
    frequence: number | number[];
}

/** 图片播放的位置 */
interface animationInfo {
    x: number;
    y: number;
    w: number;
    h: number;
}

 class Animation{
    private img: HTMLImageElement;
    private col: number;
    private row: number;
    private loop: boolean;
    private w: number;
    private h: number;
    private index: number; //记录当前动画是第几帧
    private len: number; // 记录动画图片共多少帧
    private isEnd: boolean;
    private scene: Scene;
    private frequence: Frequence;

    constructor(data: animationInterface, scene: Scene) {
        this.img = util.isImage(data.img) ? <HTMLImageElement>data.img : resource.findImgByKey(<string>data.img);
        this.frequence = new Frequence(data.frequence);
        this.col = data.col;
        this.row = data.row;
        this.loop = data.loop;
        this.w = this.img.width / this.row;
        this.h = this.img.height / this.col;
        this.index = 0;
        this.len = this.row * this.col;
        this.isEnd = false;
        this.scene = scene;
    }

    /**播放动画， 动画播放完毕会调用回调函数 */
    public play(info: animationInfo, callback: Function | undefined = undefined) {
        if (this.isEnd) {
            callback && callback();
            return;
        }
        this.draw(info);
        this.frequence.update().active(() => {
            this.index++;
        });
        if (this.index === this.len){
            if (this.loop) {
                this.index = 0;
            } else {
                this.isEnd = true
            }
        }
    }

    private getPos() {
        return {
            x: this.index % this.row,
            y : Math.floor(this.index / this.row),
        }
    }

    private draw(info: animationInfo) {
        var pos = this.getPos();
        var x = pos.x * this.w;
        var y = pos.y * this.h;
        this.scene.draw([
            this.img,
            x,y,this.w,this.h,info.x,info.y,info.w,info.h,
        ]);
    }
}

export { Animation, animationInterface }