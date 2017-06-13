<template>
  <div id="app">
      <!-- <div @click='aaa' style="height:100px;widtg:100px;background:red"> -->
          
     <!--  </div> -->
      <component :is='compVal'></component>
      <audio preload id="player" :src="musicUrl"></audio>
  </div>
</template>

<script>

import musicList from './components/musicList'
import playerUi from './components/playerUi'
import {mapState} from 'vuex'

/*获取audio对象*/


export default {
  name: 'app',
  data()
  {
    return {
        audioObj:''
    }
  },
  components:
  {
    musicList,
    playerUi
  },
  mounted(){
    this.getAudioObj()
  },

  methods:
  {
    getAudioObj:function()
    {
         this.audioObj=document.getElementById('player');
    }
  },
  computed: 
  {
      /*mapState获取store中的state数据*/
      ...mapState({
                  changePage: "changePage",
                  songList:'songList',
                  songIndex:'songIndex'
              }),

      compVal:function()
      {
         return this.changePage
      },
      musicUrl:function()
      {
         return 'http://ws.stream.qqmusic.qq.com/'+this.songList[this.songIndex].id+'.m4a?fromtag=46'
      }
   }
}

// http://ws.stream.qqmusic.qq.com/101369814.m4a?fromtag=46
</script>

<style>

#app {
  font-family: '微软雅黑', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
  color: white;
  background: url('http://orbps6iaj.bkt.clouddn.com/player/imgbg.png') no-repeat;
  background-size: 100% 100%;
}
</style>
