import util from './util';
import config from '../config';

const resource = {
    images: undefined,
    audios: undefined,

    call(callback: Function): void {
        if(this.images && this.audios)
        //音频和图片全部加载完毕后，再响应回调函数
            callback();
    },

    findImgByKey(key: string): HTMLImageElement {
        return this.images[key];
    },

    loadAssets( callback: Function): void {
        util.loadImages(config.images, (imgs: HTMLImageElement[]) => {
            this.images = imgs;
            this.call(callback);
        })
    },
}

export default resource;
