const actions= 
{
   changePage({commit},changePageVal)
   {
        commit("CHANGE_PAGE",changePageVal)
   },
   changeSongIndex({commit},songIndex)
   {
        commit("CHANGE_SONGINDEX",songIndex)
   },
   changeBtnClass({commit},btnClass)
   {
        commit("CHANGE_BTN_CLASS",btnClass)
   },
   changeStartStop({commit},startStopTag)
   {
        commit("CHANGE_START_STOP",startStopTag)
   }

}

export default actions