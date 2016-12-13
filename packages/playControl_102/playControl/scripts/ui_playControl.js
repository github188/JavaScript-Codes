

var pc = (function () {

        // 内部全局命名空间
    var UIPC = {

        // 系统时间计时器
        sysTimeTimer: null,

       

        /*
            数据类型：
            0 - 直播列表数据
            1 - 回看列表数据
            2 - 回看日期列表数据
            3 - 回看日期下的节目列表数据

            在使用前先设置数据类型，再显示列表
         */
        dataType: 0,

        // 列表显示行数，默认显示8行
        listLines: 8,

        // 列表焦点行
        currTblFocusLine: 0,

        // 列表第一行数据在数据数组中的索引 
        tblFirstLineIdxInData: 0,

        focusDiv: {

            id: 'lc_focus',
            // 焦点框元素顶部偏移量
            topOffset: -16
        },

        progress: {

            /*
                播放类型：LiveTV-0, TSTV-1, TVOD-2, VOD-3
                可根据该类型来决定状态控制栏显示的内容
             */
            playType: 0,

            titles: {
                tvod: '回看播放',
                tstv: '时移播放'
            },

            ids: {
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

            icons: {

                fast: 'images/ctrl_fast.png',
                tvod: 'images/icon_hk.png',
                tvodBig: 'images/icon_hk_big.png',
                tvodBtn: 'images/icon_hk_btn.png',
                goTvod: 'images/left_2tvod.png',
                tstv: 'images/icon_sy.png',
                tstvBig: 'images/icon_sy_big.png',
                goTstv: 'images/enter_tstv.png',
                exitTvod: 'images/exit_tvod.png',
                exitTstv: 'images/exit_tstv.png',
                chanList: 'images/ch_list.png',
                playPause: 'images/play_pause.png'
                
            }
        },

        plist: {

        },

        // ids
        ids: {
            

            // 频道/节目焦点框
            plistProgFocus: 'lc_focus',
            plistDateFocus: ''
        },

        icons: {
            
        },
    };

    var tools = (function () {

        var o = {};

        o.show = function ( id ) {
            
            if ( typeof id !== 'string' ) {
                return false;
            }

            var display = $( id ).style.display,
                visible = $( id ).style.visibility;

            // 如果未定义的属性，结果为空，display和visibility不应该同时存在
            if ( display !== '' ) {

                $( id ).style.display = 'block';
            } else if ( visible !== '' ) {

                $( id ).style.visibility = 'visible';
            }

            return true;
        }

        o.hide = function ( id ) {

            if ( typeof id !== 'string' ) {
                return false;
            } 

            var display = $( id ).style.display,
                visible = $( id ).style.visibility;

            // 如果未定义的属性，结果为空，display和visibility不应该同时存在
            if ( display !== '' ) {

                $( id ).style.display = 'none';
            } else if ( visible !== '' ) {

                $( id ).style.visibility = 'hidden';
            }

            return true;
        };

        o.firstTextNode = function ( parent ) {

            if ( !parent ) {
                return null;
            }

            var childs = parent.childNodes,
                i = 0,
                len = childs.length;

            for ( ; i < len; i++ ) {

                // 只要第一个
                if ( isTextNode( childs[ i ] ) ) {

                    return childs[ i ];
                }
            }

            // not found
            return null;
        };


        return o;

    }());

    var progress = (function ( pb ) {

        var o = {};

        // 当前进度条 id
        o.pid = '';

        // 系统时间计时器
        o.timer = null;

        // 播放类型
        o.type = pb.playType;

        // 节目标题
        o.titles = pb.titles;

        // 播控相关元素 id
        o.ids = pb.ids;

        // 播控相关的元素图片路径
        o.icons = pb.icons;

        o.init = function ( type ) {

            o.type = type;

            // 启动系统时间
            // o.timing();

            o.show();
        };

        // 系统时间
        o.timing = function () {

            var that    = this,
                d       = new Date(),
                month   = d.getMonth() + 1,
                date    = d.getDate(),
                hour    = d.getHours(),
                minute  = d.getMinutes();

            month   = month < 10 ? '0' + month : '' + month;
            date    = date < 10 ? '0' + date : '' + date;
            hour    = hour < 10 ? '0' + hour : '' + hour;
            minute  = minute < 10 ? '0' + minute : '' + minute;

            // 更新时间
            $( that.ids.date ).innerHTML = month + '月' + date + '日';
            $( that.ids.time ).innerHTML = hour + ':' + minute;

            clearTimeout( that.timer );
            that.timer = setTimeout( function () {

                o.timing();

            }, 1000 );
        };

        o.show = function () {

            var that    = this,
                type    = that.type,
                ids     = that.ids,
                titles  = that.titles,
                icons   = that.icons,
                stIcon  = '';

            that.update();

            if ( type === 0 || type === 3 || type === 4 ) { // liveTV 或者 直播暂停 或 直播回看

                tools.show( ids.chan );
                tools.hide( ids.tvodTstv );

                // 类型图标
                $( ids.chanIcon ).src = type === 4 ? icons.tvod : icons.tstv;

            } else if ( type === 1 || type === 2 ) { // TSTV 或 TVOD

                // title 需要修改
                $( ids.tvodTstvProgTitle ).innerHTML = ( type === 1 ? titles.tstv : titles.tvod );

                // 类型图标
                $( ids.tvodTstvStatus ).src = type === 1 ? icons.tstv : icons.tvod;

                tools.show( ids.tvodTstv );
                tools.hide( ids.chan );
            }
        };

        o.update = function () {

            var that        = this,
                ids         = that.ids,
                icons       = that.icons,
                leftIcon    = '',
                rightIcon   = '';

            switch ( that.type ) {

                case 0:     // LiveTV
                    leftIcon    = '';
                    rightIcon   = icons.chanList;
                    o.pid       = ids.chanProcess;
                    break;
                case 1:     // TSTV
                    leftIcon    = icons.exitTstv;
                    rightIcon   = icons.chanList;
                    o.pid       = ids.tvodTstvProcess;
                    break;
                case 2:     // TVOD
                    leftIcon    = icons.exitTvod;
                    rightIcon   = icons.playPause;
                    o.pid       = ids.tvodTstvProcess;
                    break;
                case 3:     // 直播暂停状态
                    leftIcon    = icons.goTstv;
                    rightIcon   = icons.chanList;
                    o.pid       = ids.chanProcess;
                    break;
                case 4:     // 直播回看状态
                    leftIcon    = icons.fast;
                    rightIcon   = icons.chanList;
                    o.pid       = ids.chanProcess;
                    break;

                // no default
            }

            if ( leftIcon !== '' ) {

                $( ids.statusL ).parentNode.style.display = 'block';
                $( ids.statusL ).src = leftIcon;
            }

            if ( rightIcon !== '' ) {

                $( ids.statusR ).parentNode.style.display = 'block';
                $( ids.statusR ).src = rightIcon;
            }
        };

        o.updateAd = function ( image ) {
            
            $( o.ids.ad ).src = image;
        }

        return o;

    }( UIPC.progress ));


    var plist = (function ( pl ) {

        var o = {};

        o.rows = 8;

        o.flag = true;

        // 0 - channel, 1 - tvod
        o.type = 0;

        // 日期列表焦点索引
        o.dateFocus = 0;

        // 频道列表或节目列表焦点索引
        o.chanFocus = 0;

        o.line = null;

        o.offsetX = 172;

        o.first = true;

        // 表的行 id 前缀，表创建完之后更新
        o.prefix = {

            dateTr: '',
            progTr: '',
            chanTr: ''
        };

        o.attrs = {

            date: 'date',
            prog: 'prog',
            chan: 'chan',
            tvod: 'tvod'
        };

        o.ids = {

            // 播放列表表格 ID
            list: 'list',
            container: 'l_container',
            tblDate: 'lc_date',
            tblProg: 'lc_progs',
            tblChan: 'lc_progs',
            chanFocus: 'lc_focus'
        };

        /*
            创建表格用的行属性字符串

            表生成器需要用到
         */
        o.tr = {

            // 日期列表行
            date: 'tr&{"prefix":"date_list","height":"80px"}+' +
                  'td&{"width":"172px","background":"url(images/dlist_bg.png) no-repeat center"}',

            // 节目列表行
            prog: 'tr&{"prefix":"prog_list","height":"80px"}+' + 
                  'td&{"width":"85px","text-align":"center"}+' + 
                  'td&{"width":"221px"}',

            // 频道列表行
            chan: 'tr&{"prefix":"chan_list","height":"80px"}+' +
                  'td&{"width":"245px","fontSize":"30px"}+' + 
                  'td&{"width":"245px"}$' +
                  'span&{"fontSize":"20px","color":"#c6d2dd"}'
        };

        o.icons = {

            dateFocus: 'images/dlist_bg_focus.png'
        };

        o.init = function ( type ) {

            o.type = type;

            // 初始化表中行的 id 前缀
            o.prefixInit();

            // 显示表
            o.show( 0 );
        };

        /**
         * 表格显示，初始化时 start === 0, 更新时根据需要显示对应的数据
         *
         * 这个只负责初始化时显示，即：触发列表时显示，更新列表，请使用'update'
         *
         * 直接使用，同样可以达到显示和更新的效果，但更新依旧不建议使用
         * 
         * @param  {Number} start 数据数组中的索引值
         * @return {[type]}       [description]
         */
        o.show = function ( start ) {

            var type = o.type;

            // type: 0 - channel, 1 - tvod
            if ( type === o.attrs.chan ) {

                /* ------------- 频道表 --------------- */

                // 创建频道列表
                $( o.ids.tblChan ).appendChild( o.create( o.attrs.chan ) );

                // 显示表
                showChannelList( start );

            } else if ( type === o.attrs.tvod ) {

                /* ------------- 日期表 --------------- */

                // 创建日期列表
                $( o.ids.tblDate ).appendChild( o.create( o.attrs.date ) );

                // 显示日期列表
                showTvodDateList( start );

                /* ------------- 节目表 --------------- */

                // 创建节目表
                $( o.ids.tblProg ).appendChild( o.create( o.attrs.prog ) );

                // 显示节目表
                showTvodProgList( start );
            }
        };

        o.create = function ( type ) {

            var flag = true,
                attrs = o.attrs;

            if ( typeof type !== 'string' ) {

                return null;
            }

            // 日期表不需要分割线
            if ( type === attrs.date ) {

                flag = false;
            }

            return new TableGenerator().init( o.tr[ type ], o.rows, flag, o.line );
        };

        o.table = function ( start, type ) {

            var data, tr, td, prog, span,
                dataLen = 0, lines = 0, i = 0,
                start   = start || 0,

                getData = null,
                ids = [], id = '', prefix = '',

                attrs   = o.attrs;

            if ( type === attrs.date ) { // date

                id      = o.ids.tblDate;
                prefix  = o.prefix.dateTr;

            } else if ( type === attrs.prog ) { // prog

                id      = o.ids.tblProg;
                prefix  = o.prefix.progTr;

            } else if ( type === attrs.chan ) { // channel

                id      = o.ids.tblChan;
                prefix  = o.prefix.chanTr;
            }

            console.log( 'id = ' + id + ', prefix = ' + prefix );

            // 获取更新的数据
            data    = o.data( type );
            dataLen = data.length;

            if ( !data || dataLen <= 0 ) {

                debug( 'get data error, type = ' + type + ', data = ' + data );
                return;
            }

            if ( type === attrs.prog ) {

                data    = data[ o.dateFocus ];

                dataLen = data.length;
            }

            // 到这里，表示表格已经创建完成了，可获取实际行数
            lines = $( id ).getElementsByTagName( 'tr' ).length;

            for ( ; i < lines; i++ ) {

                tr = $( prefix + i );

                // 数据长不足表格行数时
                if ( i < dataLen ) {

                    tds     = tr.getElementsByTagName( 'td' );
                    prog    = data[ start + i ];

                    if ( type === attrs.date ) { // date

                        // <tr><td>12/7</td></tr>
                        tds[0].innerText = prog;  // 日期数据格式是数组，所以直接使用

                    } else if ( type === attrs.prog ) { // prog


                        // <tr><td>12:20</td><td>景秀未央</td></tr>
                        // 节目数据格式是数组中的数组 [ [{},{}, [{},{}] ]
                        tds[0].innerText = prog.time;
                        tds[1].innerText = prog.name;

                    } else if ( type === attrs.chan ) { // channel

                        // <tr><td>012</td><td>中央一套<span>黄金档：潘金莲</span></td></tr>
                        tds[0].innerText = prog.no;
                        tds[1].innerText = prog.name;

                        span = tds[1].getElementsByTagName( 'span' );
                        span.innerText = prog.prog;
                    }
                }
            }
        };

        o.update = function ( start ) {

            var type = o.type;

            if ( type === o.attrs.chan ) { // 频道

                showChannelList( start );

            } else if ( type === o.attrs.tvod ) { // 回看

                showTvodList( start );
            }
        }

        o.data = function ( type ) {

            var attrs = o.attrs,
                data  = null;

            switch ( type ) {

                case attrs.tvod: // 回看

                    data = tvodListData;
                    break;
                case attrs.date: // 日期

                    data = getFromTvodData( type );
                    break;
                case attrs.prog: // 节目

                    data = getFromTvodData( type ); 
                    break; 
                case attrs.chan: // 频道

                    data = channelListData;
                    break;

                    // no default
            }

            return data;
        };

        o.prefixInit = function () {

            o.prefix.dateTr = o.findPrefix( o.tr.date );
            o.prefix.progTr = o.findPrefix( o.tr.prog );
            o.prefix.chanTr = o.findPrefix( o.tr.chan );
        };

        o.findPrefix = function ( str ) {

            var match = str.match(/\"prefix\"\:\"\w+\"/)[0];

            return match.split( ':' )[ 1 ].replace( /\"/g, "" );
        };

        // 回看和频道列表切换时位移改变，主要针对频道列表
        o.changeChanTblOffsetX = function ( direction ) {

            var tblId       = o.ids.tblChan,
                focusId     = o.ids.chanFocus,
                focusLeft   = $( focusId ).style.left,
                tblLeft     = $( o.ids.tblChan ).style.left;

            // 第一次显示时改变，之后不发生改变
            if ( !o.first ) {

                return;
            }

            tblLeft     = parseInt( $( tblId ).style.left.replace( /px/, '' ), 10 );
            focusLeft   = parseInt( $( focusId ).style.left.replace( /px/, '' ), 10 );

            $( tblId ).style.left   = ( tblLeft + o.offsetX * direction ) + 'px';
            $( focusId ).style.left = ( focusLeft + o.offsetX * direction ) + 'px';

            o.first = false;
        };

        /* -------------------- 以下为私有方法 -------------------- */

        // 从tvod中获取日期和节目数据
        function getFromTvodData( name ) {

            var tvodData    = null,
                data        = null,
                result      = [],
                i = 0, len  = 0;

            if ( typeof name !== 'string' || name === '' ) {

                debug( 'get data from tvod error' );
                return null;
            }

            tvodData = o.data( o.attrs.tvod );

            len = tvodData.length;

            for ( ; i < len; i++ ) {

                data = tvodData[i];

                if ( data.hasOwnProperty( name ) ) {

                    result.push( data[ name ] );
                } else {

                    debug( 'get data from tvod error: attr not found' );
                }
            }

            return result;
        };

        // 显示回看列表，更新列表时使用
        function showTvodList( start ) {
            
            // 日期
            showTvodDateList( start );

            // 节目
            showTvodProgList( start );
        }

        // 显示频道列表, start 表示要是在列表上的数据在数据中的索引
        function showChannelList( start ) {

            /* ------------- 频道表 --------------- */

            // 填充频道数据
            o.table( start, o.attrs.chan );

            // 显示列表
            $( o.ids.tblChan ).style.display = 'block';

            // 显示焦点框
            $( o.ids.chanFocus ).style.display = 'block';

            // 偏移
            o.changeChanTblOffsetX( -1 );
        }

        // 频道列表行获取焦点
        function chanTrGetFocus( id ) {
            

        }

        // 频道列表行失去焦点
        function chanTrLoseFocus( id ) {
            
        }

        // 显示回看列表，包括日期和节目
        function showTvodDateList( start ) {

            /* ------------- 日期表 --------------- */

            var prefix  = o.prefix.dateTr,
                id      = '';

            // 日期表数据
            o.table( start, o.attrs.date );

            // 显示日期表
            $( o.ids.tblDate ).style.display = 'block';

            id = prefix + o.dateFocus;

            debug( prefix )

            dateTrGetFocus( id );
        }

        // 日期行获取焦点
        function dateTrGetFocus( id ) {
            
            $( id ).style.background = 'url(' + o.icons.dateFocus + ') no-repeat center';

            $( id ).style.color = '#fff';
        }

        // 日期行失去焦点
        function dateTrLostFocus( id ) {
            
            $( id ).style.background = '';

            $( id ).style.color = '#727374';
        }

        // 显示回看节目表
        function showTvodProgList( start ) {

            /* ------------- 节目表 --------------- */

            debug( o.ids.tblProg )

            // 节目表数据
            o.table( start, o.attrs.prog );
            // 显示节目表
            $( o.ids.tblProg ).style.display = 'block';
            // 显示焦点框
            $( o.ids.chanFocus ).style.display = 'block';
        }

        return o;

    }( UIPC.plist ));

    /****************************** 小工具 START ******************************/


    function isArray( arr ) {
        
        return Object.prototype.toString.call( arr ) === '[object Array]';
    }

    function isObject( obj ) {
        
        return Object.prototype.toString.call( obj ) === '[object Object]';
    }
    function isTextNode( node ) {
        
        return Object.prototype.toString.call( node ) === '[object Text]'; 
    }

    // 判断 div 实现显示
    function isDivShow( id ) {
        
        if ( typeof id !== 'string' ) {
            return false;
        }

        var e = $( id ),
            v = e.style.visibility,
            d = e.style.display;

        if ( v !== '' ) {

            return v !== 'hidden';
        }

        if ( d !== '' ) {

            return d !== 'none';
        }
    }

    /****************************** 小工具 END ******************************/

    function init( type ) {
        
        progress.init( type );
    }

    return {

        init: init,

        tblInit: plist.init,

        tblUpdate: plist.update
    };

}());


// 按键处理
// window.document.onkeydown = pc.eventHandler;

window.onload = function () {

    var table = null;

    // 初始化播控页面
    pc.init( 1 );

    pc.tblInit( 'tvod' );

    // 设置列表数据类型
    // pc.setDataType( 0 );
};

function $( id ) {

    return document.getElementById( id );
}

function debug( str ) {
    console.log( str );
}