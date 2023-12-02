//params为请求参数：如下
var params = {
    url: "https://www.okx.com/priapi/v5/ecotrade/public/position-detail?instType=SWAP&uniqueName=D5E7A8430A35CA84/"
}


$httpClient.get(params, function (errormsg, response, data) {
    // 将响应数据转换为JSON（如果它还不是JSON格式的话）
    let jsonData = JSON.parse(data);

    // 检查jsonData是否有data属性，并确保它是一个数组
    if (jsonData.data && Array.isArray(jsonData.data)) {
        // 检查数组是否为空
        if (jsonData.data.length === 0) {
            $notification.post("当前带单数据", "当前带单数据", "当前没有带单")
        } else {
            let traceMsg = "";
            // 遍历非空数组
            jsonData.data.forEach(item => {
                // 空
                if (item.posSide === "short") {
                    traceMsg = traceMsg + item.lever + "倍做空" + item.instId + ",开仓价：" + item.openAvgPx + formatTimestamp(item.openTime) + "\n"
                } else { // 多
                    traceMsg = traceMsg + item.lever + "倍做多" + item.instId + ",开仓价：" + item.openAvgPx + formatTimestamp(item.openTime) + "\n"
                }
            });
        }
        $notification.post("当前带单数据", "当前带单数据", traceMsg)
    } else {
        $notification.post("获取带单数据异常", "当前带单数据", jsonData)
    }
})



function formatTimestamp(timestamp) {
    let date = new Date(timestamp);

    let year = date.getFullYear(); // 年
    let month = date.getMonth() + 1; // 月（从 0 开始计算，所以加 1）
    let day = date.getDate(); // 日
    let hours = date.getHours(); // 时
    let minutes = date.getMinutes(); // 分
    let seconds = date.getSeconds(); // 秒

    // 拼接字符串
    let formatted = year + '年' + month + '月' + day + '日 ' + hours + '时' + minutes + '分' + seconds + '秒';
    return formatted;
}
