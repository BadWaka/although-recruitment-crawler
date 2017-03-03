/**
 * Created by BadWaka on 2017/3/3.
 */
let http = require('http'); // 引入http模块，用来网络请求
let iconv = require('iconv-lite');  // iconv-lite模块，用来解决中文乱码的问题
let url = 'http://bbs.pinggu.org/z_rc.php'; // 定义url

http.get(url, function (res) {
    var chunks = [];

    res.on('data', function (chunk) {
        chunks.push(chunk);
    });

    res.on('end', function () {
        var html = iconv.decode(Buffer.concat(chunks), 'gb2312');
        console.log(html);
    });
}).on('error', function (err) {
    console.log(err);
});