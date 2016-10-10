/**
 * FileHandler.js
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-09-19 15:22:29
 * @version $Id$
 *
 *
 *	---------- 2016/9/20 20:23:23   MOD by lizc
 *	0. 初始化处理
 *		- 01 init0()  	>	初始化，用于onload事件和页面重新刷新
 *		- 02 init()		>	初始化，init0里用
 *	1. 样式处理
 *		- 01 styleHandler对象 	>	样式处理对象 
 *	2. 显示处理
 *		- 01 showPath 			> 	显示路径列表
 *		- 02 refreshList 		> 	刷新列表
 *		- 03 hideInfo			> 	隐藏中间提示信息
 *		- 04 showInfo 			> 	显示中间提示信息
 *		- 05 scroll 			> 	列表滚动
 *		- 06 changeFocus 		> 	焦点改变
 *		----------------- 2016/9/21 15:14:31 by lizc
 *		- 07 showKeyTips 		> 	显示按键提示 
 *	3. 文件或文件夹处理
 *		- 01 getAllRootDriver  		> 	获取设备上所有根路径
 *		- 02 getFoldersByPath 		> 	获取指定文件夹下所有子文件夹
 *		- 03 getFilesByPath 		> 	获取指定文件夹下所有子文件
 *		- 04 getFileNameFromPath 	> 	从路径中提取出文件名
 *		- 05 getFileType 			> 	获取当前选中目标的类型，0-文件夹，1-文件
 *		- 06 isRootPath 			> 	判断当前路径是否为根路径
 *	4. 页面跳转处理
 *		- 01 goToParent 		> 	返回到父目录
 *		- 02 goToPrevPage 		> 	返回到父页面
 *
 * 	5. 升级处理
 * 		- 01 doSelect 			> 	选择键处理，进行升级
 * 		- 02 usbOnlineCheck 	> 	USB是否在线可用检测
 * 		- 03 submitFocus 		> 	提交按钮的焦点获取和失去处理
 * 		- 04 gotoUpdate 		> 	进行升级
 *
 *
 * 	---------- 2016/9/21 14:28:41 by lizc
 * 	6. 按键处理
 *  	- 01 keyMove 	> 	上下键处理
 *  	
 * 
 */

// var lang = 1;
var text = [
	["", "Please Select Update File"], // title
	["", "No usable USB device online, please connect your USB device ! page will come back after 3sec."], // usb offline
	["", "Your select is not file, please try again !"], // selected is not file
	["", "Get upgrade file successed, system will reboot and upgrade after several seconds, please don't do anything between."],
	["", "Your selected file is incorrect, please check and try again !"], // 文件名错误
	["", "Tips"]    // 5
];

// 右上角小提示信息内容
var tipsText = [
	[["", ""], ["LEFT"	, "back to last directory"]],
	[["", ""], ["RIGH"	, "enter to current directory"]],
	[["", ""], ["UP"	, "move up"]],
	[["", ""], ["DOWN"	, "move down"]],
	[["", ""], ["OK"	, "select and submit"]]
];

var linuxPath 	= '/media/usb_sd';

// eventpage.htm页面
var E = iPanel.eventFrame;

// 此两个数组互相关联，元素一一对应
// path: 保存这列表中所有文件完整路径
// type: 保存了path数组中对应索引位置的文件的类型 0 - 文件夹，1 - 文件
var gCurrListFilePath 	= [], 	
	gCurrListFileType	= [], 	
	gCurrParentPath		= [],  // 保存父路径，用出入栈方式控制返回操作
	gCurrParentType 	= []; 	// 保存父路径中对应的文件类型数组，同样才去出入栈控制

// 这两个全局变量一一对应，并且name组，需要根据path组去获取
var gCurrListFileLen 	= 0, 	// 当前列表中显示出来的文件夹个数
	// 当前选中的目标在 gCurrListFilePath 数组中的索引值
	// 需要根据这个去控制焦点变化
	gCurrSelectedIdx	= 0,
	gCurrPath 			= "";  	// 当前选中目标路径
	
// 滚动相关	
var gScrollTop 			= 0;  	// 当前行顶部离父容器之间的距离

