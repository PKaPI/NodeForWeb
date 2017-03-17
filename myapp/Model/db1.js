// mongoose 链接
var mongoose = require('mongoose');
var db       = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');

// 链接错误
db.on('error', function(error) {
    console.log(error);
});

//用户表Schema
var userSchema = new mongoose.Schema({
	username:{ type:String,default:'匿名用户',unique:true},  //唯一
	email:{type:String, unique:true},
	password:{type:String},
	createtime:{type:Date,default:Date.now},
	lastLogin :{type:Date,default:Date.now}
},
 {
     collection: 'users'   //创建Model的时候定义collection的名字
   }
 );
// 添加 mongoose 实例方法
userSchema.methods.findbyusername = function(username, callback) {
    return this.model('users').find({ username: username }, callback);
};

// 添加 mongoose 静态方法，静态方法在Model层就能使用
userSchema.statics.findbyemail = function(email, callback) {
    return this.model('users').find({ email: email }, callback);
};

/*三个参数，第三个参数是实际的表名 没有的话，表名默认是第一个参数加s*/
var userModel = db.model('User', userSchema, 'users'); //相当于创建表
var userEntity = new userModel({name:'pizhen'});

 userModel.create({
     username: 'pizhens',
     email: 'simon@thselmesoffice.com',
     password:'123456',
     createtime:Date.now(),
     lastLogin : Date.now()
 }, function( err, user ){
     if(!err){
         console.log('User saved!');
         console.log('Saved user name: ' + user.name);
         console.log('_id of saved user: ' + user._id);
    }else{
    	console.log(err)
    }
 });
