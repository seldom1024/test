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

// $hammer.alert("ok", "in");

const body = $response.body;
// $hammer.alert("body", body);
let obj = JSON.parse(body);
// $hammer.alert("obj", obj);
let scene = obj["req_scene"];
// $hammer.alert("scene", scene);
if(!(scene == "exit_and_entry_query")){
    $done({});
}else{
    let  resp = { retcode:"1061110705", retmsg:"查无结果(103)", enmsg:"Error"};
// let obj = JSON.parse(body);
// obj["retcode"]="106110705";
// obj["enmsg"]="Error";
// obj["retmsg"]="查无结果(103)";
// $hammer.alert("out", JSON.stringify(resp));
$done({ body:JSON.stringify(resp) })
}
