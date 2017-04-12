

function messageHandler(e) {
    console.log('你想告诉我什么：' + e.data);

    postMessage('萨瓦迪卡！');
}


addEventListener('message', messageHandler, true);