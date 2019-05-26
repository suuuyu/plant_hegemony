/**
 * 动画管理
 */

import resource from '../util/resource';
import {Scene} from '../scene/Scene';
import util from '../util/util';
import Frequence from '../frequence';

interface animationInterface {
    img: string | HTMLImageElement;
    loop: boolean;
    row: number;
    col: number;
    frequence: number | number[];
}

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
    private index: number;
    private len: number;
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

    play(info: animationInfo) {
        if (this.isEnd) return this;
        this.draw(info);
        this.frequence.update().active(() => {
            this.index++;
        });
        if (this.loop){
            if (this.index === this.len){
                this.index = 0;
            }
        } else{
            return this;
        }
    }

    getPos() {
        return {
            x: this.index % this.row,
            y : Math.floor(this.index / this.row),
        }
    }

    draw(info: animationInfo) {
        var pos = this.getPos();
        var x = pos.x * this.w;
        var y = pos.y * this.h;
        this.scene.draw([
            this.img,
            x,y,this.w,this.h,info.x,info.y,info.w,info.h,
        ]);
    }

    end(callback: Function) {
        if (this.index === this.len) {
            this.isEnd = true;
            callback();
        }
    }
}

export { Animation, animationInterface }