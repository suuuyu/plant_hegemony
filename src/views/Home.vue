<template>
  <div class="home">
    <div><h1 class="head">{{data !== undefined?data.time:0}}</h1></div>
    <canvas ref="canvas"></canvas>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {Scene, Data} from '@/app/scene/Scene';
import resource from '@/app/util/resource';
// import Hello from '@/components/Hello.vue'; // @ is an alias to /src

@Component({
  components: {
    // Hello,
  },
})
export default class Home extends Vue {
  private msg: string;
  private scene: Scene;
  private ctx: any;
  private data: Data | undefined;
  constructor() {
    super();
    this.msg = 'hello';
    this.scene = new Scene();
    this.data = new Data();
  }
  public mounted(): void {
    this.init();
    this.loadResource();
  }

  private loadResource() {
    console.log('begin load')
    resource.loadAssets(() => {
      console.log('done');
      const canvas = this.$refs.canvas;
      this.scene.load(canvas);
    });
  }

  private init(): void {
    this.data = this.scene.data;
  }
}
</script>

<style scoped>
.head {
  position: absolute;
  top: 300px;
  left: 300px;
  z-index: 1000;
}
</style>