// 升级文件名称
var gUpdateFileName		= "firmware",
	gHasTriggerUpdate 	= false; // 是否已经触发升级

// 进入页面立即检测
usbOnlineCheck();

// 显示右上角按键提示
showKeyTips();

window.document.onkeydown 		= keyHandler;
window.document.onsystemevent 	= keyHandler;

function keyHandler( event ) {
	var type 		= event.type;
	var code 		= event.which;
	var prevIdx 	= gCurrSelectedIdx;

	iPanel.debug("<lizc>----- FileHandler.js ----------- code = " + code);
	iPanel.debug("<lizc>----- FileHandler.js ----------- gHasTriggerUpdate = " + gHasTriggerUpdate);

	// 已经触发升级了，就不要再响应按键了
	if ( gHasTriggerUpdate ) {
		iPanel.debug("<lizc>----- FileHandler.js ----------- has trigger upgrade, please dont do it repeat. code = " + code);
		return false;
	}

	// 当有上下左右键和返回键发生时，提交按钮失去焦点
	if ( code == 38 || code == 40 || code == 37 || code == 39 || code == 8) {
		submitFocus(0);
	}

	// 只处理上下键和确认键
	switch (code) {
		case 38: // 上
			if ( gCurrSelectedIdx <= 0 ) {
				return false;
			}

			keyMove( prevIdx, 0 );
			return false;
			break;
		case 40: // 下
			if ( gCurrSelectedIdx >= gCurrListFileLen - 1 ) {
				return false;
			}
			
			keyMove( prevIdx, 1 );
			return false;
			break;
		case 39: // 右键
			iPanel.debug("<lizc>----- FileHandler.js ----------- 13 ---");
			doSelect();
			return false;
			break;
		case 37: // 左键
			goToParent();
			return false;
			break;
		case 8: // 返回父级目录
			goToPrevPage();
			return false;
			break;
		case 13: // 确认键，选择文件，进行升级
			iPanel.debug("<lizc>----- FileHandler.js -----13------ gCurrPath         = " + gCurrPath);
			gotoUpdate();
			return false;
			break;
		case 6002: // U盘已就绪
			E.gUSBOnlineFlag = true;
			init0();
			iPanel.debug("<lizc>----- FileHandler.js ----------- gCurrListFileType = " + gCurrListFileType);
			return true;
			break;
		case 6003: // U盘已拔除
			E.gUSBOnlineFlag = false;
			usbOnlineCheck();
			return true;
			break;
	}

	// 其他键往下走
	return true;
}


/* ----------------- 6. 按键处理 START ----------------- */

/**
 * 上下键移动焦点
 * @param  {Number} prevIdx   前一个焦点的索引
 * @param  {Number} direction 移动方向，0 - up，1 - down
 * @return {[type]}           [description]
 */
function keyMove( prevIdx, direction ) {

	if ( direction === 0 ) { // 上
		gCurrSelectedIdx--;
	} else {  // 下
		gCurrSelectedIdx++;
	}

	// 焦点变化
	changeFocus( prevIdx );

	// 更新存储当前路径的变量值
	updateCurrPath();

	// 向上滚动
	scroll( direction );
}
/* ----------------- 6. 按键处理 END ----------------- */

/* ----------------- 5. 升级处理 START ----------------- */

