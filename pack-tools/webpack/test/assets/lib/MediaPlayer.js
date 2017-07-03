/*
 * @Author: hedgehog
 * @Date:   2016-11-15 19:14:50
 * @Last Modified by:   hedgehog
 * @Last Modified time: 2016-11-17 10:57:49
 */

'use strict';

const MediaPlayer = (mediaOpt = {}, playerOpt = {}) => {
  // 媒体配置详情请见《7)EPG页面制作及显示技术要求V3.0.pdf》
  const MOpt = {
    allowTrickmode: 1,
    audioType: 1, //1:MPEG-1/2layer2(MP2) 2:MPEG-1/2layer3(MP3) 3:MPEG-2LC-AAAC 4:MPEG-4LC-AAC 5:MPEG-4HE-AAC 6:AC-3 7:WMA9
    copyProtection: 1,
    drmType: 1,
    endTime: 0,
    entryID: "jsonentry1",
    fingerPrint: 0,
    mediaCode: "jsoncode1",
    mediaType: 2, //1:TYPE_CHANNEL 2:TYPE_VOD 3:TYPE_TVOD 4:TYPE_MUSIC
    mediaUrl: '',
    startTime: 0,
    streamType: 1, //1:PS 2:TS 3:MP4 4:ASF
    videoType: 1, //1:MPEG-2 2:MPEG-4 3:H.264 4:WMV9 5:VC-1 6:AVS
  }
  // 初始化player
  const POpt = {
    playListFlag: 0, //Media Player 的播放模式。 0：单媒体的播放模式 (默认值)，1: 播放列表的播放模式
    videoDisplayMode: 1, //MediaPlayer 对象对应的视频窗口的显示模式. 1: 全屏显示2: 按宽度显示，3: 按高度显示，255:视频显示窗口将被关闭。
    height: window.innerHeight,
    width: window.innerWidth,
    left: 0,
    top: 0,
    muteFlag: 0, //0: 设置为有声 (默认值) 1: 设置为静音
    subtitleFlag: 0, //字幕显示  0：不显示（默认） 1：显示
    videoAlpha: 0, //视频的透明度 0-100
    cycleFlag: 0, // 0:设置为循环播放 1:设置为单次播放(默认值)
    randomFlag: 0, // 随机播放（限列表播放）
    autoDelFlag: 0,
    useNativeUIFlag: 1,
  }

  for (const key in mediaOpt) {
    if (mediaOpt.hasOwnProperty(key)) {
      MOpt[key] = mediaOpt[key];
    }
  }
  for (const key in playerOpt) {
    if (playerOpt.hasOwnProperty(key)) {
      POpt[key] = playerOpt[key];
    }
  }

  if (!window.MediaPlayer) {
    console.error('缺少MediaPlayer对象');
    return;
  }
  if (!MOpt.mediaUrl) {
    console.error('缺少mediaUrl');
    return;
  }
  const Player = window.MediaPlayer || function(){};
  const myPlayer = new Player();
  myPlayer.initMediaPlayer(
    POpt.instanceId, POpt.playListFlag, POpt.videoDisplayMode,
    POpt.height, POpt.width, POpt.left, POpt.top, POpt.muteFlag,
    POpt.useNativeUIFlag, POpt.subtitleFlag, POpt.videoAlpha,
    POpt.cycleFlag, POpt.randomFlag, POpt.autoDelFlag
  );
  myPlayer.setSingleMedia(JSON.stringify(new Array(MOpt)));
  // 设置了setVideoDisplayMode, setVideoDisplayArea后，需要调用refreshVideoDisplay才生效
  return myPlayer;
};

export default MediaPlayer;
