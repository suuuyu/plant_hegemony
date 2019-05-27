import { moduleData } from '../config';

const util = {
    loadResource(arr: any, Obj: any, callback: Function ) {
        const keys = Object.keys(arr);
        const len = keys.length;
        const result: any = {};
        let count = 0;
        const load = Obj === Image ? 'onload' : 'onloadedmetadata';
        const recall = (obj: any, key: string) => {
            result[key] = obj;
            count++;
            if(count === len) {
                //当所有同类资源加载完毕后调用回调函数
                callback(result);
            }
        };
        keys.map(key => {
            const obj = new Obj();
            obj.src = arr[key];
            obj[load] = () => {
                //为对象设置响应函数，加载完毕自动响应
                recall(obj, key);
            }
        });
    },

    TimeKeeper: (() => {
        let events: tkEvent;
        /**
         * 初始化注册器
         */
        const init = () => {
            //初始化事件统计器
            events = {
                hotkey: undefined,
                play: undefined,
            }
        };

        /**
         * 注册被定时器周期性调用的响应方法
         */
        const register = (id: string, callback: Function) => {
            if(events[id] === undefined) {
                events[id] = callback;
            } else {
                console.error('注册失败，事件已注册')
            }
        };

        /**
         * 移除注册器
         * @param id 
         */
        const removeAt = (id: string) => {
            if(events[id] instanceof Function) {
                events[id] = undefined;
            }
        }
        const begin = () => {
            for(let func of Object.values(events)) {
                if(func !== undefined) {
                    func();
                }
            }
            requestAnimationFrame(begin);
        }
        init();
        begin();
        return {
            init,
            register,
            removeAt
        }
    })(),

    isImage(img: HTMLImageElement | String): boolean {
        return img instanceof Image;
    },

    random(end: number, start: number): number {
        return Math.floor(Math.random() * (end - start)) + start;
    },

    randomArrayItem(array: any[]) {
        return array[this.random(0, array.length)];
    },

    loadImages(images: any, callback: Function) {
        this.loadResource(images, Image, callback);
    },
    
    loadAudios(audios: any, callback: Function) {
        this.loadResource(audios, Audio, callback);
    },

    isCollision(a: moduleData, b: moduleData) {
        return ((a.y > b.y && a.y < b.y + b.h) || (b.y > a.y && b.y < a.y + a.h)) && 
        ((a.x > b.x && a.x < b.x + b.w) || (b.x > a.x && b.x < a.x + a.w))
    }

}

interface tkEvent {
    [key: string]: Function | undefined
}

export default util;
