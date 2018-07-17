const express = require('express')
var bodyParser = require('body-parser');
var cors = require('cors');
var AWS = require('aws-sdk');
const morgan = require('morgan');
var mysql = require('mysql');

const pool = mysql.createPool({
  host: "ec2-13-250-39-130.ap-southeast-1.compute.amazonaws.com",
  user: "myuser",
  password: "mypass",
  database: 'Project'
});

pool.getConnection(function (err, connection) {
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
  res.send('Hello World!: ' + req.query.username);

  let sql = "SELECT * FROM employees;"

  pool.query(sql, (err, rows) => {
    if (err) throw err;

    console.log('Data received from Db:\n');
    console.log(rows);
  });


});

app.post('/register', (req, res) => {
  try {

    let TagID = req.query.TagID;
    let Passcode = req.query.Passcode;
    let Amount = req.query.Amount;

    let sql = "INSERT INTO `00_Passcode_Money`  (`TagID`,  `Passcode`,  `Amount`)  VALUES  ('" + TagID + "',  '" + Passcode + "',  '" + Amount + "'); "

    pool.query(sql, (err, rows) => {
      if (!err) {
        res.send('success');
      }
    });

  } catch (e) {
    res.send('error');
  }
});


app.post('/DupCheck', (req, res) => {
  try {

    let TagID = req.query.TagID;

    let sql = "SELECT count(1) as count  FROM `00_Passcode_Money` WHERE `TagID`='" + TagID + "'; "

    pool.query(sql, (err, rows) => {
      if (!err) {
        if (rows[0].count == 0) {
          res.send('success');
        } else {
          res.send('error');
        }
      }
    });

  } catch (e) {
    res.send('error');
  }
});


app.post('/update', (req, res) => {
  try {
    let TagID = req.query.TagID;
    let Passcode = req.query.Passcode;
    let Amount = req.query.Amount;

    let sql = "UPDATE `00_Passcode_Money`  SET  `Passcode` = '" + Passcode + "',  `Amount` = '" + Amount + "'  WHERE `TagID` ='" + TagID + "' ;  ";
console.log(sql);
    pool.query(sql, (err, rows) => {
      if (!err) {
        res.send('success');
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }

});


app.post('/return', (req, res) => {
  try {
    let TagID = req.query.TagID;

    let sql = "UPDATE `00_Passcode_Money`  SET  `Passcode` = '0000',  `Amount` = '0'  WHERE `TagID` ='" + TagID + "' ;  ";
    console.log(sql);
    pool.query(sql, (err, rows) => {
      if (!err) {
        res.send('success');
      }
    });
  } catch (e) {
    res.send('error');
  }

});

app.listen(3000, () => console.log('Example app listening on port 3000!'))