// mongoose 链接
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');

// 链接错误
db.on('error', function(error) {
    console.log(error);
});

//用户表Schema
var userSchema = new mongoose.Schema({
    "username": { "type": "String", "default": "匿名用户", "unique": true },
    "email": { "type": "String", "unique": true },
    "password": { "type": "String" },
    "createtime": { "type": "Date", "default": Date.now },
    "lastLogin": { "type": "Date", "default": Date.now }
}, {
    collection: 'users' //创建Model的时候定义collection的名字
});
//博客表
var blogSchema = new mongoose.Schema({
    "title": "String", //文章标题
    "href": "String", //文章链接
    "author": "String", //作者
    "authorhref": "String", //作者链接
    "content": "String", //文章简介
    "releaseTime": "String", //发布时间
    "remark": "String", //评论人数
    "Reading": "String", //阅读量
    "ReadingHraf": "String", //阅读量链接
    "type": { "type": "String", "default": "HTML5" }, //类型
    "createtime": { "type": "Date", "default": Date.now }
}, {
    collection: 'article' //创建Model的时候定义collection的名字
});
var blogContentSchema = new mongoose.Schema({
    "articleId": { "type": mongoose.Schema.Types.ObjectId, ref: 'article', }, //这里即为子表的外键，关联主表。  ref后的article代表的是主表article的Model。
    "title": "String", //文章标题
    "href": "String", //文章链接
    "content": "String", //文章内容
    "createtime": { "type": "Date", "default": Date.now }
}, {
    collection: 'articleContent' //创建Model的时候定义collection的名字
});
//日记表
var diarySchema = new mongoose.Schema({
    "diaryId": {
        "type": mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    "title": "String", //日记标题
    "content": "String", //日记内容
    "createtime": { "type": "Date", "default": Date.now }
}, {
    collection: 'diary' //创建Model的时候定义collection的名字
});
//留言表
var diarySchema = new mongoose.Schema({
    "diaryId": {
        "type": mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    "title": "String", //日记标题
    "content": "String", //日记内容
    "createtime": { "type": "Date", "default": Date.now }
}, {
    collection: 'diary' //创建Model的时候定义collection的名字
});
/*三个参数，第三个参数是实际的表名 没有的话，表名默认是第一个参数加s*/
var userModel = db.model('User', userSchema, 'users'); //相当于创建表
var userEntity = new userModel({ name: 'pizhen' });