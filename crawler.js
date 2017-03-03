/**
 * Created by BadWaka on 2017/3/3.
 */
const http = require('http'); // 引入http模块，用来网络请求
const iconv = require('iconv-lite');  // iconv-lite模块，用来解决中文乱码的问题
const cheerio = require('cheerio'); // 通过cheerio选择DOM
const fs = require('fs');
const path = require('path');

const url = 'http://bbs.pinggu.org/z_rc.php'; // 定义url

// 请求数据
http.get(url, function (res) {

    var chunks = [];

    // 监听data事件
    res.on('data', function (chunk) {
        chunks.push(chunk);
    });

    // 监听结束事件
    res.on('end', function () {
        var html = iconv.decode(Buffer.concat(chunks), 'gb2312');
        console.log(html);
        filterData(html);
    });

}).on('error', function (err) {
    // 监听错误事件
    console.log(err);
});

/**
 * 过滤数据
 * @param dataUnfiltered    过滤前的数据
 */
function filterData(dataUnfiltered) {
    let $ = cheerio.load(dataUnfiltered);

    let array = [];
    let hotJobItems = $('.clearfix');    // 找到热门职位对象
    for (let i = 0; i < hotJobItems.length; i++) {
        let data = {};
        let hotPosL = hotJobItems.eq(i).children('.hot-pos-l');    // 拿到左边
        let hotPosR = hotJobItems.eq(i).children('.hot-pos-r');    // 拿到右边

        data.location = hotPosL.children('.zw02').children('span').text();   // 拿到地点
        data.monthlySalary = hotPosL.children('span').eq(0).text().replace(/\s/g, ''); // 拿到月薪
        data.experience = hotPosL.children('span').eq(1).text().replace(/\s/g, '');    // 拿到经验
        data.education = hotPosL.children('span').eq(2).text().replace(/\s/g, ''); // 学历
        data.date = hotPosL.children('span').eq(4).text();  // 日期

        data.companyName = hotPosR.children('.zw02').children('a').text();  // 公司名
        data.industry = hotPosR.children('span').eq(0).text().replace(/\s/g, ''); // 行业
        data.property = hotPosR.children('span').eq(1).text().replace(/\s/g, ''); // 性质
        data.scale = hotPosR.children('span').eq(2).text().replace(/\s/g, ''); // 规模

        if (data.companyName) {
            array.push(data);
        }
    }
    console.log(array);
    fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(array), function (err) {
        if (err) {
            console.log(err);
        }
    });
}