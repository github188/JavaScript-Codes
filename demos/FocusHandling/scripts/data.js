/**
 * 页面数据文件
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-09-14 11:19:52
 * @version 1.0
 *
 * 将页面数据化，只需要改变数据和基本布局就能达到焦点转换目的
 */

var DEBUG_OPEN = false; // 日志开关


/**
 * 页面元素属性数据
 * 属性简介：
 *      eid     : 当前元素的id
 *      left    : 当前元素左边的元素id
 *      right   : 当前元素右边的元素id
 *      up      : 当前元素上面的元素id
 *      down    : 当前元素下面的元素id
 *      focus   : 当前元素是否获得聚焦
 *
 * PS. 当页面有多个分区时，也可共用这一个数据库，亦可单独定义数据
 *  但是需要注意几点：
 *      1. 如果是从一个分区到另一个分区，没必要聚焦当前紧挨着的，可以直接到该分区第一个位置
 */
var eleDatas    = [

    // 中心盒子
    { "eid": "box-1", "left": "lbox-1"  , "right": "box-2"  , "up": "ubox-8"    , "down": "box-3" },
    { "eid": "box-2", "left": "box-1"   , "right": "rbox-1" , "up": "ubox-8"    , "down": "box-4" },
    { "eid": "box-3", "left": "lbox-2"  , "right": "box-4"  , "up": "box-1"     , "down": "box-5" },
    { "eid": "box-4", "left": "box-3"   , "right": "rbox-1" , "up": "box-2"     , "down": "box-6" },
    { "eid": "box-5", "left": "lbox-3"  , "right": "box-6"  , "up": "box-3"     , "down": "box-7" },
    { "eid": "box-6", "left": "box-5"   , "right": "rbox-1" , "up": "box-4"     , "down": "box-8" },
    { "eid": "box-7", "left": "lbox-4"  , "right": "box-8"  , "up": "box-5"     , "down": "dbox-8" },
    { "eid": "box-8", "left": "box-7"   , "right": "rbox-1" , "up": "box-6"     , "down": "dbox-8" },


    // 左边盒子
    { "eid": "lbox-1", "left": ""   , "right": "box-1"      , "up": "ubox-1"    , "down": "lbox-2" },
    { "eid": "lbox-2", "left": ""   , "right": "box-3"      , "up": "lbox-1"    , "down": "lbox-3" },
    { "eid": "lbox-3", "left": ""   , "right": "box-5"      , "up": "lbox-2"    , "down": "lbox-4" },
    { "eid": "lbox-4", "left": ""   , "right": "box-7"      , "up": "lbox-3"    , "down": "dbox-1" },

    // 上边盒子
    { "eid": "ubox-1", "left": "ubox-8" , "right": "ubox-2"     , "up": ""  , "down": "lbox-1" },
    { "eid": "ubox-2", "left": "ubox-1" , "right": "ubox-3"     , "up": ""  , "down": "lbox-1" },
    { "eid": "ubox-3", "left": "ubox-2" , "right": "ubox-4"     , "up": ""  , "down": "lbox-1" },
    { "eid": "ubox-4", "left": "ubox-3" , "right": "ubox-5"     , "up": ""  , "down": "lbox-1" },
    { "eid": "ubox-5", "left": "ubox-4" , "right": "ubox-6"     , "up": ""  , "down": "lbox-1" },
    { "eid": "ubox-6", "left": "ubox-5" , "right": "ubox-7"     , "up": ""  , "down": "lbox-1" },
    { "eid": "ubox-7", "left": "ubox-6" , "right": "ubox-8"     , "up": ""  , "down": "lbox-1" },
    { "eid": "ubox-8", "left": "ubox-7" , "right": "rbox-1"     , "up": ""  , "down": "lbox-1" },

    // 底部盒子
    { "eid": "dbox-1", "left": "dbox-8"  , "right": "dbox-2"    , "up": "lbox-4"  , "down": "" },
    { "eid": "dbox-2", "left": "dbox-1" , "right": "dbox-3"     , "up": "lbox-4"  , "down": "" },
    { "eid": "dbox-3", "left": "dbox-2" , "right": "dbox-4"     , "up": "lbox-4"  , "down": "" },
    { "eid": "dbox-4", "left": "dbox-3" , "right": "dbox-5"     , "up": "box-7"  , "down": "" },
    { "eid": "dbox-5", "left": "dbox-4" , "right": "dbox-6"     , "up": "box-7"  , "down": "" },
    { "eid": "dbox-6", "left": "dbox-5" , "right": "dbox-7"     , "up": "box-7"  , "down": "" },
    { "eid": "dbox-7", "left": "dbox-6" , "right": "dbox-8"     , "up": "box-8"  , "down": "" },
    { "eid": "dbox-8", "left": "dbox-7" , "right": "rbox-10"    , "up": "box-8"  , "down": "" },


    // 右边盒子
    { "eid": "rbox-1"   , "left": "ubox-8" , "right": ""     , "up": "rbox-10" , "down": "rbox-2" },
    { "eid": "rbox-2"   , "left": "box-2"  , "right": ""     , "up": "rbox-1"  , "down": "rbox-3" },
    { "eid": "rbox-3"   , "left": "box-2"  , "right": ""     , "up": "rbox-2"  , "down": "rbox-4" },
    { "eid": "rbox-4"   , "left": "box-4"  , "right": ""     , "up": "rbox-3"  , "down": "rbox-5" },
    { "eid": "rbox-5"   , "left": "box-4"  , "right": ""     , "up": "rbox-4"  , "down": "rbox-6" },
    { "eid": "rbox-6"   , "left": "box-6"  , "right": ""     , "up": "rbox-5"  , "down": "rbox-7" },
    { "eid": "rbox-7"   , "left": "box-6"  , "right": ""     , "up": "rbox-6"  , "down": "rbox-8" },
    { "eid": "rbox-8"   , "left": "box-8"  , "right": ""     , "up": "rbox-7"  , "down": "rbox-9" },
    { "eid": "rbox-9"   , "left": "box-8"  , "right": ""     , "up": "rbox-8"  , "down": "rbox-10" },
    { "eid": "rbox-10"  , "left": "dbox-8" , "right": ""     , "up": "rbox-9"  , "down": "rbox-1" }
];

/* 焦点元素相关 */
var currFocusEleId  = "ubox-1",  // 当前焦点元素ID
    DftFocusEleId   = "ubox-1";  // 默认焦点元素ID