// 确定键升级
function gotoUpdate() {

	// 触发按钮点击事件
	$("submit").click();

	// 按钮获得焦点
	submitFocus(1); 

	iPanel.debug("<lizc>----- FileHandler.js ----------- Upgrade File Path = [" + gCurrPath + "]");

	// 获取当前选中的文件名
	var filename 	= getFileNameFromPath( gCurrPath );
	var isFile 		= getFileType( gCurrSelectedIdx ); // 0 - 文件夹，1 - 文件

	iPanel.debug("<lizc>----- FileHandler.js ----------- Upgrade File Name = [" + filename + "]");
	iPanel.debug("<lizc>----- FileHandler.js ----------- is file ? = [" + isFile + "]");

	var notFileTimer 		= null;
	var errFileNameTimer 	= null;
	if ( !isFile ) {
		showInfo( text[2][lang] );
		clearTimeout(errFileNameTimer);
		notFileTimer = setTimeout( function () { hideInfo(); }, 2000); // 提示2秒后消失
	} else { // 不需要检测文件名是否合法，因为在显示列表的时候就已经过滤掉了文件名非"firmware"的文件了

		// 避免之前的显示计时器还存在造成干扰
		clearTimeout(notFileTimer);
		clearTimeout(errFileNameTimer);

		// 同时执行下隐藏操作
		hideInfo();

		iPanel.debug("<lizc>----- FileHandler.js ----------- Begin To Update");
		iPanel.debug("<lizc>----- FileHandler.js ----------- Begin To Update --- gCurrPath = " + gCurrPath);

		var rightPath = pathToLinuxPath(gCurrPath);

		iPanel.debug("<lizc>----- FileHandler.js ----------- Begin To Update --- rightPath = " + rightPath);
		// 将当前地址透传给porting触发升级
		iPanel.ioctlWrite("UsbUpgrade", rightPath);

		gHasTriggerUpdate = true;

		// 显示即将升级信息
		showInfo( text[3][lang] );

		// setTimeout( function () { hideInfo(); }, 5000); // 提示5秒后消失
	}

}


// 提交按钮焦点处理，0 - 失去焦点，1 - 获得焦点
function submitFocus( focus ) {
	$("submit").style.backgroundColor = (focus === 0) ? "#7684bb" : "#ffff00";
}


// 进入页面，判断当前是否有可用U盘，没有直接返回上一级页面
function usbOnlineCheck() {
	var usbOn = E.gUSBOnlineFlag;
	iPanel.debug("<lizc>----- FileHandler.js ----------- usbOn = " + usbOn);
	// usb就绪状态直接退出，进行页面其他操作
	if ( usbOn ) return;

	// 否则显示提示信息，3秒后返回到上一级页面
	showInfo( text[1][lang] );
	setTimeout(function () {
		hideInfo();
		goToPrevPage(); 
	}, 3000);
};

/**
 * 选中目标处理
 * 1. 如果选中的是文件则判断该文件是否是升级所需要的目标文件
 * 2. 如果选中的是文件夹则直接打开显示其下面所有子目录和文件
 * 3. 如果是"."，表示当前目录，不处理 [NULL]
 * 4. 如果是".."，表示上级目录，退回去 [NULL]
 * @return {[type]} [description]
 */
function doSelect() {
	
	// 更新当前路径
	gCurrPath = gCurrListFilePath[gCurrSelectedIdx];
	iPanel.debug("<lizc>----- FileHandler.js ----- 1111 ------ gCurrPath = " + gCurrPath);

	if ( getFileType( gCurrSelectedIdx ) === 1 ) {
		// 如果是文件，直接保存，透传给porting去升级
		// 1. 需要检测文件合法性，是否是升级文件

		// TODO

		iPanel.debug("<lizc>----- FileHandler.js ----------- current is file.");
		return;
	} // 不是文件，则是文件夹，直接往下继续执行

	if ( gCurrListFilePath.length <= 0 ) {
		// 如果子目录没东西了，就不执行了
		return;
	}

	// 保存为父级目录
	gCurrParentPath.push(gCurrListFilePath);
	gCurrParentType.push(gCurrListFileType);

	iPanel.debug("<lizc>----- FileHandler.js ----- 2222 ------ gCurrPath = " + gCurrPath);
	gCurrListFilePath = [];
	gCurrListFileType = [];
	// 通过当前路径去获取该路径下的所有子文件夹
	var currPathSubDir 	= getFoldersByPath( gCurrPath );
	var foldname 		= "";
	currPathSubDir.map(function ( dir, index ) {
		foldname = getFileNameFromPath( dir.path );
		iPanel.debug("<lizc>----- FileHandler.js ----------- foldname = " + foldname);
		 gCurrListFilePath.push( dir.path );
		 gCurrListFileType.push(0);
	});

	// 通过当前路径去获取该路径下的所有子文件
	var currPathSubFiles 	= getFilesByPath( gCurrPath );
	var fileName 			= "";
	currPathSubFiles.map( function ( file, index ) {
		// 只显示文件名为“firmware”的文件，其他文件一律不显示出来
		fileName = getFileNameFromPath( file.path );
		iPanel.debug("<lizc>----- FileHandler.js ----------- fileName = " + fileName);
		if ( fileName == gUpdateFileName ) {
			gCurrListFilePath.push( file.path );
			gCurrListFileType.push(1);
		}
	} );

	iPanel.debug("<lizc>----- FileHandler.js ----------- gCurrListFilePath len = " + gCurrListFilePath.length);

	// 刷新数据
	refreshList( gCurrListFilePath );
}


