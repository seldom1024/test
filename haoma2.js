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

const url2 = 'https://api.jihaoba.com/weapp/v1/list.json?' +
    'page=1' +
    '&key=1880259684' +
    '&tail=0' +
    '&cityid=0' +
    '&manager=0' +
    '&grade=-1' +
    '&s=' +
    '&four=0' +
    '&zero=0' +
    '&minprice=' +
    '&maxprice=';

const params2 = {
    url: url2,
    headers: {
        "Host": "api.jihaoba.com",
        "Connection": "keep-alive",
        "content-type": "application/json",
        "Accept-Encoding": "gzip,compress,br,deflate",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.46(0x18002e2c) NetType/WIFI Language/zh_CN",
        "Referer": "https://servicewechat.com/wxa4cef44cdfd0ca81/39/page-frame.html"
    }
}
const Protagnist2 = "集号吧手机靓号";
$hammer.request('get', params2, (error, response, data) => {
    const result = JSON.parse(response);
    let detail;
    detail = "结果："
    const list = result.data.list;
    for (let i = 0; i < list.length; ++i) {
        detail = detail + list[i].mobile + ";";
    }
    $hammer.alert(Protagnist2, detail);
    $hammer.done();
})
