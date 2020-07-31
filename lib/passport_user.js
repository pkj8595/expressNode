
module.exports=function(app){
    
var authData = {
  email: 'user',
  password: '1',
  nickname: 'user_nickname'
}

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

//로그인시 호출
passport.serializeUser(function(user, done) {
    console.log('serializeUser',user);
    done(null, user.email);
});

//로그인을 하고 페이지에 방문될때마다 호출됨 그리고 호출되면 데이터가 저장되어있는 곳에서 데이터를 가져옴
//매개변수 id : 세션에 저장된 id가 매개변수로 들어가고 id로 로그인 데이터를 조회한다.
passport.deserializeUser(function(id, done) {
    console.log('deserializeUser',id);
    done(null, authData)
});


//from
passport.use(new LocalStrategy({
  usernameField : 'emall',
  passwordField : 'pwd',
},
  function( username, password, done) {
    //user 정보를 가져와서 서버에 저장되어있는 정보와 비교 
      console.log(username ,password);
      if(username === authData.email){
          console.log('email check!');
          if(password === authData.password){
            console.log('password check!');
            return done(null, authData);
          } else {
            console.log('password dif');
            return done(null, false, {
              message: 'Incorrect password.'
            });
          }
      }else {
      console.log('email dif');
      return done(null, false, {
        message: 'Incorrect username.'
      });
    }
      
    // User.findOne({ username: username }, function(err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });
  }
));
    
    return passport;
};

