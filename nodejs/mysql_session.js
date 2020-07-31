var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
 
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'expresstest'
};
 
// var connection = mysql.createConnection(options); // or mysql.createPool(options);

module.exports =  new MySQLStore(options);
