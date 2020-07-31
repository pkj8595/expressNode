var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var bodyParser = require('body-parser');




module.exports = function(passport){
    
    router.use(bodyParser.urlencoded({ extended: false }));
    router.get('/login', function (request, response) {
      var title = 'WEB - login';
        var list = [];
      // var list = template.list(request.list);
      var html = template.HTML(title, list, `
        <form action="/auth/login_process" method="post">
          <p><input type="text" name="emall" placeholder="email"></p>
          <p><input type="password" name="pwd" placeholder="password"></p>
          <p>
            <input type="submit" value="Log In">
          </p>
        </form>
      `,'');

      response.send(html);
    });

    //인증이 성공하면 함수가 실행된다. 
    router.post('/login_process',
      passport.authenticate('local', { successRedirect: '/',
                                       failureRedirect: '/auth/login' }));

    // app.post('/login_process',function (req, res, next) {
    //     // call passport authentication passing the "local" strategy name and a callback function
    //     passport.authenticate('local', function (error, user, info) {
    //       // this will execute in any case, even if a passport strategy will find an error
    //       // log everything to console
    //       console.log("passport err : "+error);
    //       console.log(user);
    //       console.log(info);

    //       // if (error) {
    //       //   res.status(401).send(error);
    //       // } else if (!user) {
    //       //   res.status(401).send(info);
    //       // } else {
    //       //   next();
    //       // }

    //       // res.status(401).send(info);
    //     })(req, res);
    //   });


    router.get('/logout', function (request, response) {
        request.logout();
        request.session.save(function(err){
            response.redirect('/');
        });
        // request.session.destroy(function(err){
        //     response.redirect('/');
        // });
    });
    return router;
};


