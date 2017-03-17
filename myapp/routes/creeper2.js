  var http = require('http');   //引入nodejs的http模块，该模块用于构建http服务和作为HttpClient使用。
  var promise = require('promise'); //对异步编程进行流程控制，更加符合后端程序员的编程习惯。
  var cheerio = require('cheerio'); //可以理解为服务端的Jquery。使用方法和客户端一样。
  var request = require('request');
  var express = require('express');
  var fs =require('fs');
  var router = express.Router();
  var MongoDB = require('../Model/db2.js');
  var url = 'http://www.cnblogs.com/cate/html5/#p'; //要抓取的网址。博客园的页数是通过添加锚点的，后面有拼接
  
   
   //Promise 在任何情况下都处于以下三种状态中的一种：
   //未完成（unfulfilled）、已完成（resolved）和拒绝（rejected）
  //事件已完成则使用成功的callback（resolve）返回自身，失败了则
  //选择使用callback(reject)来返回失败的自身。
 function getPageList(url){
     //return Promise对象
     return new Promise(function(resolve,reject) {
          http.get(url,function(res) {
             var body = '';
  
             //当接受到数据的时候，http是执行范围请求的。所以每个范围请求就是一个chunk。
             res.on('data', function(chunk) {
                 //buffer是一种node处理二进制信息的格式，不必理会。
                 res.setEncoding('utf8'); //设置buffer字符集
                 body += chunk;           //拼接buffer
              });
  
             //当整个http请求结束的时候
             res.on('end', function() {
                 var $ = cheerio.load(body);  //将html变为jquery对象。
                  var articleList = $('.post_item');
                 var  articleArr = [];
                 articleList.each(function() {
                     var curEle = $(this);
                      var title  = curEle.find('.post_item_body h3').text().trim();  //获取标题
                     var href = curEle.find('.post_item_body h3 a').attr('href'); //文章链接
                     var author =curEle.find('.post_item_foot .lightblue').text().trim();
                     var authorhref =curEle.find('.post_item_foot .lightblue').attr('href');
                     var content   =curEle.find('.post_item_body .post_item_summary').text().trim();

                     var patt=/\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{1,2}/;  //匹配时间
                     var time=patt.exec(curEle.find('.post_item_foot').text().trim());
                     var releaseTime=time[0];
                     var pattime=/\d+/; //匹配数字
                     var remarknum=pattime.exec(curEle.find('.post_item_foot .article_comment a').text().trim())
                     var remark=remarknum[0];                     
                     var remarkHraf=curEle.find('.post_item_foot .article_comment a').attr('href');
                     var readnum=pattime.exec(curEle.find('.post_item_foot .article_view a').text().trim())
                     var Reading=readnum[0];                     
                     var ReadingHraf=curEle.find('.post_item_foot .article_view a').attr('href');

                     articleArr.push({
                         title:title,
                         href:href,
                         author:author,
                         authorhref:authorhref,
                         content:content,
                         releaseTime:releaseTime,
                         remark:remark,
                         Reading:Reading,
                         ReadingHraf:ReadingHraf

                      });
                     
 
                  });
                 
                 //成功的状态使用resolve回调函数。
                 resolve(articleArr);
 
             });
 
             //当执行http请求失败的时候，返回错误信息
             res.on('error', function(e) {
                 reject(e.message);
             }); 
 
        });
    });
 }
  
 //请求博客园前10页的数据。将所有的请求预先放置在集合内。
 var list = [];
 for(var i=1;i<=10;i++) {
     var url = url+i;
     list.push(getPageList(url));
 
 }
  function setFile(file,index){
         return new Promise(function(resolve, reject) {
              console.log('正在存储');
             MongoDB.save('article',file, function (err, res) {
                console.log('存储成功');
            });
            //  fs.writeFile('../datas/datas'+index+'.json', file, 'utf-8', function (err) { //生成文件存储
            //     if (err) {
            //         reject(err);
            //         console.log('存储数据失败');
            //     }else{
            //         resolve(file);
            //     }
            // });
         });
    }
    function writeFileAsync(filelist){
         Promise  
        .all(filelist)
        .then(function(data) {
            console.log('数据存储成功')
        }).catch(function(err){
            console.log(err);
        });
    }
 //调用Promise的下面的all方法。参数是一个事件集合。
 //Promise将会进行异步执行。但是最后的返回时机要根据最耗时的那个请求为标准。
 //then(),可以接受两个参数（callback）.第一个参数是成功（resolved）的回调。
 //第二个参数是执行上个操作失败（rejected）的回调。
 var files=[];
 Promise  
    .all(list)
     .then(function(data) {
         data.forEach(function(data,index){
          for(var i=0;i<data.length;i++){
            files.push(setFile(data[i]));
           }
         });
         writeFileAsync(files);
      }).catch(function(err){
        console.log(err);
      });

      module.exports = router;