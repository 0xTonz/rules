//!name=网络切换重启VPN
//!desc=网络变化时自动重启VPN

// 先关闭VPN
$httpClient.get('https://www.nsloon.com/openloon/off', function(offError) {
    if (offError) {
        $notification.post('VPN关闭失败', offError.error);
        return;
    }
    
    // 延迟1秒后重新开启
    setTimeout(function() {
        $httpClient.get('https://www.nsloon.com/openloon/on', function(onError) {
            if (onError) {
                $notification.post('VPN启动失败', onError.error);
            } else {
                $notification.post('VPN重启成功', '网络环境变化已处理');
            }
        });
    }, 1000); // 重要！添加1秒延迟确保关闭完成
});

$done();
