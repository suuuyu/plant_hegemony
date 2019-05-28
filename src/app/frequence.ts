import util from './util/util';

/*
 *频率计数器
 *@param: 当传入参数为数组时，每次重置频率将在最大值和最小值直接随机取值
 * now为 false时，第一次的计数将从频率计数开始，true时从0开始
 *每调用一次update触发一次频率计数
 *频率计数为0时重置频率计数，并触发回调函数
 */
export default class Frequence {
    private frequence: number;
    private origin: number | number[];
    constructor( frequence: number | number[], now: boolean = true) {
        this.frequence = now ? 0 : this.getFrequence(frequence);
        this.origin = frequence;
    }

    public update(): Frequence {
        this.frequence --;
        return this;
    }

    public active(callback: () => void) {
        if (this.frequence <= 0) {
            this.reset();
            callback();
        }
    }

    public reset() {
        this.frequence = this.getFrequence(this.origin);
    }

    private getFrequence(frequence: number | number[] ): number {
        if (frequence instanceof Array) {
            return util.random(frequence[1], frequence[0]);
        } else {
            return frequence;
        }
    }
}

