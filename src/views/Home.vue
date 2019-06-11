<template>
  <div class="home">
    <div class="canvas-wrapper" ref="panel">
      <canvas ref="games"></canvas>
      <canvas ref="screen" class="screen"></canvas>
      <div class="control-panel">
        <div class="mask" v-if="visable"></div>
        <el-button type="primary" class="begin-btn" @click="beginGame" v-if="visable">开始</el-button>
        <!-- <el-button type="warning" class="begin-btn" @click="stopGame" v-else>暂停</el-button> -->
        <div class="bar" v-if="controller && controller.player">
          <h1 class="head">分数：{{controller.data.score }}</h1>
          <h1 class="level">等级：{{controller.data.level }}</h1>
          <div class="life-bar">
            <span class="life-text"><i class="el-icon-first-aid-kit"></i></span>
            <el-progress :percentage="parseInt(controller.player.life / 25 * 100)" 
            style="width: 80%;float:left;"  :color="customColors"></el-progress>
          </div>
          <div class="fuel-bar">
            <span class="life-text"><i class="el-icon-milk-tea"></i></span>
            <el-progress :percentage="parseInt(controller.data.fuel / 30 * 100)" 
            style="width: 80%;float:left;"  :color="customColors"></el-progress>
          </div>
          <div class="boss-bar" v-if="controller.data.Boss">
            <span class="life-text"><i class="ivu-icon ivu-icon-md-code-working"></i></span>
            <el-progress :percentage="parseInt(controller.data.Boss.life / 150 * 100)" 
            style="width: 80%;float:left;"  :color="customColors"></el-progress>
          </div>
          <div class="life-bar">
            <el-row :gutter="20">
              <el-col :span="6">
              <el-popover
                placement="top"
                width="160"
                v-model="show"
                @show="stopGame"
                @hide="beginGame">
                <p>确定要重新开始游戏吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="beginGame();show = false;">取消</el-button>
                  <el-button type="primary" size="mini" @click="resetGame();show = false;">确定</el-button>
                </div>
                <span class="life-text" slot="reference"><i class="el-icon-refresh-left"></i></span>
              </el-popover>
              </el-col>
              <el-col :span="6" v-if="!visable"><span class="life-text"><a class="el-icon-video-pause"  @click="stopGame"></a></span></el-col>
            </el-row>
          </div>
        </div>
        
      </div>
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
import { config } from '../app/config';
import Playerplane from '../app/entity/player';
import Controller from '../app/controller';
// import Hello from '@/components/Hello.vue'; // @ is an alias to /src

@Component({
  components: {
    // Hello,
  },
})
export default class Home extends Vue {
  public show: boolean = false;
  private controller: Controller | undefined;
  private msg: string;
  private scene: Scene;
  private user: User | undefined;
  private ctx: any;
  private isBegin: boolean = false;
  private visable: boolean = true;
  public customColors: any[] = [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 100}
        ]
  constructor() {
    super();
    this.msg = 'hello';
    this.scene = new Scene();
  }

  public mounted(): void {
    this.loadResource();
    this.initScreen();
  }

  public resetGame() {
    this.GameOver();
    this.beginGame();
  }

  public beginGame() {
    this.visable = false;
    if (this.isBegin) {
      this.scene.start();
    } else {
      this.scene.controller.addPlayer(this.$refs.panel as HTMLElement);
      this.controller = this.scene.controller;
      this.scene.setHook(this.GameOver.bind(this));
      this.scene.start();
      this.isBegin = true;
    }
  }
  public GameOver() {
    this.scene.reset();
    this.isBegin = false;
    this.stopGame();
  }
  public stopGame() {
    this.scene.stop();
    this.visable = true;
  }

  
  private loadResource() {
    console.log('begin load')
    resource.loadAssets(() => {
      console.log('done');
      const canvas = this.$refs.games;
      this.scene.load(canvas as HTMLCanvasElement);
    });
  }
  private initScreen() {
    const canvas = this.$refs.screen;
    explosion.init(canvas);
  }
}
</script>

<style scoped>
.ivu-icon {
    display: inline-block;
    font-family: Ionicons;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    text-rendering: auto;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    vertical-align: middle;
    background: url('/icon.svg');
    width: 15px;
}
.fuel-bar {
  width: 15%;
  height: 20%;
  padding-top: 10px;
  padding-left: 10px;
  float: left;
}
.boss-bar {
  width: 15%;
  height: 20%;
  padding-top: 650px;
  padding-left: 0px;
  float: right;
}
.life-bar {
  width: 15%;
  height: 20%;
  padding-top: 10px;
  padding-left: 10px;
  float: left;
}
.life-text {
  position: relative;
  color: white;
  float: left;
  font-size: 20px;
  margin-right: 10px;
}
.mask {
  width: 1440px;
  height: 700px;
  background-color: rgba(202, 202, 202, 0.336)
}
.bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 1440px;
  height: 700px;
}
.begin-btn {
  top: 350px;
  left: 720px;
  position: absolute;
  z-index: 10;
}
.control-panel {
  top: 0px;
  left: 0px;
  position: absolute;
  z-index: 1002;
  width: 1440px;
  height: 700px;
}
.head {
  position: absolute;
  right: 40px;
  z-index: 1000;
  color: aliceblue;
}
.level {
  position: absolute;
  right: 245px;
  z-index: 1000;
  color: aliceblue;
}
.screen {
  top: 0px;
  left: 0px;
  position: absolute;
  z-index: 1001;
}
.canvas-wrapper {
  -webkit-user-select: none;
  position: relative;
  width: 1440px;
  height: 700px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.315)
}
</style>

