<template>
  <div class="home">
    <div><h1 class="head">{{data !== undefined?data.time:0}}</h1></div>
    <!-- <div class="canvas-wrapper" @mousemove="mouseMove" @mousedown="listen=true" @mouseup="listen=false" ref="panel"> -->
    <div class="canvas-wrapper" ref="panel">
      <canvas ref="games"></canvas>
      <canvas ref="screen" class="screen" @click="boardClick"></canvas>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {Scene, Data} from '@/app/scene/Scene';
import resource from '@/app/util/resource';
import explosion from '@/app/scene/explosion';
import User from '@/app/user';
// import Hello from '@/components/Hello.vue'; // @ is an alias to /src

@Component({
  components: {
    // Hello,
  },
})
export default class Home extends Vue {
  private listen: boolean = false;
  private msg: string;
  private scene: Scene;
  private user: User | undefined;
  private ctx: any;
  private data: Data | undefined;
  private isBegin: boolean = false;
  constructor() {
    super();
    this.msg = 'hello';
    this.scene = new Scene();
    this.data = new Data();
  }

  public mounted(): void {
    this.isBegin = true;
    this.init();
    this.loadResource();
    this.initScreen();
    // this.addUser();
  }

  // public addUser() {
  //   this.user = new User(this.scene);
  //   this.user.register();
  // }

  public boardClick(e: MouseEvent) {
    this.user && this.user.shoot(e.offsetX, e.offsetY);
  }

  public mouseMove(e: MouseEvent) {
    if (this.listen&& this.isBegin) {
      this.scene.controller.movePlayer(e.offsetX, e.offsetY)
    }
  }

  // private initTouch() {
  //   const panel = this.$refs.panel as HTMLDivElement;

  // }

  private init(): void {
    this.data = this.scene.controller.data;
  }
  private loadResource() {
    console.log('begin load')
    resource.loadAssets(() => {
      console.log('done');
      const canvas = this.$refs.games;
      this.scene.load(canvas as HTMLCanvasElement);
      this.scene.controller.addPlayer(this.$refs.panel as HTMLElement);
    });
  }
  private initScreen() {
    const canvas = this.$refs.screen;
    explosion.init(canvas);
  }
}
</script>

<style scoped>
.head {
  position: absolute;
  left: 30px;
  z-index: 1000;
  color: aliceblue;
}
.screen {
  top: 0px;
  left: 0px;
  position: absolute;
  z-index: 10000;
}
.canvas-wrapper {
  position: relative;
  width: 1440px;
  height: 700px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.315)
}
</style>

