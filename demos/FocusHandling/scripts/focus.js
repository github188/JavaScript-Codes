/**
 * 
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-09-14 11:07:57
 * @version $Id$
 */


// window.document.onkeypress   = keypressHandler;
window.document.onkeydown   = keypressHandler;

// 按键处理
function keypressHandler(event) {

    var type        = event.type,   // 事件类型
        keycode     = event.which;  // 键值

    debug("[type    = " + event.type + ", keycode = " + event.which + "]");

    switch (keycode) {
        case 38:    // up
            focusChange("up");
            break;
        case 40:    // down
            focusChange("down");
            break;
        case 37:    // left
            focusChange("left");
            break;
        case 39:    // right
            focusChange("right");
            break;
        default:
            break;
    }
}

// 改变元素焦点
function focusChange( direction ) {
    
    // 查找下一个需要焦点元素的id
    var nextId  = findNextEleId(direction);

    debug("[focusChange] next element id is " + nextId);

    if ( !!!nextId ) {
        // 没找到表示该方向没有元素了，不进行处理，焦点依旧保持在当前元素
        return;
    }

    // 删除当前元素焦点
    styleHandler.loseFocus(currFocusEleId);

    // 聚焦下一个元素
    styleHandler.gotFocus(nextId);

    // 将下一个保存为当前
    currFocusEleId = nextId;
}

// 根据当前元素的id和按键方向找到下一个元素
function findNextEleId( direction ) {

    var eArr        = null,
        currIdx     = -1;

    // 根据当前元素id去获取该元素在数据中的数据和对应的索引
    eArr    = findEleFromData(currFocusEleId);
    currIdx = eArr[1];
   
    if ( currIdx < 0 ) { // 没找到
        debug("[findNextEleId] not found element.");
        return;
    } else { // 找到元素数据
        debug("[findNextEleId] find the element, id is " + eArr[0].eid);
        return eArr[0][direction]; // 返回当前元素指定direction方向上的元素id
    }

}

/**
 * 根据id去数据中找到对应元素数据
 * @param  {[String]} eid [元素的Id]
 * @return {[Array]}     [包含该元素数据对象，及索引]
 */
function findEleFromData( eid ) {
    var e       = null,
        eIdx    = -1;

    eleDatas.map(function (element, index) {
        if ( element.eid == eid ) {
            e       = element;
            eIdx    = index;
            return;
        }
    });

    if ( eIdx < 0 ) {
        // 没找到
        debug("[findEleFromData] not found element!");
        return;
    } else {
        // 找到了，记录日志
        debug("[findEleFromData] found element, index is " + eIdx);
    }

    return [e, eIdx];
}


/* ----------------- 1. 样式处理 START ----------------- */

var styleHandler = (function () {
     
    var o = {};

    // 焦点样式
    o.focus = "focus";

    // 获得焦点
    o.gotFocus = function ( id ) {
        this.addClass(id, this.focus);
    };

    // 失去焦点
    o.loseFocus = function ( id ) {
        this.removeClass(id, this.focus);
    }

    // 追加样式
    o.addClass = function ( id, clsName ) {

        if ( id == "" || !id || clsName == "" || !clsName ) {
            // 参数错误
            return;
        }

        var ele         = $(id),
            currCls     = ele.getAttribute("class");
            
        if ( !currCls || currCls == "" || currCls == "undefined" ) {
            ele.setAttribute("class", clsName);
        } else {
            ele.setAttribute("class", currCls + " " + clsName);
        }
    };


    o.removeClass = function ( id, clsName ) {
        if ( id == "" || !id || clsName == "" || !clsName ) {
            // 参数错误
            return;
        }

        var ele         = $(id),
            currCls     = ele.getAttribute("class");

        var resultCls = "";
        
        if ( currCls == clsName ) {
            // 只有一个样式且与要删除的样式一致时直接清空
            resultCls = "";
        } else {
            // 找出样式并删除
            resultCls   = currCls.replace(new RegExp(clsName + " " + "|" + " " + clsName), '');
        }

        // 重新设置样式
        ele.setAttribute("class", resultCls);
    };

    return o;
})();


/* ----------------- 1. 样式处理 END ----------------- */

/* ----------------- 0. 工具函数 START ----------------- */

// 00. 根据id获取对象
function $( id ) {
    return document.getElementById(id);
}

// 01. log输出
function debug( msg ) {
    if ( !msg || msg == "" ) {
        return;
    } 

    var dbStr = "[GL=LOG] ";
    if ( DEBUG_OPEN ) {
        console.log(dbStr + msg);
    }    
}

/* ----------------- 0. 工具函数 END ----------------- */