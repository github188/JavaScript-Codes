<style scoped>
#mp-debug {
    position: fixed;
    right: 0;
    top: 0;
    width: 40%;
    height: 100%;
    background-color: black;
    color: white;
    z-index: 10000000;
    word-wrap: break-word;
    opacity: 0.5;
    overflow: scroll;
}

.info {
	background-color: #fff;
	opacity: 0.6;
	width: 400px;
	height: 200px;
	font-size: 18px;
	color: red;
}

.info div {
	width: 100%;
	height: 30px;
	line-height: 30px;
}

.time {
	width: 100%;
	height: 100%;
	line-height: 30px;
	text-align: left;
}

.tips {
	position: absolute;
	right: 3px;
	bottom: 2px;
	width: 100%;
	text-align: right;
	font-size: 12px;
	color: red;
	background: transparent;
}

</style>

<template>
	<div>
		<div class="info">
			<div class="time">
				当前时间/总时长：<span class="currTime">{{currTime}}</span>&nbsp;/&nbsp;<span class="totalTime">{{totalTime}}</span>	
			</div>
			<div class="status">当前状态：{{status}}<span>&nbsp;&nbsp;&nbsp;&nbsp;速率：X{{speed}}</span><span>&nbsp;&nbsp;&nbsp;&nbsp;声道：{{track}}</span></div>
			<!-- <div><span>播放模式：{{playMode}}</span></div> -->
			<div class="channel">当前频道号：{{userChannelID}}</div>
			<div class="currKey">当前按键/消息：{{currKeycode}}</div>
			<div class="volume">当前音量：{{currVolume}}<span v-if="isMute">&nbsp;&nbsp;&nbsp;&nbsp;静音</span></div>
			<div class="tips" v-if="isTipShow">{{tips}}</div>
		</div>
		<div id="mp-debug" v-if="isDebug"></div>
	</div>
</template>

<script>
/*
	该组件使用方法

	1. 父组件中引入
		- import mPlayer from './Tools/MediaPlayer.vue';
		- components: { mPlayer }
		- <m-player></m-player>

	2. 父组件中注册消息及播放类按键处理数组及函数
		- data: { mpEvents: [ // - 这里放播放需要处理的所有按键 - // ] }
		- document.onkeypress + onkeydown 最好两个都注册（但需要注意有个别盒子浏览器两个事件会同时出发，所以会导致按键执行两次问题）
		- 在注册好的事件处理句柄中，将 mpEvents 中的事件都交给该组件处理（通过 this.$broadcast('ehandler', keycode)）

	3. 在该组件 ready 中，通过 this.config({}) 配置播放选项（包括：url, area, 等等）

	4. 如果不在 ready 里面去开启播放，父组件可以通过 $broadcast('echangeurl', url); 事件去触发播放

	5. 组件加载完成之后，在其父组件可以通过 $broadcast 方式去播放等操作（不过最好通过该组件本身的按键处理去处理）

	6. 比如
		- 父组件触发重新播放：this.$broadcast('eplay')
		- 父组件修改播放地址后触发播放：this.$broadcast('echangeurl', url);

	注意点：

	1. this.config({}) 设置时，频道号和播放地址不能同时设置，因为两者播放模式不同，
	频道使用 joinChannel，其他使用 setSingleMedia + playFromStart
	2. 频道播放：
		this.config({
			isChannel: true, 			// 必选
			userChannelID: '001' / 1, 	// 必选
			isReinit: false, 			// 可选
		}).play();
	3. 非频道播放
		this.config({
			playUrl: '...播放地址，可以来自父组件或本身组件请求得来', 	// 必选
			isReinit: false, 		// 可选
		});
 */
