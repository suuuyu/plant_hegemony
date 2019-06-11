import {util} from './util';
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

    const play = (key: string, loop: boolean = false) => {
        audios[key].play();
        audios[key].loop = loop;
    }

    const pause = (key: string) => {
        audios[key].pause();
    }

    const end = (key: string)=>{
        audios[key].currentTime = 0;
        audios[key].pause();  
    };

    const replay = (key: string)=>{
        end(key);
        play(key);
    }

    return {
        findImgByKey,
        loadAssets,
        play,
        end,
        pause,
        replay
    };
})();

export default resource;
