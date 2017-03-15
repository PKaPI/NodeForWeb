var express = require('express');
var router = express.Router();
var request =require('request');
var http = require('http')  
var Promise = require('promise')  
var cheerio = require('cheerio')  
      
var baseUrl = 'http://www.imooc.com/learn/'  
var url = 'http://www.imooc.com/learn/348'  
var vedioIds = ['348','637','259','75','197']  
      
    function filterChapters(html) {  
        var $ = cheerio.load(html)  
        var chapters = $('.chapter')  
        //var title = $('#main .path span').text();  
        var title = $('.path').children('a').children('span').text().trim();
        var courseData = {  
            title: title,  
            number: 0,  
            videos: []      
        }  
      
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
      
            courseData.videos.push(chapterData)  
        })  
      
        return courseData  
    }  
      
    // 输出函数  
    function printCoursesData(coursesData) {  
        coursesData.forEach(function(courseData) {  
            console.log('title: ' + courseData.title + '\n')  
            //console.log('number: ' + courseData.number)  
      
            courseData.videos.forEach(function(item) {  
                var chapterTitle = item.chapterTitle  
      
                console.log(chapterTitle)  
      
                item.videos.forEach(function(vedio) {  
                    console.log('---[' + vedio.id + ']' + vedio.title.trim())  
                })  
            })  
      
            console.log('------------------------------------' + '\n')  
        })  
    }  
      
    function getPageAsync(url) {  
        return new Promise(function(resolve, reject) {  
            console.log('正在爬取 ' + url)  
      
            // 拿到源码，调用方法进行解析及输出  
            http.get(url, function(res) {  
                var html = ''  
      
                res.on('data', function(data) {  
                    html += data  
                })  
      
                res.on('end', function() {  
                    resolve(html)  
                    // var courseData = filterChapters(html)  
                    // printCourseData(courseData)  
                })  
            }).on('error', function(e) {  
                reject(e)  
                console.log('获取课程数据出错！')  
            })  
        })  
    }  
      
    var fetchCourseArray = []  
      
    vedioIds.forEach(function(id) {  
        fetchCourseArray.push(getPageAsync(baseUrl + id))  
    })  
      
    Promise  
        .all(fetchCourseArray)  
        .then(function(pages) {  
            var coursesData = []  
      
            pages.forEach(function(html) {  
                var course = filterChapters(html)  
      
                coursesData.push(course)  
            })  
      
            // coursesData.sort(function(a, b) {  
            //     return a.number < b.number  
            // })  
      
            printCoursesData(coursesData)  
        })   
module.exports = router;