export default {
	data() {
		return {
			mp: null,

			/*
				如果 type = 1 全屏，xywh此时为0
				如果 type = 0 非全屏，那就需要调用setAare设置视频区
			*/
			area: {
				type: 1,
				x: 0,
				y: 0,
				w: 0,
				h: 0,
			},

			mediaStr: '',
			playUrl: 'http://42.236.123.10/iptv/clist/vod/yanguiren.ts',
			currTime: '',
			totalTime: '',
			status: '', 	// play, pause, fastforward, fastrewind, stop
			track: '',
			currKeycode: '',
			playMode: '',
			tips: '',

			currVolume: 0,
			speed: 1,
			userChannelID: 1,

			isDebug: true,
			isMute: 0,
			isPause: false,
			isChannel: false,
			isReinit: false,
			isTipShow: true,
			isMusic: false,

			secondTimer: null,
			keys: {},
		};
	},

	methods: {

		// 对外初始化接口
		init() {
			this.debug('init');
			this.setArea()._init();
		},

		setMediaStr() {
			this.playUrl = this.playUrl || arguments[0];
			this.mediaStr = ''
				+ '[{mediaUrl:"' + this.playUrl + '",'
				+ 'mediaCode: "jsoncode1",'
				+ 'mediaType:2,'
				+ 'audioType:1,'
				+ 'videoType:1,'
				+ 'streamType:1,'
				+ 'drmType:1,'
				+ 'fingerPrint:0,'
				+ 'copyProtection:1,'
				+ 'allowTrickmode:1,'
				+ 'startTime:0,'
				+ 'endTime:20000,'
				+ 'entryID:"jsonentry1"}]';
		},

		// 获取或设置播放器参数，参数必须为对象模式
		config() {

			let args = arguments;

			if (args.length <= 0) {
				this.track = this.mp.getAudioTrack();
				this.currVolume = this.mp.getVolume();
				this.isMute = parseInt(this.mp.getMuteFlag(), 10);
				this.speed = this.mp.getSpeed();
			} else {
				// 有参数情况下去配置
				if (this.type(args[0]) !== 'object') { return; }
				let obj = args[0];
				if (obj.url) { this.playUrl = obj.url; }
				else {
					// url 和频道号不能同时配置
					// 两者只能取其一
					this.isChannel = obj.isChannel;
					if (this.isChannel) {
						this.userChannelID = obj.userChannelID;
					}
				}
				if (obj.area) { this.area = obj.area; }

				// 音乐
				if (obj.isMusic) {
					this.area = {
						type: 0,
						x: -1,
						y: -1,
						w: 1,
						h: 1
					};
				}

				this.isReinit = obj.isReinit || this.isReinit;

				// this.play();
			}

			return this;
		},

		_init() {
			this.debug('_init:' + this.area.type);
			this.mp = new MediaPlayer();
			this.mp.initMediaPlayer();

			if (this.area.type === 1) {
				this.mp.setVideoDisplayMode(1);
			} else {
				this.mp.setVideoDisplayMode(0);
				this.mp.setVideoDisplayArea(
					this.area.x, 
					this.area.y, 
					this.area.w, 
					this.area.h
				);
			}

			// 获取播放器配置信息
			this.config();

			this.mp.refreshVideoDisplay();
		},

		// 设置视频区
		setArea() {

			/*
				支持 
					1. 不传值，返回当前area
					2. 对象({type:0, x:0, y:0, w:1280, h:720})
					3. 值数组([0,0,0,1280,720])，
					4. 单个值(x,y,w,h)
			 */

			let args = arguments;

			this.debug('setarea:' + args);
			if (args.length <= 0) { // 返回当前值
				return this;
			} else if (this.type(args[0]) === 'object') { // 直接覆盖
				this.area = args[0];
			} else if (this.type(args[0]) === 'array') { // 数组转成对象赋值给area
				this.area = this.array2Obj(args[0], ['type', 'x', 'y', 'w', 'h']);
			} else if (args.length === 4) { // 一个个赋值
				this.area.type = 0;
				this.area.x = args[0];
				this.area.y = args[1];
				this.area.w = args[2];
				this.area.h = args[3];
			}

			return this;
		},

		// 数组转化成对象
		array2Obj(array, keys) {

			if (!array || this.type(array) !== 'array' || array.length <= 0) {
				return {};
			}

			const obj = {};

			if (array.map) {
				array.map((v, i) => {
					if (keys && keys[i]) {
						obj[keys[i]] = v;
					} else {
						obj[v] = v;
					}
				});
			} else {
				for (let i = 0; i < array.length; i++) {
					if (keys && keys[i]) {
						obj[keys[i]] = v;
					} else {
						obj[v] = v;
					}
				}
			}

			return obj;
		},

		type(obj) {
			return (
				Object.prototype.toString
					.call(obj)
					.split(' ')[1]
					.replace(/]/, '')
					.toLowerCase()
			);
		},

		debug(obj) {

		    if (!this.isDebug) { return; }

		    const debug = document.getElementById('mp-debug');

		    let str = '';

		    if (typeof(obj) === 'object') {
		        str = JSON.stringify(obj);
		    } else {
		        str = '' + obj;
		    }

		    debug.innerHTML += '[' + str + ']';
		},

		virtualKeyHandler() {

		    this.debug('virtualkey in');
		    try {
		        // 每次捕获事件只能获取一次Utility.getEvent()
		        let mediaEvent = Utility.getEvent();
		        this.debug('mediaEvent:' + mediaEvent);
		        if (!mediaEvent) {
		            return;
		        }

		        try {
		            mediaEvent = JSON.parse(mediaEvent);
		        } catch (e) {
		            mediaEvent = mediaEvent.substring(1, mediaEvent.length - 1);
		            const mediaEventParams = mediaEvent.split(",");
		            mediaEvent = {};
		            let tempParams = null;
		            for (let i = 0; i < mediaEventParams.length; i++) {
		                tempParams = mediaEventParams[i].split(":");
		                if (tempParams.length == 2) {
		                    mediaEvent[tempParams[0]] = tempParams[1];
		                }
		            }
		        }
		        // 有些key带有双引号
		        for (const key in mediaEvent) {
		            if (mediaEvent.hasOwnProperty(key)) {
		                mediaEvent[key.replace(/\"/g, "")] = mediaEvent[key];
		            }
		        }

		        const mediaEventType = mediaEvent.type.replace(/\"/g, "");
		        this.debug(mediaEventType);
		        this.currKeycode = mediaEventType;
		        switch (mediaEventType) {
		            case "EVENT_MEDIA_BEGINING":
		                {
		                    console.log("播放开始！");
		                    this.tips = '播放失败'
		                    return "EVENT_MEDIA_BEGINING";
		                    break;
		                }
		            case "EVENT_MEDIA_ERROR":
		                {
		                    console.log("播放失败，请检查网络！\t错误代码：" + mediaEvent.error_code);
		                    this.tips = '播放失败';
		                    return "EVENT_MEDIA_ERROR";
		                    break;
		                }
		            case "EVENT_MEDIA_END":
		                {
		                    console.log("播放结束！");
		                    this.tips = '播放结束';
		                    this.play();
		                    // clearInterval(this.secondTimer);
		                    return "EVENT_MEDIA_END";
		                    break;
		                }
		             case "EVENT_PLAYMODE_CHANGE":
		             	{
		             		this.tips = "播放正常";
		             		return "EVENT_PLAYMODE_CHANGE";
		             		break;
		             	}
		        }
		    } catch (e) {
		        this.debug(e);
		        console.log(e);
		    }
		},

		defineKeys() {
			this.keys.ROC_IRKEY_NUM0          = 48;    /*0x0030,  数字键0*/
			this.keys.ROC_IRKEY_NUM1          = 49;    /*0x0031,  数字键1*/
			this.keys.ROC_IRKEY_NUM2          = 50;   /*0x0032,  数字键2*/
			this.keys.ROC_IRKEY_NUM3          = 51;    /*0x0033,  数字键3*/
			this.keys.ROC_IRKEY_NUM4          = 52;    /*0x0034,  数字键4*/
			this.keys.ROC_IRKEY_NUM5          = 53;    /*0x0035,  数字键5*/
			this.keys.ROC_IRKEY_NUM6          = 54;    /*0x0036,  数字键6*/
			this.keys.ROC_IRKEY_NUM7          = 55;    /*0x0037,  数字键7*/
			this.keys.ROC_IRKEY_NUM8          = 56;    /*0x0038,  数字键8*/
			this.keys.ROC_IRKEY_NUM9          = 57;    /*0x0039,  数字键9*/
			this.keys.ROC_IRKEY_UP            = 38;    /*0x0026,  遥控器上的向上键*/
			this.keys.ROC_IRKEY_DOWN          = 40;    /*0x0028,  遥控器上的向下键*/
			this.keys.ROC_IRKEY_LEFT          = 37;    /*0x0025,  遥控器上的向左键*/
			this.keys.ROC_IRKEY_RIGHT         = 39;    /*0x0027,  遥控器上的向右键*/
			this.keys.ROC_IRKEY_SELECT        = 13;    /*0x000D,  遥控器上的确定键,即OK*/
			this.keys.ROC_IRKEY_BACK          = 8;		/*0x0280,  遥控器上的返回键,即TOGGLE*/
			this.keys.ROC_IRKEY_EXIT          = 1285;	/*0x0119,  取消/退出键,即CANCEL*/
			this.keys.ROC_IRKEY_CHANNEL_DOWN  = 257;   /*0x01AC,  遥控器上的频道减少键*/
			this.keys.ROC_IRKEY_CHANNEL_UP    = 258;   /*0x01AB,  遥控器上的频道增加键*/
			this.keys.ROC_IRKEY_PAGE_UP       = 33;    /*0x0021,  遥控器上的向上翻页键*/
			this.keys.ROC_IRKEY_PAGE_DOWN     = 34;    /*0x0022,  遥控器上的向下翻页键*/
			this.keys.ROC_IRKEY_VOLUME_UP     = 259;   /*0x01BF,  遥控器上的音量增大键*/
			this.keys.ROC_IRKEY_VOLUME_DOWN   = 260;  /*0x01C0,  遥控器上音量减小键*/
			this.keys.ROC_IRKEY_VOLUME_MUTE   = 261;   /*0x01C1,  遥控器上的静音键*/
			this.keys.ROC_IRKEY_TRACK         = 209;   /*0x0506,  遥控器上的声道键*/
			this.keys.ROC_IRKEY_RED           = 275;   /*0x0193,  代表红色按键 直播*/
			this.keys.ROC_IRKEY_GREEN         = 276;   /*0x0196,  代表绿色按键 回看*/
			this.keys.ROC_IRKEY_YELLOW        = 277;   /*0x0194,  代表黄色按键 点播*/
			this.keys.ROC_IRKEY_BLUE          = 278;   /*0x0195,  代表蓝色按键 信息*/
			this.keys.ROC_IRKEY_REWIND		  = 89;		/* 快退*/
			this.keys.ROC_IRKEY_FAST		  = 90;		/* 快进*/
			this.keys.ROC_IRKEY_STOP          = 1284;	/*遥控器上的停止键*/
			this.keys.ROC_IRKEY_PLAY          = 263;	/*0x0107,  遥控器上的播放暂停键*/
			this.keys.POC_IRKEY_INDEX			= 272;	/*首页*/
			//this.keys.ROC_IRKEY_POWER         =256;    /*0xFFFF,  遥控器上的指示关机与开机键----旧盒子程序20120612*/
			this.keys.ROC_IRKEY_POWER         = 1279;   /*0x04FF,  遥控器上的指示关机与开机键-----新盒子程序20120612*/
			this.keys.ROC_IRKEY_CIRCULATE     = 280;    /*遥控器上的循环键*/
			this.keys.ROC_IRKEY_LOCATION      = 271;    /*遥控器定位键*/
			this.keys.ROC_IRKEY_SET           = 285;    /*遥控器设置键*/

			this.keys.EVENT_UTILITY     	  = 0x0300; /*IPTV虚拟按键事件*/
		},

		// 毫秒转 2017/7/1 9:39:00
		dateFormat(millisecond) {

			const date = new Date(millisecond);

			let add0 = function (num) {
				num = parseInt(num, 10);

				return (
					(num >= 0 && num <= 9) ?
					'0' + num :
					num
				);	
			};

			return (''
				+ date.getFullYear() + '/'
				+ add0(date.getMonth() + 1) + '/'
				+ add0(date.getDate()) + ' '
				+ add0(date.getHours()) + ':'
				+ add0(date.getMinutes()) + ':'
				+ add0(date.getSeconds())
			);
		},

		secondFormat(seconds) {

			seconds = parseInt(seconds, 10);

			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds - hours * 3600) / 60);
			seconds = (seconds - hours * 3600 - minutes * 60);

			let add0 = function (num) {
				num = parseInt(num, 10);

				return (
					(num >= 0 && num <= 9) ?
					'0' + num :
					num
				);	
			};

			return (''
				+ add0(hours) + ':'
				+ add0(minutes) + ':'
				+ add0(seconds)
			);
		},

		// 测试重播功能
		testReplay() {
			// 测试url发生变化可以正常发起重新播放逻辑
			setTimeout(() => {
				this.playUrl = 'http://42.236.123.10/iptv/clist/vod/yanguiren.mp4';
				this.area = {
					type: 0,
					x: 100,
					y: 200,
					w: 300,
					h: 400
				};
			}, 20000);
		},

		updateInfo() {

			this.debug('mp-updateinfo');
			// 更新当前时间，播放结束，暂停或停止播放时清除计时器
			clearInterval(this.secondTimer);
			this.secondTimer = setInterval(() => {
				this.currTime = this.secondFormat(this.mp.getCurrentPlayTime()); 
				// this.dateFormat(parseInt(this.mp.getCurrentPlayTime(), 10));
			}, 1000);

			// 当前播放时间
			this.currTime = this.secondFormat(this.mp.getCurrentPlayTime());

			// 更新总时长
			this.totalTime = this.secondFormat(this.mp.getMediaDuration(), 10);

			// 更新播放状态
			this.status = this.mp.getStatus();
		},

		stop() {
			this.debug('mp-stop');
			if (!this.mp) { return; }
			const ins_id = this.mp.getNativePlayerInstanceID();
			clearInterval(this.secondTimer);
			if (this.isChannel) {
				this.mp.leaveChannel();
			} else {
				this.mp.stop();
			}
			this.status = 'stop';
			this.mp.releaseMediaPlayer(ins_id);
			this.mp = null;
			return this;
		},

		playFromStart() {
			this.debug('mp-playFromStart');
			this.mp.playFromStart();
			this.speed = 1;
			return this;
		},

		// 功能类似 seek
		playByTime(time) {
			
		},

		play(seekTime) {
			this.debug('mp-play');
			// 如果是从父组件触发，可能出现mp不存在，导致问题
			// 所以再加一层，就算指定了isReinit===true，
			// 但是mp===null时候还是需要重新初始化
			if (this.isReinit || !this.mp) {
				this.stop();
				this.init();
			} else {
				// 虽然不需要重新初始化播放器，但是也最好播放前将之前播放的视频停止掉
				this.mp.stop();
			}
			this.debug('playUrl:' + this.playUrl + ', mp:' + this.mp + ', seekTime:' + typeof(seekTime));

			// 支持频道播放
			if (this.isChannel) {
				this.mp.joinChannel(this.userChannelID);
			} else {
				this.setMediaStr();
				this.mp.setSingleMedia(this.mediaStr);

				if (typeof(seekTime) === 'undefined') {
					this.playFromStart();
				} else { // seek
					this.seek(seekTime);
				}
			}

			this.updateInfo();
		},

		pause() {
			this.debug('mp-pause');
			this.mp.pause();
			this.status = 'pause';
			this.speed = 0;
		},

		resume() {
			this.debug('mp-resume');
			this.mp.resume();
			this.status = 'play';
			this.speed = 1;
		},

		seek(time) {
			this.mp.playByTime(time);
			this.status = 'play';
			this.speed = 1;
		},

		fast() {
			this.speed = this.speed <= 0 ? 2 : 2 * this.speed;
			if (this.speed > 32) { this.resume(); return; }
			this.mp.fastForward(this.speed);
			this.status = 'fastforward';
		},

		rewind() {
			this.speed = this.speed >= 0 ? -2 : 2 * this.speed;
			if (this.speed < -32) { this.resume(); return; }
			this.mp.fastRewind(this.speed);
			this.status = 'fastrewind';
		},

		getMode() {
			let modeStr = this.mp.getPlaybackMode();
			let mode = null;
			let playMode = '';
			let speed = '';

			try {
				// 下面JSON字符串书写格式可能不规范，直接解析会报错
				mode = JSON.parse(modeStr);
			} catch(e) {
				mode = eval('(' + modeStr + ')');
			}

			this.playMode = mode.PlayMode;
			this.speed = mode.Speed;

			/*
				几种可能的值：
				1. '{"PlayMode":"Normal Play","Speed":"1x"}'
				2. '{"PlayMode":"Pause","Speed":"0x"}'
				3. '{"PlayMode":"Trickmode","Speed":"2/-2x"}'
			 */

		},

		volume() {
		    var args = arguments;
		    var vol = this.mp.getVolume();
		    if (args.length <= 0) {
		        return vol;
		    } else if (args[0] > 0) { // volume +
		        vol += 5; 
		    } else if (args[0] < 0) { // volume -
		        vol -= 5;
		    }

		    // 设置每次加减，按5递增递减
		    if (vol % 10 < 5) {
		        vol = vol - vol % 10;
		    } else if ( vol % 10 > 5 ) {
		        vol = vol - vol % 10 + 5;
		    }

		    vol = vol > 100 ? 100
		        : vol < 0 ? 0
		        : vol;

		    this.currVolume = vol;
		    this.isMute = 0;
		    this.mp.setVolume(vol);
		},

		volumeUp() {
		    this.volume(5);
		},

		volumeDown() {
		    this.volume(-5);
		},

		setMute(flag) {
			this.isMute = !this.isMute;
		    this.mp.setMuteFlag(this.isMute);
		},

		eventHandler(keycode) {

			this.currKeycode = keycode;
			switch (keycode) {
			    case 8: 
			        this.$dispatch('estop');
			        history.back();
			        return false; 
			    break;
			    case 768: this.$dispatch('event768'); return false; break;
			    case 33:    // 上页键：左边播放（TEST）
			        this.$dispatch('echangearea', {
			            type: 1, x: 0, y: 0, w: 0, h: 0
			        });
			        return false;
			    break;
			    case 34:    // 下页键：右边播放（TEST）
			        this.$dispatch('echangearea', {
			            type: 0, x: 300, y: 200, w: 480, h: 360
			        });
			        return false;
			    break;
			    case 259:   // vol up
			        this.$dispatch('evolume', 5);
			        return false;
			    break;
			    case 260:   // vol down
			        this.$dispatch('evolume', -5);
			        return false;
			    case 261:   // mute
			        this.$dispatch('evolume', 0);
			        return false;
			    break;
			    case 263: 	// pause or play
			    	this.$dispatch(this.status === 'play' ? 'epause' : 'eresume');
			    	return false;
			    break;
			    case 39:
			    case 264: 	// fastforward
			    	this.$dispatch('efastforward');
			    	return false;
			    break;
			    case 37:
			    case 265: 	// fastrewind
			    	this.$dispatch('efastrewind');
			    	return false;
			    break;
			    default: return true; break;
			}
		}
	},

	events: {

		// 播放地址发生改变，重新播放
		echangeurl(obj) {
			/*
				该事件可能有几种形式：
				1. obj是字符串，表示播放地址
				2. obj是对象，必须包含 playUrl
				3. obj是对象，包含频道号 isChannel 和 userChannelID，但不能有playUrl
				4. 如果播放的是音乐，或者只想播放声音不显示画面，那就必须包含 area，或者设置 isMusic 为 true

				原则：有playUrl优先使用，否则使用频道号播放
			 */

			let tmpObj = {
				isReinit: true,
				isMusic: true,
			};

			if (this.type(obj) === 'string') {
				tmpObj.playUrl = obj;
			} else if (this.type(obj) === 'object') {
				tmpObj = obj;
			}

			this.config(tmpObj).play();
		},

		// 播放相关的按键和消息
		ehandler(keycode) {
			this.eventHandler(keycode);
		},

		// 改变播放位置和大小事件
		echangearea(areaObj) {
			this.debug('area:' + JSON.stringify(areaObj));
			this.setArea(areaObj);
		},

		event768() {
			this.debug('vEvent in');
			this.virtualKeyHandler();
		},

		eplay() {
			this.debug('mp-eplay');
			this.play();
		},

		eplayfromstart() {
			this.debug('mp-eplayfromstart');
			this.playFromStart();
		},

		estop() {
			this.debug('mp-estop');
			this.stop();
		},

		epause() {
			this.debug('mp-epause');
			this.pause();
		},

		eresume() {
			this.debug('mp-resume');
			this.resume();
		},

		eseek(time) {
			this.seek(time);
		},

		eclose() {
			clearInterval(this.secondTimer);
		},

		erelease() {
			const ins_id = this.mp.getNativePlayerInstanceID();
			this.mp.releaseMediaPlayer(ins_id);
		},

		// 快进
		efastforward() {
			this.fast();
		},

		// 快退
		efastrewind() {
			this.rewind();
		},

		evolume(vol) {
			if (vol < 0) { this.volumeDown(); }
			else if (vol === 0) { this.setMute(1); }
			else { this.volumeUp(); }
		},
	},

	watch: {
		"playUrl": function (newV, oldV) {
			this.debug('newUrl:' + newV);
			// url 发生变化需要重新播放
			// this.play();
		},

		"area": function (newV, oldV) {
			this.debug('watch area:' + JSON.stringify(newV));
			if (this.mp) {
				let type = newV.type;
				if (type === 1) {
					this.mp.setVideoDisplayMode(1);
				} else {
					this.mp.setVideoDisplayMode(0);
					this.mp.setVideoDisplayArea(newV.x, newV.y, newV.w, newV.h);
				}

				this.mp.refreshVideoDisplay();
			}
		},

		"userChannelID": function (newV, oldV) {
			// this.play();
		},
	},

	components: {},

	computed: {
		// mediaStr() {
		// 	return 	''
		// 	+ '[{mediaUrl:"' + this.playUrl + '",'
		// 	+ 'mediaCode: "jsoncode1",'
		// 	+ 'mediaType:2,'
		// 	+ 'audioType:1,'
		// 	+ 'videoType:1,'
		// 	+ 'streamType:1,'
		// 	+ 'drmType:1,'
		// 	+ 'fingerPrint:0,'
		// 	+ 'copyProtection:1,'
		// 	+ 'allowTrickmode:1,'
		// 	+ 'startTime:0,'
		// 	+ 'endTime:20000,'
		// 	+ 'entryID:"jsonentry1"}]';
		// }
	},

	beforeDestroy() {
		this.stop();
	},

	ready() {
		this.debug('mp-ready');
		const _this = this;
		// this.config({
		// 	playUrl: _this.playUrl,
		// 	area: { type:0, x: 100, y: 200, w: 800, h: 400 },
		// 	isChannel: false,
		// }).play();
	},
};
</script>