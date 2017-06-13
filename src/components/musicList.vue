<template>
  <transition name='bounce'>
        <div class="music_list">
            <header class="title">
                music_list
                <div class="go_player" @click='goPlayer'>
                    <img src="http://orbps6iaj.bkt.clouddn.com/player/imggo_back.png" alt="">
                </div>
            </header>
            <section class="container">
                <ul>
                   <li class="a_song" v-for='(music,index) in musics'>
                        <p @click='clickMusic(index)' :class='{active_music:songClass[index]}'>{{music.songName}}</p>
                   </li>
                </ul>
            </section>
        </div>
  </transition> 
</template>

<script>
import {mapState} from "vuex"

export default {
  name: 'musciList',
  data () {
    return {
      changePage: 'playerUi',
      musicPlay:true,
      musicStop:false,

      audioObj:'',
      containerObj:'',
      /*侦听切换歌曲的定时器*/
      changeSongTimer:null,

      /*给active的歌曲添加active_music样式*/
      songClass:[]
    }
  },
  mounted(){
        /*执行getAudioObj()获取audio对象*/
        this.getAudioObj(),

        this.addActiveClass(),
        this.appointScroll()
  },
  methods:
  {   

      /*获取audio对象的方法和container对象*/
      getAudioObj:function()
      {
          this.audioObj=document.getElementById('player');
          this.containerObj=document.getElementsByClassName('container')[0];
      },
      clickMusic:function(index)
      {

          clearTimeout(this.changeSongTimer);

          /*改变歌曲索引*/
          this.$store.dispatch("changeSongIndex",index);


          /*切换播放暂停的按钮图标*/
          this.$store.dispatch('changeBtnClass',this.musicPlay);

          this.$store.dispatch('changeStartStop',this.musicPlay);


          /*跳转到播放界面*/
          this.$store.dispatch('changePage',this.changePage);


          /*这里添加定时器的原因是，上面的changeSongIndex通过vuex改变歌曲索引需要一定的延时，所以才添加定时器，执行开关，不然需要双击才能播放音乐*/
          this.changeSongTimer=setTimeout(()=>{

              this.addActiveClass();
              this.audioObj.play();
              if(this.songStartStop==false)
              {
                  clearTimeout(this.changeSongTimer);
              }

          },500);
          
      },

      /*先设置所有的songClass为false，然后设置指定的songIndex歌曲为true*/
      addActiveClass:function()
      {
          this.songClass.length=0;
          for(let i=0;i<this.songList.length;i++)
          {
              this.songClass.push(false);
              if(i==this.songIndex)
              {
                  this.songClass[this.songIndex]=true;
              }
          }
      },

      /*点击右上角按钮，前往播放界面*/
      goPlayer:function()
      {
          this.$store.dispatch('changePage',this.changePage)
      },

      /*页面滚动到正在播放的歌曲*/
      appointScroll:function()
      {
          this.containerObj.scrollTop=45*this.songIndex;
      }

    

  },
  computed: 
  {
      /*mapState获取store中的state数据*/
      ...mapState({
                  songList: "songList",
                  songIndex:'songIndex',
                  btnClass:'btnClass',
                  songStartStop:'songStartStop'
              }),
      /*获取state中的songList*/
      musics:function()
      {
          return this.songList
      }
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.bounce-enter-active {
  transition: all 1.5s ease;
}

.bounce-enter
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}


.music_list
{
   position: relative;
   height: 100%;
   width: 100%;
}

.title
{
  position: absolute;
  left: 0;
  top: 0;
  line-height: 50px;
  width: 100%;
  text-align: center;
  background: rgba(255,255,255,0.2);
}

.go_player
{
    padding-top: 8px;
    position: absolute;
    right: 0;
    top: 0;
    height: 50px;
    width: 50px;
    box-sizing:border-box;
}

.go_player img
{
    transform:rotate(180deg);
    -ms-transform:rotate(180deg);   /* IE 9 */
    -moz-transform:rotate(180deg);  /* Firefox */
    -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
    -o-transform:rotate(180deg);
}

.container
{
   height: 100%;
   width: 100%;
   border-top:50px solid rgba(255,255,255,0.2); 
   box-sizing:border-box;
   overflow: auto;
   -webkit-overflow-scrolling : touch;
}

.a_song
{
   height: 45px;
   border-bottom: 1px solid white;
}

.a_song p
{
  padding:0 15px;
  line-height: 45px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.active_music
{
    background: rgba(255,255,255,0.5);
}
</style>
