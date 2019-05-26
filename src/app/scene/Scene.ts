import config from '@/app/config';
interface drawData {
    img: string
}

class Data {
    public time: number;
    public fuel: number;
    public score: number;
    constructor() {
        this.time = 0;
        this.fuel = 0;
        this.score = 0;
    }
}

 class Scene {
    private canvas: any;
    private ctx: any;
    public data: Data;
    private register_id: string;
    
    constructor(canvas: any) {
        this.canvas = canvas;
        this.register_id = '';
        this.initCanvas();
        this.data = new Data();
    }

    private initCanvas(): void {
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = config.game.w;
        this.canvas.height = config.game.h;
    }

    public load(): void {

    }

    public draw(data: [HTMLImageElement, number, number, number, number, number, number, number, number]): void {
        this.ctx.drawImage.apply(this.ctx, data);
    }
}

export { Scene, Data };

