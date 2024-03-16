const $hammer = (() => {
    const isRequest = "undefined" != typeof $request, isSurge = "undefined" != typeof $httpClient,
        isQuanX = "undefined" != typeof $task;
    const log = (...n) => {
        for (let i in n) console.log(n[i])
    };
    const alert = (title, body = "", subtitle = "", options = {}) => {
        let link = null;
        switch (typeof options) {
            case"string":
                link = isQuanX ? {"open-url": options} : options;
                break;
            case"object":
                if (["null", "{}"].indexOf(JSON.stringify(options)) == -1) {
                    link = isQuanX ? options : options["open-url"];
                    break
                }
            default:
                link = isQuanX ? {} : ""
        }
        if (isSurge) return $notification.post(title, subtitle, body, link);
        if (isQuanX) return $notify(title, subtitle, body, link);
        log("==============📣系统通知📣==============");
        log("title:", title, "subtitle:", subtitle, "body:", body, "link:", link)
    };
    const read = key => {
        if (isSurge) return $persistentStore.read(key);
        if (isQuanX) return $prefs.valueForKey(key)
    };
    const write = (val, key) => {
        if (isSurge) return $persistentStore.write(val, key);
        if (isQuanX) return $prefs.setValueForKey(val, key)
    };
    const request = (method, params, callback) => {
        let options = {};
        if (typeof params == "string") {
            options.url = params
        } else {
            options.url = params.url;
            if (typeof params == "object") {
                params.headers && (options.headers = params.headers);
                params.body && (options.body = params.body)
            }
        }
        method = method.toUpperCase();
        const writeRequestErrorLog = function (m, u) {
            return err => {
                log(`\n===request error-s--\n`);
                log(`${m} ${u}`, err);
                log(`\n===request error-e--\n`)
            }
        }(method, options.url);
        if (isSurge) {
            const _runner = method == "GET" ? $httpClient.get : $httpClient.post;
            return _runner(options, (error, response, body) => {
                if (error == null || error == "") {
                    response.body = body;
                    callback("", body, response)
                } else {
                    writeRequestErrorLog(error);
                    callback(error, "", response)
                }
            })
        }
        if (isQuanX) {
            options.method = method;
            $task.fetch(options).then(response => {
                response.status = response.statusCode;
                delete response.statusCode;
                callback("", response.body, response)
            }, reason => {
                writeRequestErrorLog(reason.error);
                response.status = response.statusCode;
                delete response.statusCode;
                callback(reason.error, "", response)
            })
        }
    };
    const done = (value = {}) => {
        if (isQuanX) return isRequest ? $done(value) : null;
        if (isSurge) return isRequest ? $done(value) : $done()
    };
    const pad = (c = "~", s = false, l = 15) => s ? console.log(c.padEnd(l, c)) : `\n${c.padEnd(l, c)}\n`;
    return {isRequest, isSurge, isQuanX, log, alert, read, write, request, done, pad}
})();

const url2 = 'https://x.qiangka.com/m/io/pro/S_City/11016.html?' +
    'cnt=48' +
    '&page_no=1' +
    '&dis=1' +
    '&numcategory=1' +
    '&lanmu=0' +
    '&zifei=' +
    '&haoduan=' +
    '&jx=' +
    '&haohao=' +
    '&birth=' +
    '&jiage=' +
    '&gs=' +
    '&st=' +
    '&noin=' +
    '&klist=188025968__';

const params2 = {
    url: url2,
    headers: {
        "Host": "x.qiangka.com",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Site": "same-origin",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Sec-Fetch-Mode": "cors",
        "Accept": "text/plain, */*; q=0.01",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.46(0x18002e2c) NetType/WIFI Language/zh_CN miniProgram/wxa1fad1faeb3fd513",
        "Connection": "keep-alive",
        "Referer": "https://x.qiangka.com/m/product/search2/popSearch/1.html"
    }
}
const Protagnist2 = "靓号";
$hammer.request('get', params2, (error, response, data) => {
    const detail = "结果：" + response
    $hammer.alert(Protagnist2, detail);
    $hammer.done();
})