/* ----------------- 5. 升级处理 END ----------------- */




/* ----------------- 4. 页面跳转处理 START ----------------- */

// 返回上级页面
function goToPrevPage() {
	window.document.location = "./settingsPage_new/settings_config_update_firmware.html";
}

// 返回到父级目录
function goToParent() {

	// 返回处理
	var top = $("drivers").style.top;
	if ( top < 0 ) {
		// 归零，防止目录超出显示范围，进入目录再返回时看不到焦点情况
		top = 0;  
	}
	$("drivers").style.top = top;

	iPanel.debug("<lizc>----- FileHandler.js ----------- gParentPath = " + gParentPath);
	gCurrListFileType = gCurrParentType.pop();
	refreshList( gCurrParentPath.pop() );
}
/* ----------------- 4. 页面跳转处理 END ----------------- */





/* ----------------- 3. 文件或文件夹处理 START ----------------- */

/**
 * 将window路径转换成/media/usb_sd*形式路径
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function pathToLinuxPath( path ) {
	if ( !path ) return;

	var num = path[0].toLowerCase().charCodeAt(0) - 2;

	iPanel.debug("<lizc>----- FileHandler.js -- wPathToLinuxPath -- num   = " + num);

	var letter = String.fromCharCode(num);

	iPanel.debug("<lizc>----- FileHandler.js -- wPathToLinuxPath -- letter = " + letter);

	return path.replace(/[a-zA-Z]:/, linuxPath + letter);
}

/**
 * 更新当前选中的路径
 * @return {[type]} [description]
 */
function updateCurrPath() {
	gCurrPath = gCurrListFilePath[gCurrSelectedIdx];
}

/**
 * 判断是否为根路径，根据输出结果，获取到的根路径中是不带'/'的
 * 所以可以根据这个去判断是否为根路径
 * @return {Boolean} [description]
 */
function isRootPath() {
	return gCurrPath.indexOf('/') < 0 ? true : false;
}

/**
 * 获取文件类型，0 - 文件夹，1 - 文件
 * @param  {[Number]} index 当前选中行的文件在文件列表数组对应的文件类型数组中的索引
 * @return {[Number]}       返回值 0 或 1
 */
function getFileType( index ) {
	return gCurrListFileType[index];
}

/**
 * 从完整路径中取出该文件或文件夹的名称
 * @param  {[String]} path 字符串格式完整路径
 * @return {[String]}      返回文件名
 */
function getFileNameFromPath( path ) {
	
	if ( !path ) return;

	if ( path.indexOf('/') < 0 ) { 
		// 如果路径中不包含'/'，则表示其为驱动器路径
		// 则直接返回该路径
		return path;
	} else {
		var names = path.split('/');
		// 取最后一个返回
		return names[names.length - 1];
	}
}

/**
 * 根据当前文件夹的路径去获取该路径下所有子文件
 * @param  {[String]} path 文件夹完整路径
 * @return {[Object]}      包含该文件夹下所有文件信息
 */
function getFilesByPath( path ) {

	if ( !path ) return;

	var currFolderObj = FileSystemObject.getFolder( path );

	return currFolderObj.fileObjects
}

/**
 * 根据路径去获取当前文件夹下的所有子文件夹
 * @param  {[String]} path 文件夹完整路径
 * @return {[Object]}      包含所有子文件夹信息
 */
function getFoldersByPath( path ) {
	
	if ( !path ) return;

	// 获取到当前路径对应的文件夹对象
	var currFolderObj = FileSystemObject.getFolder( path );

	return currFolderObj.subFolders;
}

