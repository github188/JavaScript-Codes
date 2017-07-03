/*
* @Author: hedgehog
* @Date:   2016-11-21 14:14:32
* @Last Modified by:   hedgehog
* @Last Modified time: 2016-11-21 14:24:21
*/

'use strict';

export default (options = {}) => {
  const _options = {
    data: [],
    onFinish: function() {},
    onProgress: function(precent) {}
  };
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      _options[key] = options[key];
    }
  }
  const total = _options.data.length;
  let loaded = 0;

  const loadImage = (src) => {
    const img = new Image();
    img.onload = function() {
      loaded++;
      checkLoadComplete();
    };
    img.onerror = function() {
      loaded++;
      checkLoadComplete();
    };
    img.src = src;
  }

  const checkLoadComplete = () => {
    checkLoadProgress();
    if (loaded == total) {
      _options.onFinish();
    }
  }

  const checkLoadProgress = () => {
    _options.onProgress(parseFloat(loaded / total));
  }

  for (var i = 0; i < total; i++) {
    loadImage(_options.data[i]);
  }
}
