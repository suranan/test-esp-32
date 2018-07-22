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

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/topup', (req, res) => {

  let TagID = req.query.TagID;
  let UserID = req.query.UserID;
  let Passcode = req.query.Passcode;
  let Amount = req.query.Amount;
  let Lock_n = req.query.Lock_n;

  let sql_count = "SELECT count(1) as count  FROM `Money_Control` WHERE `TagID`='" + TagID + "'; "
  let sql_insert = "INSERT INTO `Money_Control`  (`TagID`,  `UserID`,  `Passcode`,  `Amount`,  `Lock_n`)  VALUES  ('" + TagID + "',  '" + UserID + "',  '" + Passcode + "',  '" + Amount + "',  '0');  "
  let sql_update = "UPDATE Money_Control`  SET  `UserID` = '" + UserID + "',  `Passcode` = '" + Passcode + "',  `Amount` = '" + Amount + "'  WHERE `TagID` = '" + TagID + "'";

  try {
    pool.query(sql_count, (err_count, rows_count) => {
      if (!err_count) {
        if (rows_count[0].count == 0) {
          pool.query(sql_insert, (err_insert, rows_insert) => {
            if (!err_insert) {
              res.send('success');
            } else {
              res.send('error');
            }
          });
        } else {
          pool.query(sql_update, (err_update, rows_update) => {
            if (!err_update) {
              res.send('success');
            } else {
              res.send('error');
            }
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});


app.post('/return', (req, res) => {

  let TagID = req.query.TagID;

  let sql_select = "SELECT *  FROM `Money_Control` WHERE `TagID`='" + TagID + "'; "

  let sql_update = "UPDATE Money_Control`  SET   `Amount` = '0',     WHERE `TagID` = '" + TagID + "'";

  try {
    pool.query(sql_select, (err_select, rows_select) => {
      if (!err_select) {
        pool.query(sql_update, (err_update, rows_update) => {
          if (!err_update) {
            res.send(rows_select[0].Amount + 'is returned');
          } else {
            res.send('error');
          }
        });
      } else {
        res.send('error');
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});


app.post('/pay', (req, res) => {

  let TagID = req.query.TagID;
  let Passcode = req.query.Passcode;
  let Lock_n = req.query.Lock_n;
  let NodeID = req.query.NodeID;
  let Ratting = req.query.Ratting;

  let sql_update = "UPDATE Money_Control`  SET   `Lock_n` = '" + Lock_n + "',     WHERE `TagID` = '" + TagID + "'";
  let sql_select = "SELECT * FROM `Money_Control` WHERE `TagID`='" + TagID + "' AND Lock_n < '3' AND `Passcode` = '" + Passcode + "',; "

  try {

    pool.query(sql_update, (err_select, rows_select) => {
      if (!err_select) {
        pool.query(sql_select, (err_select, rows_select) => {
          if (!err_select) {
            if (rows_select[0]) {

              let Amount = rows_select[0].Amount - req.query.Amount;

              if (Amount > 0) {
                let sql_update = "UPDATE Money_Control`  SET    `Amount` = '" + Amount + "', `Lock_n` ='" + Lock_n + "'   WHERE `TagID` = '" + TagID + "'";
                pool.query(sql_update, (err_update, rows_update) => {
                  if (!err_update) {
                    let sql_log = "INSERT INTO Log`  (`TagID`,  `UserID`,  `TimeStamp`,  `NodeID`,  `Ratting`,  `Amount`)  VALUES  ('" + TagID + "',  '" + rows_select[0].UserID + "',  NOW(),  '" + NodeID + "',  '" + Ratting + "',  '" + Amount + "');";
                    pool.query(sql_log, (err_log, rows_log) => {
                      if (!err_log) {
                        res.send('success');
                      } else {
                        res.send('error');
                      }
                    });
                  } else {
                    res.send('error');
                  }
                });
              } else {
                res.send('error');
              }
            } else {
              res.send('error');
            }
          }

        });
      }
      else {
        res.send('error');
      }

    });

  } catch (e) {
    console.log(e);
    res.send('error');
  }
});


app.post('/ratting', (req, res) => {

  let TagID = req.query.TagID;
  let Ratting = req.query.Ratting;

  let sql_select = "SELECT *  FROM `Log` WHERE `TagID`='" + TagID + "' AND TimeStamp = ( SELECT MAX(TimeStamp) FROM `Log` WHERE `TagID`='" + TagID + "' ); "

  try {
    pool.query(sql_select, (err_select, rows_select) => {
      if (!err_select) {
        let sql_update = "UPDATE Log`  SET   `Ratting` = '" + Ratting + "',     WHERE `LogID` = '" + rows_select[0].LogID + "'";
        pool.query(sql_update, (err_update, rows_update) => {
          if (!err_update) {
            res.send(rows_select[0].Amount + 'is returned');
          } else {
            res.send('error');
          }
        });
      } else {
        res.send('error');
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))