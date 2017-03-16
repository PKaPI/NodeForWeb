var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var http=require('http');
var url = 'http://www.imooc.com/learn/348'
/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log(111)
  res.render('index', { title: '222' });
});
router.get('/load', function(req, res, next) {
    console.log(11)
   var url = 'http://www.imooc.com/learn/348'
   var options = {
        url: url,
        method: 'GET',
        json: true
    };
    request(options, function (error, response, body) {
        if(error) return next(error);
        // var courseData = filterChapters(body);  
        // printCourseData(courseData);
        // res.end();
        console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
    //   console.log('the decoded data is: ' + body)
        
    }).on('data',function(data){
        console.log('decoded chunk：'+data)
    })
    .on('response',function(response){
       
    })
});
// http.get(url, function(res) {  
//     var html = ''  
  
//     res.on('data', function(data) {  
//         html += data  
//     })  
  
//     res.on('end', function() {  
//         var courseData = filterChapters(html)  
//         printCourseData(courseData)  
//     })  
// }).on('error', function() {  
//     console.log('获取课程数据出错！')  
// });
function filterChapters(html) {  
    var $ = cheerio.load(html)  
  
    var chapters = $('div.chapter')  
  
    var courseData = [];  
  
    chapters.each(function() {  
        var chapter = $(this) // $(this)的用法可以让回调方法省略参数  
        var chapterTitle = chapter.find('strong').contents().filter(function() {  
            return this.nodeType === 3; // 设置一个过滤器拿到文本内容  
        }).text().trim();  
        var videos = chapter.find('ul').children()  
        var chapterData = { // 定义一个json以接收数据  
            chapterTitle : chapterTitle,  
            videos : []  
        }  
  
        videos.each(function() {  
            var video = $(this).find('a')  
            var temp = video.text().trim()  
            var arr = temp.split('\n') // 多层标签的文本都拼到一起了，要拆开，取用需要的值  
            var videoTitle = arr[0].trim() + ' ' + arr[1].trim()  
            var id = video.attr('href').split('video/')[1].trim()  
  
            chapterData.videos.push({  
                title : videoTitle,  
                id : id  
            })  
        })  
  
        courseData.push(chapterData)  
    })  
  
    return courseData  
}  
  
// 输出函数  
function printCourseData(courseData) {  
    courseData.forEach(function(item) {  
        var chapterTitle = item.chapterTitle  
  
        console.log(chapterTitle)  
  
        item.videos.forEach(function(vedio) {  
            console.log('---[' + vedio.id + ']' + vedio.title.trim())  
        })  
    })  
}  
module.exports = router;