/**
 * 获取所有驱动器根路径
 * @return {[Array]} 返回包含系统中所有磁盘的根路径，
 *         			比如Window系统中的C盘，即：C:
 */
function getAllRootDriver() {
	// 保存所有驱动器的路径
	var	drvPath 	= [];

	FileSystemObject.drives.map(function (drive, index) {
		drvPath.push(drive.rootFolder.path);
		gCurrListFileType.push(0);
	});

	iPanel.debug("<lizc>----- FileHandler.js ----------- gCurrListFileType = " + gCurrListFileType);
	iPanel.debug("<lizc>----- FileHandler.js ----------- gCurrListFileType len = " + gCurrListFileType.length);

	return drvPath;
}


/* ----------------- 3. 文件或文件夹处理 END ----------------- */

/* ----------------- 2. 显示处理 START ----------------- */

function showKeyTips() {
	var tipsTbl 	= $('tips_tbl');

	var inner 		= "";
	// 标题
	inner += '<tr><th>' + text[5][lang]  + '</th></tr>';

	// 根据tipsText数组内容新建表
	var lines 	= tipsText.length;
	var content = null;
	for (var i = 0; i < lines; i++) {
		content = tipsText[i][lang];

		inner += '<tr><td>' + content[0] + '</td><td>&nbsp;' 
							+ content[1] + '</td></tr>';
	}

	tipsTbl.innerHTML = inner;
}

// 焦点上下移动
function changeFocus( prevIdx ) {
	var trs 		= $("drivers").getElementsByTagName("tr");

	iPanel.debug("<lizc>----- FileHandler.js ----------- prevIdx = " + prevIdx);
	// 先前焦点行去掉焦点
	if ( prevIdx >= 0 ) {
		styleHandler.loseFocus( trs[prevIdx] );
	}

	iPanel.debug("<lizc>----- FileHandler.js ----------- gCurrSelectedIdx = " + gCurrSelectedIdx);
	// 当前行获取焦点
	styleHandler.gotFocus( trs[gCurrSelectedIdx] );
}


// 上下达到边缘自动滚动一格
// direction: 0 - up, 1 - down
function scroll( direction ) {
	
	// 取得当前行索引
	var currIdx = gCurrSelectedIdx;
	var tbl 	= $("drivers");

	// 获取每行高度
	var height 		= tbl.getElementsByTagName('td')[0].style.height;

	// 获取外层容器高度
	var cHeight 	= $("container").style.height

	iPanel.debug("<lizc>----- FileHandler.js ----------- scroll -- height  = " + height);
	iPanel.debug("<lizc>----- FileHandler.js ----------- scroll -- cHeight = " + cHeight);

	// 计算当前行离表格顶部高度
	var top 	= (currIdx + 1) * height;
	iPanel.debug("<lizc>----- FileHandler.js ----------- scroll -- top     = " + top);
	iPanel.debug("<lizc>----- FileHandler.js ----------- scroll -- tbl.style.top     = " + tbl.style.top);

	if ( direction === 1 && top + height > cHeight ) {
		tbl.style.top -= height;
	} else if ( direction === 0 && tbl.style.top < 0 ) {
		tbl.style.top += height;
	}

}

// 在屏幕中间显示提示信息
function showInfo( msg ) {

	iPanel.debug("<lizc>----- FileHandler.js ----------- showInfo " + msg);

	var info = $("info");
	iPanel.debug("<lizc>----- FileHandler.js ----------- info = " + info);
	info.style.visibility = "visible";
	info.innerText = msg;
}

// 隐藏屏幕中间的提示信息
function hideInfo() {
	var info = $("info");
	info.style.visibility = "hidden";
	info.innerText = "";
}

/**
 * 刷新文件列表
 * @param  {Array} pathList 将该数组中所有路径显示出来
 * @return {[type]}          [description]
 */
function refreshList( pathList ) {
	
	if ( !pathList ) {

		iPanel.debug("<lizc>----- FileHandler.js ----------- pathList = " + pathList);
		return;
	}


	iPanel.debug("<lizc>----- FileHandler.js ----------- pathList  = " + pathList);
	iPanel.debug("<lizc>----- FileHandler.js ----------- filesList = " + filesList);

	$("drivers").innerHTML = "";

	// 直接重新初始化
	init( pathList );
}

