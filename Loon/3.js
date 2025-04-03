#!name=网络切换重启VPN
#!desc=网络变化时自动重启VPN

// 关闭VPN
$httpClient.get('https://www.nsloon.com/openloon/off', () => {
    // 关闭后立即开启
    $httpClient.get('https://www.nsloon.com/openloon/on', () => {
        $notification.post('VPN重启成功', '网络变化已处理', '连接已刷新');
    }, (error) => {
        $notification.post('VPN启动失败', error.error);
    });
}, (error) => {
    $notification.post('VPN关闭失败', error.error);
});

// 监听网络变化 (Loon会自动触发)
$done();
