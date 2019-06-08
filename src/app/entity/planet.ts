import Item from './item';
import {util} from '../util/util';
import { moduleData, config } from '../config';

export default class Planet extends Item {
  public load() {
    super.load('planet');
    const img = this.img as HTMLImageElement;
    const mod = this.mod as moduleData;
    const { w, h } = config.game;
    const percent = img.width > 100 ? util.random(10, 30) * 0.01 : 1;
    mod.w = img.width * percent;
    mod.h = img.height * percent;
    mod.speed = mod.w * 0.05;
    // 正好放置在屏幕右边界区
    mod.x = w + mod.w;
    mod.y = util.random(h - mod.h / 2, mod.h / 2);
  }

  public update() {
    if (this.run) {
      this.move();
    }
    super.update();
  }

  private move() {
    const mod = this.mod as moduleData;
    mod.x -= mod.speed;
  }
}
