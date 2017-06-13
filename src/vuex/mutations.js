
const mutations=
{
	/*改变changePage，切换组件*/
	CHANGE_PAGE (state,changePageVal) 
	{	
		state.changePage=changePageVal
	},
	/*改变歌曲索引，切换歌曲*/
	CHANGE_SONGINDEX (state,songIndex) 
	{	
		state.songIndex=songIndex
	},

	/*改变播放或者暂停的图标*/
	CHANGE_BTN_CLASS (state,btnClass)
	{
		state.btnClass=btnClass
	},

	CHANGE_START_STOP (state,startStopTag)
	{
		state.songStartStop=startStopTag
	}
}

export default mutations