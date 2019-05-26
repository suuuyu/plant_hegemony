<template>
  <div class="home">
    <div><h1 class="head">{{data !== undefined?data.time:0}}</h1></div>
    <canvas ref="canvas"></canvas>
    <button @click="loadResource"> 点我加载数据</button>
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
  private scene: Scene | undefined;
  private ctx: any;
  private data: Data | undefined;
  constructor() {
    super();
    this.msg = 'hello';
    this.scene = undefined;
    this.data = new Data();
  }
  public mounted(): void {
    this.initcanvas();
  }

  public loadResource() {
    resource.loadAssets(() => {
      console.log('done');
    });
  }

  public initcanvas(): void {
    const canvas = this.$refs.canvas;
    this.scene = new Scene(canvas);
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

