const express = require('express');
var router =express.Router(); //라우터 선언 
var template = require('../lib/template.js');
var db = require('../lib/db.js');
var auth = require('../lib/auth');


//route, routing
//app.get('/', (req, res) => res.send('Hello World!'))
router.get('/', function(request, response) { 
    console.log('/',request.user);
    
    db.query('SELECT * FROM topic', function (error, topics) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(topics);
    var control = `<a href="/topic/create">create</a>`;
    var body =`<h2>${title}</h2> ${description}
                 ""<img src="/img/cafe.jpg" 
                style="width : 300px; display : block; margin-top : 10px;">`;
        
    var html = template.HTML(title, list,body,control,auth.statusUI(request, response));
    response.send(html);

    });
    
  
});

module.exports = router; //모듈에 라우터를 붙여서 main에서 접근할 수 있게한다.