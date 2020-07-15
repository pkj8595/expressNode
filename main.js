const express = require('express');
const app = express();
var fs = require('fs');
var path = require('path');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
//정적인 파일(사진)을 서비스하려면 이렇게 파일을 지정해줘야한다. 지정하면 url로 이미지를 불러올수 있음.

//미들웨어 생성
//1 app.use(함수(req,res,next){}) 인수값은 req,res,next로 정해져 있음.  
//2 app.use(*,함수) , app.get(*,함수) , app.post(path,함수)미들웨어가 작동하는 메소드를 정해줄 수 있음.
//3 express에서 지금까지 쓰던 app.get || app.post는 미들웨어 였음. 
//4 미들웨어는 위에서 순차적으로 처리함.

app.get('*',function(request,response,next){
  fs.readdir('./data', function(error, filelist){ //data에 접근해서 파일이름을 가져온다.
      request.list = filelist; //request변수에 list를 추가해서 filelist를 넣어준다. 
      next(); //다음 미들웨어 호출.
  });  
});

//route, routing
//app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', function(request, response) { 
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(request.list);
          var html = template.HTML(title, list,`<h2>${title}</h2> ${description}<img src="/img/cafe.jpg" style="width : 300px; display : block;">`,`<a href="/create">create</a>`);
          response.send(html);
});

//패스방식으로 url 구성
app.get('/page/:pageId', function(request, response,next) { 
          var filteredId = path.parse(request.params.pageId).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
              if(err){
                 next(err); // 에러 미들웨어로 이동
             }else{
                var title = request.params.pageId; //pageId를 url에서 가져옴
                var sanitizedTitle = sanitizeHtml(title); //타이틀 필터링
                var sanitizedDescription = sanitizeHtml(description, {
                  allowedTags:['h1'] //스크립트 필터링 && h1태크 허용
                });
                var list = template.list(request.list); //request에 넣어준 list 를 불러온다.
                var html = template.HTML(sanitizedTitle, list,
                  `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                  ` <a href="/create">create</a>
                    <a href="/update/${sanitizedTitle}">update</a>
                    <form action="/delete_process" method="post">
                      <input type="hidden" name="id" value="${sanitizedTitle}">
                      <input type="submit" value="delete">
                    </form>`
                );
                response.send(html);
             }

          });
});

app.get('/create',function(request,response){
        var title = 'WEB - create';
        var list = template.list(request.list);
        var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
        response.send(html);
});

app.post('/create_process',function(request, response){
          var post = request.body;
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.redirect(`/page/${title}`);
          });
});

app.get('/update/:pageId',function(request,response){
        var filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          var title = request.params.pageId;
          var list = template.list(request.list);
          var html = template.HTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.send(html);
        });
});

app.post('/update_process',function(request,response){
          var post = request.body;
          var id = post.id;
          var title = post.title;
          var description = post.description;
            //파일의 이름을 바꿈.
          fs.rename(`data/${id}`, `data/${title}`, function(error){
              //파일의 내용을 바꿈.
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.redirect(`/page/${title}`);
            })
          });
     
});

app.post('/delete_process',function(request,response){
          var post = request.body;
          var id = post.id;
          var filteredId = path.parse(id).base;
            //해당 파일 삭제
          fs.unlink(`data/${filteredId}`, function(error){
          response.redirect(`/`);
          })

});

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

    
