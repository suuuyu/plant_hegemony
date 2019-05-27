import { Scene } from './scene/Scene';
import Frequence from './frequence';
import explosion from '@/app/scene/explosion'
import { config, moduleData } from './config';
import util from './util/util';
import Item from './entity/item';

export default class User {
  private scene: Scene;
  private canShoot: boolean = false;
  private userid: string;
  private shootModule: moduleData;
  private shootFrequence: Frequence = new Frequence(config.game.fireFrequence);
  constructor(scene: Scene) {
    this.scene = scene;
    this.userid = 'foo';
    this.shootModule = {
      w: 20,
      h: 20,
      x: 0,
      y: 0,
      img: '',
      speed: 0
    }
  }

  /**
   * 注册用户操作响应事件
   */
  public register() {
    util.TimeKeeper.register(this.userid, this.update.bind(this));
  }

  /**用户射击 */
  public shoot(x: number, y:number) {
    if(this.canShoot) {
      this.canShoot = false;
      this.shootModule.x = x;
      this.shootModule.y = y;
      this.shootItem(this.scene.enermy.arr, (e: Item) => {
        console.log(e);
        explosion.clickThis(x, y);
      });
      this.shootItem(this.scene.friend.arr, (e: Item) => {
        console.log(e);
        explosion.clickThis(x, y);
      });
      this.shootItem(this.scene.meteorite.arr, (e: Item) => {
        console.log(e);
        explosion.clickThis(x, y);
      });
      this.shootItem(this.scene.enermyBullets, (e: Item) => {
        console.log(e);
        explosion.clickThis(x, y);
      });
      this.shootItem(this.scene.friendBullets, (e: Item) => {
        console.log(e);
        explosion.clickThis(x, y);
      });
    }
  }

  private shootItem(arr: Item[], callback: Function | undefined = undefined) {
    arr.forEach(e => {
      if(util.isCollision(e.mod as moduleData, this.shootModule)) {
        e.hurt();
        callback && callback(e);
      }
    });
  }

  private update() {
    this.shootFrequence.update().active(() => {
      this.canShoot = true;
    })
  }


}