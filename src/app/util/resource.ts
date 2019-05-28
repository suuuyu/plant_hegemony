import util from './util';
import {config} from '../config';

const resource = (() => {
    let images: any;
    let audios: any;

    const call = (callback: Function): void => {
        if(images && audios) {
            //音频和图片全部加载完毕后，再响应回调函数
            callback();
        }
    };
    const findImgByKey = (key: string)=>  {
        return images[key];
    };
    const loadAssets = ( callback: Function) => {
        console.log('开始加载')
        util.loadImages(config.images, (imgs: any) => {
            images = imgs;
            call(callback);
        });
        util.loadAudios(config.audios, (aud: any) => {
            audios = aud;
            call(callback);
        });
    };

    return {
        findImgByKey,
        loadAssets,
    };
})();

export default resource;
