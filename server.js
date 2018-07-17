const express = require('express')
var bodyParser = require('body-parser');
var cors = require('cors');
var AWS = require('aws-sdk');
const morgan = require('morgan');
var mysql = require('mysql');

const pool  = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: 'employee'
  });

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    console.log("Connected!");
  });
  
const app = express()
app.use(cors());
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/test', (req, res) => {
console.log(req.query.username);
res.send('Hello World!: '+ req.query.username);

let  sql = "SELECT * FROM employees;"

pool.query(sql, (err,rows) => {
    if(err) throw err;
  
    console.log('Data received from Db:\n');
    console.log(rows);
  });


});

app.listen(3000, () => console.log('Example app listening on port 3000!'))