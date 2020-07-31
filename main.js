const express = require('express');
const app = express();
var fs = require('fs');
var qs = require('querystring');
var bodyParser = require('body-parser');
var db = require('./lib/db.js');
var helmet = require('helmet')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MySQLStore = require('express-mysql-session')(session);

// var FileStore = require('session-file-store')(session) // 세션을 파일에 저장 >>sql로 바꾸고 싶다면 sql을 받아와서 쓰면됨


    app.use(helmet());
    app.use(express.static('public'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
//정적인 파일(사진)을 서비스하려면 위에 두줄로 파일을 지정해줘야한다. 지정하면 url로 이미지를 불러올수 있음.

var sessionStore = require('./nodejs/mysql_session.js');

app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false, // >> 세션의 데이터가 바뀔시 데이터를 저장 true>> 데이터를 늘 저장.
    saveUninitialized: true, //세션을 호출하지 않는한 호출하지 않음. false >> 늘 세션을 호출함
     store: sessionStore// mysql session store
}));

var passport_token=require('./lib/passport_user.js')(app);

/*
//이렇게 사용할시 세션의 데이터는 메모리에 들어감 .. 그리고 서버가 꺼지면 메모리가 휘발됨. >> 세션의 데이터가 날아감
app.get('/sessionTest', function (req, res, next) {
    console.log(req.session);
    if(req.session.num === undefined){
        req.session.num = 1;
    } else {
        req.session.num =  req.session.num + 1;
    }
    res.send(`Views : ${req.session.num}`);
})
*/


//미들웨어 생성
//1 app.use(함수(req,res,next){}) 인수값은 req,res,next로 정해져 있음.  
//2 app.use(*,함수) , app.get(*,함수) , app.post(path,함수)미들웨어가 작동하는 메소드를 정해줄 수 있음.
//3 express에서 지금까지 쓰던 app.get || app.post는 미들웨어 였음. 
//4 미들웨어는 위에서 순차적으로 처리함.

// app.get('*',function(request,response,next){
//   fs.readdir('./data', function(error, filelist){ //data에 접근해서 파일이름을 가져온다.
//       request.list = filelist; //request변수에 list를 추가해서 filelist를 넣어준다. 
//       next(); //다음 미들웨어 호출.
//   });  
// });

var topicRouter = require('./routes/topic.js');
var indexRouter = require('./routes/index.js');
var authRouter = require('./routes/auth')(passport_token);

app.use('/topic',topicRouter); //topicRouter에 쓰여진 미들웨어를 topic 파일 위치로 가서 /topic url를 붙여서 접근한다.
app.use('/',indexRouter);
app.use('/auth', authRouter);




app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
    
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

    
    
app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});

    
