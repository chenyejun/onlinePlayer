<template>
  <transition name='bounce'>
        <div class="player_ui">
            <header class="title">
                 <div class="go_back" @click='goBackList'></div>
            </header>
            <div class="fire_girl_pic fire_girl"></div>
            <section class="play_ctr">
                  <p class="song_name">{{songName}}</p>
                  <p class="singer_name">{{singerName}}</p>
                  <div class="progress_bar">
                      <div class="bar">
                            <div class="bar_line">
                                <p class="bar_active"></p>
                            </div>
                      </div>
                      <div class="bar_left">{{nowTimeLine | filterTime}}</div>
                      <div class="bar_right">{{duration | filterTime}}</div>
                  </div>
                  <div class="control_out">
                        <div class="control">
                            <div class="pre_btn same_btn" @click='preBtn'>
                            </div>
                            <div class="stop_btn" @click='playBtn' :class='{play_btn:changeClass}'>
                            </div>
                            <div class="next_btn same_btn" @click='nextBtn'>
                            </div>
                        </div>
                  </div>
            </section>
        </div> 
  </transition>
</template>

<script>
import {mapState} from "vuex"

export default {
  name: 'playerUi',
  data () {
    return {
        /*用于切换组件*/
        changePage:'musicList',

        /*用于记录开始或者暂停的标记*/
        musicPlay:true,
        musicStop:false,

        /*audio对象和进度条对象*/
        audioObj:'',
        barLineObj:'',
        barActiveObj:'',

        /*获取当前播放进度时间和总时间*/
        nowTimeLine:0,
        duration:0,

        /*进度条外层长度*/
        barLineWidth:0,

        /*侦听nowTimeLine和duration的定时器*/
        playerTimer:null,

        /*侦听切换歌曲的定时器*/
        changeSongTimer:null,

        /*执行暂停的定时器*/
        pauseTimer:null

    }
  },
  mounted()
  {
        this.getObj(),
        this.getBarLineWid(),
        this.dynamicCurrentTime()
  },
  methods:
  {
      /*左上角返回列表按钮事件*/
      goBackList:function()
      {
          this.$store.dispatch('changePage',this.changePage);
      },

      /*获取audio对象的方法*/
      getObj:function()
      {
          this.audioObj=document.getElementById('player');
          this.barLineObj=document.getElementsByClassName('bar_line')[0];
          this.barActiveObj=document.getElementsByClassName('bar_active')[0];
      },

      /*获取进度条外层长度*/
      getBarLineWid:function()
      {
          this.barLineWidth=parseInt(this.getStyle(this.barLineObj,'width'));
      },

      /*播放按钮*/
      playBtn:function()
      {
          if(this.songStartStop==false)
          {
              this.audioObj.play();
              this.$store.dispatch('changeBtnClass',this.musicPlay);
              this.$store.dispatch('changeStartStop',this.musicPlay);
              this.dynamicCurrentTime();
          }
          else
          { 
            /*需要延迟执行pause()，不然当切换歌曲后，点击第一次暂停会失效*/
            this.pauseTimer=setTimeout(()=>{
               this.audioObj.pause();
               if(this.songStartStop==false)
               {
                  clearInterval(this.pauseTimer);
               }
             },500);
            this.$store.dispatch('changeBtnClass',this.musicStop);
            this.$store.dispatch('changeStartStop',this.musicStop);
          }
      },

      /*播放上一首*/
      preBtn:function()
      {
          
          if(this.songIndex>0)
          {
              this.changeSongFun(--this.songIndex);
              this.dynamicCurrentTime();
          }
          else
          {

              return false;
          }
          
      },
      /*播放下一首*/
      nextBtn:function()
      {
      
          if(this.songIndex < this.songList.length-1)
          {
              this.changeSongFun(++this.songIndex);
              this.dynamicCurrentTime();
          }
          else
          {
              return false;
          }
          
      },

      /*改变歌曲索引，然后切换歌曲*/
      changeSongFun:function(songIndexChange)
      {
            /*切换歌曲，进度条清零*/
            this.setBarInitWid();

            clearInterval(this.changeSongTimer);
            clearInterval(this.playerTimer);

            this.$store.dispatch('changeSongIndex',songIndexChange);

            /*切换播放暂停的按钮图标*/
            this.$store.dispatch('changeBtnClass',this.musicPlay);

            this.$store.dispatch('changeStartStop',this.musicPlay);

            /*这里添加定时器的原因是，上面的changeSongIndex通过vuex改变歌曲索引需要一定的延时，所以才添加定时器，执行开关，不然需要双击才能播放音乐*/
            this.changeSongTimer=setTimeout(()=>{
                this.audioObj.play();
                if(this.songStartStop==false)
                {
                    clearInterval(this.changeSongTimer);
                }
            },500);
      },

      /*不知道为什么把nowTimeLine放到compted不会动态改变数据，只能采用定时器*/
      dynamicCurrentTime:function()
      {
           this.playerTimer=setInterval(()=>{
            if(this.songStartStop==false)
            {
                clearInterval(this.playerTimer);
            }
            this.nowTimeLine=this.audioObj.currentTime;
            this.duration=this.audioObj.duration;

            if(this.audioObj.ended==true)
            {
                 /*切换歌曲，进度条清零*/
                this.setBarInitWid(); 

                this.changeSongFun(++this.songIndex);
                this.dynamicCurrentTime();
            }

            this.setBarActiveWid();
        },1000);

      },

      /*设置进度条长度*/
      setBarActiveWid:function()
      {
          this.barActiveObj.style.width=this.nowProgressWid+'px';
      },

      /*每次切换歌曲就清0*/
      setBarInitWid:function()
      {
          this.barActiveObj.style.width=0+'px';
      },

      /*获取计算后的样式*/
      getStyle:function(obj, attr)
      {
          if(obj.currentStyle)
          {
            return  obj.currentStyle[attr];
          }
            else
          {
             return  getComputedStyle(obj,false)[attr];
          }
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

      /*监听歌曲名字*/
      songName:function()
      {
          return this.songList[this.songIndex].songName;
      },

      /*监听歌手名字*/
      singerName:function()
      {
          return this.songList[this.songIndex].singerName;
      },


      /*监听歌曲按钮样式*/
      changeClass:function()
      {
          return this.btnClass;
      },

      /*用来存储currentTime和duration的比值*/
      percentTime:function()
      {
          return this.nowTimeLine / this.duration;
      },

      /*当前进度条长度*/
      nowProgressWid:function()
      {
          return this.percentTime*this.barLineWidth;
      }

  },
  filters: 
  {
      /*过滤时间，把秒数化成分钟数*/
      filterTime:function(val)
      {
          return Math.floor(Math.floor(val)/60)+':'+Math.floor(Math.floor(val)%60);
      }
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.bounce-enter-active {
  animation: bounce-in 1.2s;
}
.bounce-leave-active {
  animation: bounce-out 1.2s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}



.fire_girl
{
    animation: rotate 10s linear infinite;
}

@keyframes rotate{from{-webkit-transform: rotate(0deg)}
    to{-webkit-transform: rotate(360deg)}
}




.player_ui
{
    height: 100%;
    width: 100%;
}

.title
{
    height: 50px;
    width: 100%;
}

.go_back
{
    height:50px;
    width: 50px;
    background:url('http://orbps6iaj.bkt.clouddn.com/player/imggo_back.png') no-repeat 12px 11px;
}

.fire_girl_pic
{
    margin: 40px auto;
    height: 180px;
    width: 180px;
    background: url('http://orbps6iaj.bkt.clouddn.com/player/imgfire_girl.jpg');
    background-size: 100%;
    border-radius: 100%;
    box-shadow: 0px 0px 100px #ccc;
}

.play_ctr
{
    width: 100%;
}

.song_name,.singer_name
{
    text-align: center;
}
.song_name
{
    padding: 0px 20px 2px;
    font-size: 25px;
}

.progress_bar
{
    margin-top: 10px;
    padding:0 60px;
    height: 20px;
    text-align: center;
}

.bar
{
    float: left;
    width: 100%;
    height:20px;
}

.bar_line
{
    display: inline-block;
    height: 8px;
    width: 100%;
    background:white;
    border-radius: 5px;
    overflow: hidden;
}

.bar_active
{
    height: 100%;
    width: 0px;
    background: #19c873;
    border-radius: 5px;
}

.bar_left
{
    width: 60px;
    line-height: 20px;
    float: left;
    margin-left: -100%;
    position: relative;
    left: -60px;
}

.bar_right
{
    width: 60px;
    line-height: 20px;
    float: left;
    margin-left: -60px;
    position: relative;
    right: -60px;
}

.control_out
{
    padding-top:5px;
    height: 50px;
    width: 100%;
    text-align: center;
}


.control
{
    display: inline-block;
    height: 50px;
    width: 250px;
}


.stop_btn
{
    margin: 0 20px;
    float: left;
    height: 50px;
    width: 50px;
    background: url('http://orbps6iaj.bkt.clouddn.com/player/imgstop_icon.png') no-repeat;
    background-size: 100%;
}

.play_btn
{
    background: url('http://orbps6iaj.bkt.clouddn.com/player/imgplay_icon.png') no-repeat;
    background-size: 100%;
}

.pre_btn
{
    margin-left: 40px;
    background: url('http://orbps6iaj.bkt.clouddn.com/player/imgpre_icon.png') no-repeat;
   
}

.same_btn
{ 
    float: left;
    margin-top: 5px;
    height: 40px;
    width: 40px;
    background-size: 100%;
}

.next_btn
{
    background: url('http://orbps6iaj.bkt.clouddn.com/player/imgnex_icon.png') no-repeat;
}


@media all and (min-width: 350px) 
{
    .fire_girl_pic
    {
        height: 150px;
        width: 150px;
    }
}

@media all and (max-height: 500px) 
{
    .fire_girl_pic
    {
        height: 130px;
        width: 130px;
    }

    .song_name
    {
        font-size: 20px;
    }
}

@media all and (min-height: 570px) 
{
    .fire_girl_pic
    {
        height: 200px;
        width: 200px;
        margin: 70px auto;
    }
}


</style>
