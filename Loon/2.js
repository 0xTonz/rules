#!name=网络切换重启VPN
#!desc=网络环境变化时自动重启VPN增强稳定性

const vpnControlURL = {
    on: "https://www.nsloon.com/openloon/on",
    off: "https://www.nsloon.com/openloon/off",
    direct: "https://www.nsloon.com/openloon/flowmodel=direct",
    filter: "https://www.nsloon.com/openloon/flowmodel=filter"
};

async function restartVPN() {
    try {
        // 记录原始VPN状态
        const initStatus = await $configuration.getVPNStatus();
        
        // 如果当前未开启VPN则跳过
        if (!initStatus) {
            console.log("VPN未启用，无需重启");
            return;
        }

        // 第一步：关闭VPN
        console.log("开始关闭VPN...");
        const offResult = await fetchURL(vpnControlURL.off);
        if (!offResult) throw new Error("VPN关闭失败");
        
        // 等待1秒确保完全关闭
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 第二步：重新开启VPN
        console.log("开始重启VPN...");
        const onResult = await fetchURL(vpnControlURL.on);
        if (!onResult) throw new Error("VPN启动失败");

        // 恢复流量模式（可选）
        await fetchURL(vpnControlURL.filter);
        
        $notification.post("VPN重启成功", `状态：${initStatus ? "保持开启" : "保持关闭"}`, "网络环境变化已处理");
    } catch (error) {
        console.log(`操作失败：${error.message}`);
        $notification.post("VPN重启失败", error.message, "请手动检查连接状态");
    }
}

// 通用请求函数
function fetchURL(url) {
    return new Promise((resolve) => {
        $httpClient.get(url, function(error, response, data) {
            resolve(!error && response.status === 200);
        });
    });
}

// 监听网络变化事件
if (typeof $eventEmitter !== 'undefined') {
    $eventEmitter.on('networkChanged', (event) => {
        console.log(`检测到网络变化: ${JSON.stringify(event)}`);
        restartVPN();
    });
}

// 面板手动触发（可选）
if (typeof $input !== 'undefined' && $input.purpose === 'panel') {
    restartVPN().finally(() => {
        $done({
            title: "VPN状态",
            content: "已执行重启操作",
            refresh: true
        });
    });
} else {
    $done();
}
