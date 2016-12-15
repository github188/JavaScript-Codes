

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
                播放类型：LiveTV, TSTV, TVOD, VOD, 
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
                
            }
        },

        // ids
        ids: {
            
            // 频道/节目焦点框
            plistProgFocus: 'lc_focus',
            plistDateFocus: ''
        }
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

        /*
            播放类型，
            直播：'LiveTV'
            时移：'TSTV'
            回看：'TVOD'
            直播时移状态：'LiveTSTV'
            直播回看状态：'LiveTVOD'
         */
        o.type = 'LiveTV';

        /*
            播放状态：play, pause, fastforward, fastrewind, stop
         */
        o.status = 'play';

        // 节目标题
        o.titles = pb.titles;

        // 播控相关元素 id
        o.ids = pb.ids;

        // 播控相关的元素图片路径
        o.icons = pb.icons;

        o.init = function ( type ) {

            o.type = type;

            // 启动系统时间
            o.timing();

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
                stIcon  = '',
                src     = '';

            that.update();

            if ( type === 'LiveTV' || type === 'LiveTSTV' || type === 'LiveTVOD' ) { // liveTV 或者 直播暂停 或 直播回看

                tools.show( ids.chan );
                tools.hide( ids.tvodTstv );

                if ( type === 'LiveTV' ) {

                    src = icons.play;
                } else if ( type === 'LiveTSTV' ) {

                    src = icons.tstv;
                } else if ( type === 'LiveTVOD' ) {

                    src = icons.tvod;
                }

                // 类型图标
                $( ids.chanIcon ).src = src;

            } else if ( type === 'TSTV' || type === 'TVOD' ) { // TSTV 或 TVOD

                // title 需要修改
                $( ids.tvodTstvProgTitle ).innerHTML = ( type === 'TSTV' ? titles.tstv : titles.tvod );

                // 类型图标
                $( ids.tvodTstvStatus ).src = type === 'TSTV' ? icons.tstv : icons.tvod;

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

                case 'LiveTV':     // LiveTV
                    leftIcon    = '';
                    rightIcon   = icons.chanList;
                    o.pid       = ids.chanProcess;
                    break;
                case 'TSTV':     // TSTV
                    leftIcon    = icons.exitTstv;
                    rightIcon   = icons.chanList;
                    o.pid       = ids.tvodTstvProcess;
                    break;
                case 'TVOD':     // TVOD
                    leftIcon    = icons.exitTvod;
                    rightIcon   = icons.playPause;
                    o.pid       = ids.tvodTstvProcess;
                    break;
                case 'LiveTSTV':     // 直播暂停状态
                    leftIcon    = icons.goTstv;
                    rightIcon   = icons.chanList;
                    o.pid       = ids.chanProcess;
                    break;
                case 'LiveTVOD':     // 直播回看状态
                    leftIcon    = icons.fast;
                    rightIcon   = icons.chanList;
                    o.pid       = ids.chanProcess;
                    break;

                // no default
            }

            debug( 'left: ' + leftIcon + ', rightIcon = ' + rightIcon );

            if ( leftIcon !== '' ) {

                $( ids.statusL ).parentNode.style.display = 'block';
                $( ids.statusL ).src = leftIcon;
            } else {

                $( ids.statusL ).parentNode.style.display = 'none';
            }

            if ( rightIcon !== '' ) {

                $( ids.statusR ).parentNode.style.display = 'block';
                $( ids.statusR ).src = rightIcon;
            }
        };

        o.updateAd = function ( image ) {
            
            $( o.ids.ad ).src = image;
        }

        o.pauseOrPlay = function () {

            if ( o.type === 'LiveTV' && o.status === 'play' ) { // 直播暂停

                o.type = 'LiveTSTV';

                // 要暂停播放
                pause();

            } else if ( o.type === 'LiveTSTV' ) { // 直播时移状态，再按播放进入时移

                o.type = 'TSTV';

                play();
            } else if ( o.type === 'LiveTVOD' ) { // 直播回看状态，再按播放进入回看

                // 先不处理
                
                o.type = 'TVOD';
            } else if ( 'TSTV' || 'TVOD' ) { // 时移暂停，暂停或播放

                if ( o.status === 'play' ) {

                    pause();
                } else if ( o.status === 'pause' ) {

                    play();
                }
            }

            o.show();
        };

        o.back = function () {

            var channelID = 0; // test

            // 统统返回到直播
            o.type = 'LiveTV';

            o.show();

            playChannel();
        };


        o.eventHandler = function ( event ) {

            var keycode = event.which ? event.which : event.keycoe;

            debug( 'eh ---------------- keycode = ' + keycode );

            switch ( keycode ) {
                case 37:
                    
                    return false;
                    break;
                case 39:
                    return false;
                    break;
                // for test start
                case 96: // 0  暂停

                    o.pauseOrPlay();
                    return false;
                    break;
                case 97: // 1

                    o.back();
                    return false;
                    break;
                case 98: // 2
                    return false;
                    break; 
                // for test end
                default:
                    return true;    
                    break;
            }
        }

        /* ---------------------- 私有方法 ----------------------- */

        function pause() {
            
            o.status = 'pause';

            debug( ' ------------- pause' );
        }

        function play() {
            
            o.status = 'play';

            debug( ' ------------- play' );
        }

        function playChannel( channelID ) {
            
            o.status = 'play';

            debug( ' ------------- playChannel' );
        }

        return o;

    }( UIPC.progress ));

    // 播放列表
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

        o.progFocus = 0;

        o.line = null;

        o.offsetX = 172;

        o.focusTop = -16;

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
            chanFocus: 'lc_focus',
            progFocus: 'lc_focus'
        };

        o.icons = {

            dateFocus: '../images2/dlist_bg_focus.png'
        };

        o.init = function ( type ) {

            o.type = type;


            // o.initData();

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

            debug(type)

            // type: 0 - channel, 1 - tvod
            if ( type === o.attrs.chan ) {

                /* ------------- 频道表 --------------- */

                // 创建频道列表
                $( o.ids.tblChan ).innerHTML = o.create( o.attrs.chan );
                // $( o.ids.tblChan ).appendChild( o.create( o.attrs.chan ) );

                // 显示表
                showChannelList( start );

            } else if ( type === o.attrs.tvod ) {

                /* ------------- 日期表 --------------- */

                // 创建日期列表
                $( o.ids.tblDate ).innerHTML = o.create( o.attrs.date );
                // $( o.ids.tblDate ).appendChild( o.create( o.attrs.date ) );

                // 显示日期列表
                showTvodDateList( start );

                /* ------------- 节目表 --------------- */

                // 创建节目表
                $( o.ids.tblProg ).innerHTML = o.create( o.attrs.prog );
                // $( o.ids.tblProg ).appendChild( o.create( o.attrs.prog ) );

                // 显示节目表
                showTvodProgList( start );
            }
        };

        o.create = function ( type ) {

            var i = 0,
                len = o.rows,
                content = '',
                prefix = '';

            if ( type === o.attrs.date ) {

                prefix  = o.prefix.dateTr;
            } else if ( type === o.attrs.prog ) {

                prefix = o.prefix.progTr;
            } else if ( type === o.attrs.chan ) {

                prefix = o.prefix.chanTr;
            }

            for ( ; i < len; i++ ) {

                if ( type === o.attrs.date ) {

                    content += '<tr id=' + prefix + i + ' style="height:80px;">'
                                + '<td style="width:172px;'
                                + 'background:url(images2/dlist_bg.png) no-repeat center"></td>'
                            + '</tr>';

                } else if ( type === o.attrs.prog ) {
            
                    content += '<tr id=' + prefix + i + ' style="height:80px;">'
                                + '<td style="width:85px;text-align:center;"></td>'
                                + '<td sytle="width:221px;"></td>'
                            + '</tr>';

                } else if ( type === o.attrs.chan ) {

                    content += '<tr id=' + prefix + i + ' style="height: 80px; color: rgb(255, 255, 255);">'
                                + '<td style="width: 85px; font-size: 30px;"></td>'
                                    + '<td style="width: 245px;">'
                                    + '<br />'
                                    + '<span style="font-size: 20px;"></span>'
                                + '</td>'
                            + '</tr>';
                }
            }

            return content;
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

            o.prefix.dateTr = 'dlist';
            o.prefix.progTr = 'plist';
            o.prefix.chanTr = 'clist';
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

            $( o.ids.chanFocus ).style.display = 'block';

            // 偏移
            o.changeChanTblOffsetX( -1 );
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
            $( o.ids.progFocus ).style.display = 'block';
        }



        function initChanListFocus() {
            
        }

        function initProgListFocus() {
            
        }

        function initDateListFocus() {
            
        }

        return o;

    }( UIPC.plist ));

    var pageController = (function ( plist ) {

        var o   = {};

        o.pl = plist;

        o.area = 0;

        o.eventHandler = function ( e ) {
            
            var keycode = e.which ? e.which : e.keycode;

            switch ( keycode ) {

                case 38:
                    keyUp();;
                    return false;
                    break;
                case 40:
                    keyDown();
                    return false;
                    break;
                case 37:
                    keyLeft();
                    return false;
                    break;
                case 39:
                    keyRight();
                    return false;
                    break;
                default:
                    return true;
                    break;
            }
        }

        o.init = function () {

            var type = o.pl.type;


        };

        function keyUp() {
            
            if ( o.area === 0 ) { // date

                changeDateList( -1 );
            } else if ( o.area === 1 ) {

                changeProgList( -1 );
            }
        }

        function keyDown() {
            
            if ( o.area === 0 ) {

                changeDateList( 1 );
            } else if ( o.area === 1 ) {

                changeProgList( 1 );
            }
        }

        function keyLeft() {

            if ( o.area === 1 ) {

                o.area = 0;

                progListLoseFocus( o.progFocus );

                o.progFocus = 0;

            } else if ( o.area === 0 ) {

                return;
            }   
        }

        function keyRight() {
            
            if ( o.area === 0 ) {

                o.area = 1;

                progListGetFocus( o.progFocus );

            } else if ( o.area === 1 ) {

                return;
            }
        }

        function changeDateList( direction ) {
            
            if ( direction !== -1 && direction !== 1 ) {

                return false;
            }

            dateListLoseFocus( o.dateFocus );

            o.dateFocus = direction > 0 ? o.dateFocus + 1 : o.dateFocus - 1;

            if ( o.dateFocus < 0 ) {

                o.dateFocus = 0;
            } else if ( o.dateFocus >= lines ) {

                o.dateFocus = o.lines - 1;
            }

            dateListGetFocus( o.dateFocus );
        }

        function dateListGetFocus( index ) {
            
            var id = o.prefix.dateTr + index;

            $( id ).style.background = 'url(' + o.icons + ') no-repeat center';
            $( id ).style.color = '#FFFFFF';
        }

        function dateListLoseFocus( index ) {

            var id = id.prefix.dateTr + index;

            $( id ).style.background = '';
            $( id ).style.color = '#727374';
        }

        function changeProgList( direction ) {
            
            if ( direction !== -1 && direction !== 1 ) {

                return false;
            } 

            progListLoseFocus( o.progFocus );

            o.progFocus = direction > 0 ? o.progFocus + 1 : o.progFocus - 1;

            if ( o.progFocus < 0 ) {

                o.progFocus = 0;
            } else if ( o.progFocus >= lines ) {

                o.progFocus = lines - 1;
            }

            progListGetFocus();
        }

        function progListGetFocus() {

            var id      = o.ids.progFocus,
                top     = 0,
                trH     = 0,
                tr      = null,
                focus   = o.prefix.progTr + o.progFocus;

            tr = $( o.ids.tblProg ).getElementsByTagName( 'tr' );

            trH = tr.style.height.replace( /px/, 10 );

            debug( 'trH --------- ' + trH );

            $( focus ).style.color = '#ffffff';

            $( id ).style.visibility = 'visible';

            $( id ).style.top = ( o.focusTop + trH * o.progFocus ) + 'px';
        }

        function progListLoseFocus() {
            
            $( o.prefix.progTr + o.progFocus ).style.color = '#a0a2a4';

            // no need
        }


        return o;

    }( plist ));

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


        pageController.init();
    }

    return {

        init: init,

        tblInit: plist.init,

        tblUpdate: plist.update,

        progressControl: progress.eventHandler

        // 按键处理
        // eventHandler: pageController.eventHandler
    };

}());

/*

// 按键处理
window.document.onkeydown = pc.progressControl;

window.onload = function () {

    var table = null;

    // 初始化播控页面
    pc.init( 'LiveTV' );

    // pc.tblInit( 'tvod' );


    // 设置列表数据类型
    // pc.setDataType( 0 );
}; */

function $( id ) {

    return document.getElementById( id );
}

function debug( str ) {
    console.log( str );
}