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
                // 当所有同类资源加载完毕后调用回调函数
                callback(result);
            }
        };
        keys.map(key => {
            const obj = new Obj();
            obj.src = arr[key];
            obj[load] = () => {
                // 为对象设置响应函数，加载完毕自动响应
                recall(obj, key);
            }
        });
    },

    TimeKeeper: (() => {
        let events: TkEvent;
        /**
         * 初始化注册器
         */
        const init = () => {
            // 初始化事件统计器
            events = {
                hotkey: undefined,
                play: undefined,
            }
        };

        /**
         * 注册被定时器周期性调用的响应方法
         */
        const register = (id: string, callback: () => void) => {
            if(events[id] === undefined) {
                events[id] = callback;
            } else {
                console.error('注册失败，事件已注册');
            }
        };

        /**
         * 移除注册器
         * @param id 
         */
        const removeAt = (id: string) => {
            if (events[id] instanceof Function) {
                events[id] = undefined;
            }
        }
        const begin = () => {
            for (let func of Object.values(events)) {
                if(func !== undefined) {
                    func();
                }
            }
            requestAnimationFrame(begin);
        };
        init();
        begin();
        return {
            init,
            register,
            removeAt
        };
    })(),

    isImage(img: HTMLImageElement | string): boolean {
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

    /**判断两个element是否相撞 */
    isCollision(a: moduleData, b: moduleData) {
        return ((a.y > b.y && a.y < b.y + b.h) || (b.y > a.y && b.y < a.y + a.h)) && 
        ((a.x > b.x && a.x < b.x + b.w) || (b.x > a.x && b.x < a.x + a.w));
    }

};

const hotkey = (() => {

    let data: KbEvent = {};

    const loop = () => {
        for (let key of Object.keys(data)) {
            let event = data[key];
            if (!event || !event.active) {
                continue;
            }
            if (event.enable) {
                event.callback();
            }
            if (event.once) {
                event.enable = false;
            }
        }
    };

    util.TimeKeeper.register('HotKey_loop', loop);

    window.addEventListener('keydown', e => {
        let keyCode = e.key.toLocaleUpperCase();
        const event = data[keyCode];
        if (!event) {
            return;
        }
        e.preventDefault();
        event.active = true;
    })
    window.addEventListener('keyup', e => {
        let keyCode = e.key.toLocaleUpperCase();
        const event = data[keyCode];
        if (!event) {
            return;
        } else {
            event.active = false;
            event.once ? event.enable = true : '';
        }
        
    })
    // loop();
    return {
        register: (keyCode: string, callback: () => void, once: boolean = false) => {
            keyCode = "" + keyCode;
            keyCode = keyCode.toLocaleUpperCase();
            data[keyCode] = {
                callback: callback, // 触发时的回调函数
                once: once, // 是否只回调一次
                enable: true, // 是否可触发
                active: false // 是否正在触发
            }
        },
        clearAll: () => {0
            data = {};
        }
    }

})();

interface TkEvent {
    [key: string]: Function | undefined;
}

interface keyBoardEvent {
    once: boolean;
    callback: () => void;
    enable: boolean;
    active: boolean;
}

interface KbEvent {
    [key: string]: keyBoardEvent | undefined;
}

export  { util, hotkey, TkEvent };
