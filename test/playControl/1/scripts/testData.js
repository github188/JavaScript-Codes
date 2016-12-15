
    // 当前进度条 id
    var pcPid = '',

        // 系统时间计时器
        pcTimer = null,

        /*
            播放类型，
            直播：'LiveTV'
            时移：'TSTV'
            回看：'TVOD'
            直播时移状态：'LiveTSTV'
            直播回看状态：'LiveTVOD'
         */
        pcType = 'LiveTV',

        // 当前播放的频道 id 
        pcCurrChannelId = -1,

        // 当前频道是否支持时移
        // [ 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1 ]
        pcCurrChannelSupportTSTV = 0,

        /*
            播放状态：play, pause, fastforward, fastrewind, stop
         */
        pcStatus = 'play',

        pcSpeed = 0,

        // 进度条显示标识
        pcIsProgressShow = false,

        // 节目标题
        pcTitles = {

            tvod: '回看播放',
            tstv: '时移播放'
        },

        // 播控相关元素 id
        pcIds = {

            progress: 'pf',

            // 时间区元素 ID
            date: 'pfg_date',
            time: 'pfg_time',

            // 广告元素 ID
            adWrap: 'ad_wrap', // 广告外层div
            ad: 'ad',

            // 播控状态区元素 ID
            status: 'pfg_status',
            statusL: 'pfgs_left',
            statusR: 'pfgs_right',

            // 回看时移进度条区元素 id
            tvodTstv: 'pfg_tvodTstv',
            tvodTstvStart: 'pfgt_start',
            tvodTstvEnd: 'pfgt_end',
            tvodTstvStatus: 'pfgt_status',
            tvodTstvProgTitle: 'pfgt_programTitle',
            tvodTstvProgName: 'pfgt_programName',
            tvodTstvProgTime: 'pfgt_programTime',
            tvodTstvProcess: 'pfgt_process',
            tvodTstvProcessWrap: 'pfgt_process_wrap',
            tvodTstvProcessL: 'pfgt_processL',
            tvodTstvProcessR: 'pfgt_processR',

            // 直播进度条区元素 ID
            chan: 'pf_live',
            chanNo: 'pfl_chanNo',
            chanName: 'pfl_chanName',
            chanIcon: 'pfl_channIcon',
            chanProgTime: 'pfl_progTime',
            chanProgName: 'pfl_progName',
            chanNextProgTime: 'pfl_nextProgTime',
            chanNextProgName: 'pfl_nextProgName',
            chanProcess: 'pfl_process'
        },

        // 播控相关的元素图片路径
        pcIcons = {

            fast: 'images2/ctrl_fast.png',
            tvod: 'images2/icon_hk.png',
            tvodBig: 'images2/icon_hk_big.png',
            tvodBtn: 'images2/icon_hk_btn.png',
            goTvod: 'images2/left_2tvod.png',
            tstv: 'images2/icon_sy.png',
            tstvBig: 'images2/icon_sy_big.png',
            goTstv: 'images2/enter_tstv.png',
            exitTvod: 'images2/exit_tvod.png',
            exitTstv: 'images2/exit_tstv.png',
            chanList: 'images2/ch_list.png',
            playPause: 'images2/play_pause.png',
            play: 'images2/icon_play.png'
            
        },

        // 列表
        pcChanFocus     = 0,
        pcLines         = 8,
        pcFocusTop      = -16,
        pcFocusId       = 'lc_focus',
        pcPrefix        = 'chanList',
        pcIsChanListShow = false,
        pcChanLines     = 0,
        pcDataIndex     = 0,
        pcTotalPages    = 0,
        pcCurrPage      = 0,

        // 所有频道信息
        pcChannels          = null,

        // 当前频道信息
        pcCurrChannelInfo   = null,
        pcCurrChannelIndex  = -1,

        // 当前节目时长，默认 1 小时
        pcCurrProgDuration = 3600,

        pcProgressTotalWidth = 0,

        pcProgressUpdateTimer = 0;





/**************************** 以下为测试用假数据 ***************************/


var testChannels = [

    { ChannelID: '1', ChannelName: "CCTV1", UserChannelID: "001", TimeShift: "0" },
    { ChannelID: '2', ChannelName: "CCTV2", UserChannelID: "002", TimeShift: "1" },
    { ChannelID: '3', ChannelName: "CCTV3", UserChannelID: "003", TimeShift: "1" },
    { ChannelID: '4', ChannelName: "CCTV4", UserChannelID: "004", TimeShift: "1" },
    { ChannelID: '5', ChannelName: "CCTV5", UserChannelID: "005", TimeShift: "0" },
    { ChannelID: '6', ChannelName: "CCTV6", UserChannelID: "006", TimeShift: "0" },
    { ChannelID: '7', ChannelName: "CCTV7", UserChannelID: "007", TimeShift: "1" },
    { ChannelID: '8', ChannelName: "CCTV8", UserChannelID: "008", TimeShift: "0" },
    { ChannelID: '9', ChannelName: "CCTV9", UserChannelID: "009", TimeShift: "1" },
    { ChannelID: '10', ChannelName: "CCTV10", UserChannelID: "010", TimeShift: "0" },
    { ChannelID: '11', ChannelName: "CCTV11", UserChannelID: "011", TimeShift: "1" },
    { ChannelID: '12', ChannelName: "CCTV12", UserChannelID: "012", TimeShift: "0" },
    { ChannelID: '13', ChannelName: "CCTV13", UserChannelID: "013", TimeShift: "0" }
    
];