/**
 * 将当前所有路径显示到表格中
 * @param  {Array} path 保存着路径名称
 * @return {[type]}      [description]
 */	
function showPath( path ) {

	if ( !path ) return;

	// 路径显示表	
	var tbl 		= $("drivers"),
		tr 			= "";  // 代表一行

	var len 	= path.length;
	if ( len <= 0 ) return;

	// 获取所有文件夹及文件路径
	for (var i = 0; i < len; i++) {
		// 只保存文件夹名字和文件名称
		tr += "<tr><td>" + getFileNameFromPath( path[i] ) + "</td></tr>"
	}

	iPanel.debug("tr------ tr = " + tr);

	// 显示到表中
	tbl.innerHTML = tr;

	var trs 		= tbl.getElementsByTagName("tr"); // 表中所有行

	// 初始化焦点行，和设置创建的行属性
	styleHandler.gotFocus( trs[0] );


	iPanel.debug("<lizc>----- FileHandler.js ----------- trs len = " + trs.length);

	var tds	= tbl.getElementsByTagName("td");
	var td 	= null;
	// 文件夹, 文件图片处理
	for ( var j = 0; j < tds.length; j++ ) {
		td = tds[j];

		if ( getFileType(j) === 0 ) { // 目录
			td.style.background     = "url(folder_icon.gif) left 6px no-repeat";
		} else { // 文件
			td.style.background     = "url(file_icon.gif) left 9px no-repeat";
		}

		td.style.paddingLeft    = "20px";
	}
}
/* ----------------- 2. 显示处理 END ----------------- */

/* ----------------- 1. 样式处理 START ----------------- */
var styleHandler = (function () {
     
    var o = {};

    // 焦点样式
    o.focus = "focus";

    // 获得焦点
    o.gotFocus = function ( ele ) {
        this.addClass(ele, this.focus);
    };

    // 失去焦点
    o.loseFocus = function ( ele ) {
        this.removeClass(ele, this.focus);
    };

    o.setAttr = function ( ele, name, value ) {

    	// 属性组设置 TODO 
    	
    	ele.setAttribute(name, value);
    };

    // 追加样式
    o.addClass = function ( ele, clsName ) {

        if ( clsName == "" || !clsName ) {
            // 参数错误
            return;
        }

        var currCls     = ele.getAttribute("class");

        if ( !currCls || currCls == "" || currCls == "undefined" ) {
        	ele.setAttribute("class", clsName);
        } else {
        	ele.setAttribute("class", currCls + " " + clsName);
        }
    };


    o.removeClass = function ( ele, clsName ) {
        if ( clsName == "" || !clsName ) {
            // 参数错误
            return;
        }

        var currCls     = ele.getAttribute("class");

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


/* ----------------- 0. 初始化 START ----------------- */

// 页面初始化
function init( drivers ) {

	showPath(drivers);

	// 保存为当前
	gCurrListFilePath 	= drivers;
	gCurrListFileLen 	= gCurrListFilePath.length;

	// 初始化当前路径和索引
	gCurrPath			= gCurrListFilePath[0];
	gCurrSelectedIdx 	= 0;
	iPanel.debug("<lizc>----- FileHandler.js ----------- gCurrPath = " + gCurrPath);
	iPanel.debug("<lizc>----- FileHandler.js ----------- gCurrListFileLen = " + gCurrListFileLen);
}

// 用于页面的onload事件，U盘插拔时消息触发刷新列表
function init0() {
	init(getAllRootDriver());
}

/* ----------------- 0. 初始化 END ----------------- */

// 根据id获取对象
function $( id ) {
    return document.getElementById(id);
}

// 暂时不需要，直接在确认键中处理
function submit() {
	iPanel.debug("<lizc>----- FileHandler.js ----------- gCurrPath = " + gCurrPath);
}

//////////////////////////////////////////////////////////////////////////////////////
////////////  						  FILE END  						  ////////////
//////////////////////////////////////////////////////////////////////////////////////
