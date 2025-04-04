// renderer.js
// 获取从主进程暴露的 robot 模块
// const { remote } = require('electron');
// const robot = remote.getGlobal('robot');

// Handle click item application to choose
const handleClickItemApplication = (item) => {
    // Send to main.js
    window.electronBridge.sendApplicationChoose(item);
};
