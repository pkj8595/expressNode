const express = require('express');
var router =express.Router(); //라우터 선언 
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html'); //html 스크립트 필터
var template = require('../lib/template.js');
var db = require('../lib/db.js');



//app으로 접근했던 접두사를 router로 교체 
router.get('/create',function(request,response){
    
        db.query('SELECT * FROM topic', function (error, topics) {
            var title = 'Create';
            var list = template.list(topics);
            var control = `<a href="/topic/create">create</a>`;
            var body =`<form action="/topic/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>`;

            var html = template.HTML(title, list,body,control);
            response.send(html);
            });
});

router.post('/create_process',function(request, response){
        var post = request.body;
        db.query('INSERT INTO topic (title,description,created,author_id) VALUES(?,?,NOW(),?)',
         [post.title,post.description,1],
         function (error, result) {
            if(error){throw error;}
            response.redirect(`/topic/${result.insertId}`);
            
        });
});

router.get('/update/:pageId',function(request,response){
    var filteredId = path.parse(request.params.pageId).base;
    db.query('SELECT * FROM topic', function (error, topics) {
        db.query('SELECT * FROM topic WHERE id = ?',filteredId, function (error, topic) {
            var list = template.list(topics);
            var title = topic[0].title;
            var description = topic[0].description;
            var control = `<a href="/topic/create">create</a>`;
            var body =`
                    <form action="/topic/update_process" method="post">
                      <input type="hidden" name="id" value="${filteredId}">
                      <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                      <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                      </p>
                      <p>
                        <input type="submit">
                      </p>
                    </form>
                     `;

            var html = template.HTML(title, list,body,control);
            response.send(html);
        });
    });
         
});

router.post('/update_process',function(request,response){
          var post = request.body;
          var id = post.id;
          var title = post.title;
          var description = post.description;
            //파일의 이름을 바꿈.
          db.query('UPDATE topic SET title =?,description =? author_id=1 WHERE id = ?',
           [title,description,id], 
           function (error, topics) {
              if(error){throw error;}
              response.redirect(`/topic/${id}`);
          });
    
     
});

router.post('/delete_process',function(request,response){
          var post = request.body;
          var id = post.id;
          // var filteredId = path.parse(id).base;
          db.query('DELETE FROM topic WHERE id = ?',id, function (error, topics) {
                if(error){throw error;}
          response.redirect(`/`)
          }); 
});

//패스방식으로 url 구성
router.get('/:pageId', function(request, response,next) { 
    var filteredId = path.parse(request.params.pageId).base;
    console.log(filteredId);
    db.query('SELECT * FROM topic ', function (error, topics) {
        if(error){
               throw error
           }
        db.query('SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id = ?',filteredId, function (error, topic) {
            if(error){
               throw error
           }
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var control = `<a href="/topic/create">create</a> <a                     href="/topic/update/${filteredId}">update</a>
                    <form action="/topic/delete_process" method="post">
                      <input type="hidden" name="id" value="${filteredId}">
                      <input type="submit" value="delete">
                    </form>`;
            var body =`<h2>${title}</h2> ${description} <p>by ${topic[0].name}</p>`;

            var html = template.HTML(title, list,body,control);
            response.send(html);

        });
    });
});



module.exports = router; //모듈에 라우터를 붙여서 main에서 접근할 수 있게한다.