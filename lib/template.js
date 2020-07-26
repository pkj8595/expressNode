var sanitizeHtml = require('sanitize-html'); //html 스크립트 필터
module.exports = {
  HTML:function(title, list, body, control,authStatusUI='<a href="/auth/login">login</a>'){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${authStatusUI}
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
    list:function(topic){
    var list = '<ul>';
    var i = 0;
    while(i < topic.length){
      list = list + `<li><a href="/topic/${topic[i].id}">${sanitizeHtml(topic[i].title)}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}