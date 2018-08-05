const express = require('express')
var bodyParser = require('body-parser');
var cors = require('cors');
var AWS = require('aws-sdk');
const morgan = require('morgan');
var mysql = require('mysql');
const path = require('path');

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

//app.get('/', (req, res) => res.send('Hello World!'));

app.post('/api/topup', (req, res) => {

  let TagID = req.query.TagID;
  let UserID = req.query.UserID;
  let Passcode = req.query.Passcode;
  let Amount = req.query.Amount;
  let Lock_n = req.query.Lock_n;

  let sql_count = "SELECT count(1) as count  FROM `Money_Control` WHERE `TagID`='" + TagID + "'; "
  let sql_insert = "INSERT INTO `Money_Control`  (`TagID`,  `UserID`,  `Passcode`,  `Amount`,  `Lock_n`)  VALUES  ('" + TagID + "',  '" + UserID + "',  '" + Passcode + "',  '" + Lock_n + "',  '0');  "
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

app.post('/api/insert-topup', (req, res) => {

  let TagID = req.query.TagID;
  let UserID = req.query.UserID;
  let Passcode = req.query.Passcode;
  let Amount = req.query.Amount;
  let Lock_n = req.query.Lock_n;

  let sql_insert = "INSERT INTO `Money_Control`  (`TagID`,  `UserID`,  `Passcode`,  `Amount`,  `Lock_n`)  VALUES  ('" + TagID + "',  '" + UserID + "',  '" + Passcode + "',  '" + Amount + "' , '" + Lock_n + "');  "


  let sql_log = "INSERT INTO `Log`  (`TagID`,  `UserID`,  `TimeStamp`,  `NodeID`,  `Amount`)  VALUES  ('" + TagID + "',  '" + UserID + "',  NOW(),  'node00',  '" + Amount + "');";



  try {

    pool.query(sql_insert, (err_insert, rows_insert) => {
      if (!err_insert) {
        pool.query(sql_log, (err_log, rows_log) => {
          if (!err_log) {
            res.send('success');
          } else {
            console.log(err_log);
            res.send('error');
          }
        });
      } else {
        console.log(err_insert)
        res.send('error');

      }
    });

  } catch (e) {
    console.log(e);
    res.send('error');
  }
});


app.post('/api/update-topup', (req, res) => {

  let TagID = req.query.TagID;
  let Amount = req.query.Amount;

  let sql_select = "SELECT Amount  FROM `Money_Control` WHERE `TagID`='" + TagID + "'; "
  let sql_select2 = "SELECT UserID  FROM `Money_Control` WHERE `TagID`='" + TagID + "'; "

  try {


    pool.query(sql_select, (err_select, row_select) => {
      if (!err_select) {
        Amount = parseInt(Amount) + parseInt(row_select[0].Amount);
        let sql_update = "UPDATE `Money_Control`  SET  `Amount` = '" + Amount + "'  WHERE `TagID` = '" + TagID + "';";
        pool.query(sql_update, (err_update, rows_update) => {
          if (!err_update) {
            pool.query(sql_select2, (err_select2, rows_update2) => {

              if (!err_select2) {
                let sql_log = "INSERT INTO `Log`  (`TagID`,  `UserID`,  `TimeStamp`,  `NodeID`,  `Amount`)  VALUES  ('" + TagID + "',  '" + rows_update2[0].UserID + "',  NOW(),  'node00',  '" + req.query.Amount + "');";
                pool.query(sql_log, (err_log, rows_log) => {
                  if (!err_log) {
                    res.send('success');
                  } else {
                    console.log(err_log);
                    res.send('error');
                  }
                });
              } else {
                console.log(err_select2);
                res.send('error');
              }
            });
          } else {
            console.log(err_update);
            res.send('error');
          }
        });
      } else {
        console.log(err_select);
        res.send('error');
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});

app.post('/api/check-tagID', (req, res) => {

  let TagID = req.query.TagID;

  let sql_count = "SELECT count(1) as count  FROM `Money_Control` WHERE `TagID`='" + TagID + "'; "

  try {
    pool.query(sql_count, (err_count, rows_count) => {
      if (!err_count) {
        if (rows_count[0].count == 0) {
          res.send('0');
        } else {
          res.send('1');
        }
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});

app.post('/api/check-amount', (req, res) => {

  let TagID = req.query.TagID;

  let sql_select = "SELECT *  FROM `Money_Control` WHERE `TagID`='" + TagID + "'; "

  try {
    pool.query(sql_select, (err_select, rows_select) => {
      if (!err_select) {
        if (rows_select[0].Amount) {
          let aa = String(rows_select[0].Amount);
          res.send(aa);
        } else {
          console.log(sql_select);
          console.log(err_select);
          res.send('error');
        }
      } else {
        console.log(sql_select);
        console.log(err_select);
        res.send('error');
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});

app.post('/api/check-pin', (req, res) => {

  let TagID = req.query.TagID;
  let Passcode = req.query.Passcode;
  let Lock_n;

  let sql_count = "SELECT count(1) as count  FROM `Money_Control` WHERE `TagID`='" + TagID + "' AND `Passcode`='" + Passcode + "'; "
  let sql_select = "SELECT *  FROM `Money_Control` WHERE `TagID`='" + TagID + "'; "
  try {
    pool.query(sql_count, (err_count, rows_count) => {
      if (!err_count) {

        if (rows_count[0].count != '0') {
          console.log('count 1');
          pool.query(sql_select, (err_select, rows_select) => {
            if (!err_select) {
              if (parseInt(rows_select[0].Lock_n) < 3) {
                console.log('T');
                res.send('T');
              } else {
                console.log('L');
                res.send('L');
              }
            } else {
              res.send('F');
            }
          });
        } else {
          console.log('count 0');
          pool.query(sql_select, (err_select, rows_select) => {

            console.log(sql_select);
            if (!err_select) {
              if (parseInt(rows_select[0].Lock_n) < 3) {

                console.log(rows_select);
                Lock_n = parseInt(rows_select[0].Lock_n) + 1;
                let sql_update = "UPDATE `Money_Control`  SET   `Lock_n` = '" + Lock_n + "' WHERE `TagID` = '" + TagID + "'";

                console.log(sql_update);

                pool.query(sql_update, (err_update, rows_update) => {
                  if (!err_update) {
                    res.send('F');
                  } else {
                    res.send('F');
                  }
                });
              } else {
                res.send('L');
              }
            } else {
              console.log(err_select);
              res.send('F');
            }
          });
        }
      } else {
        console.log(sql_count);
        console.log(err_count);
        res.send('F');
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});


app.post('/api/delete-tag', (req, res) => {

  let TagID = req.query.TagID;
  let sql_delete = "DELETE  FROM `Money_Control` WHERE `TagID`='" + TagID + "'; "
  let sql_select2 = "SELECT UserID, Amount  FROM `Money_Control` WHERE `TagID`='" + TagID + "'; "
  try {
    pool.query(sql_select2, (err_select2, rows_update2) => {
      if (!err_select2) {
        pool.query(sql_delete, (err_delete, row_delete) => {
          if (!err_delete) {

            let sql_log = "INSERT INTO `Log`  (`TagID`,  `UserID`,  `TimeStamp`,  `NodeID`,  `Amount`)  VALUES  ('" + TagID + "',  '" + rows_update2[0].UserID + "',  NOW(),  'node00',  '-" + rows_update2[0].Amount + "');";
            pool.query(sql_log, (err_log, rows_log) => {
              if (!err_log) {
                res.send('success');
              } else {
                console.log(err_log);
                res.send('error');
              }
            });
          } else {
            console.log(sql_delete);
            console.log(err_delete);
            res.send('error');
          }
        });
      } else {
        console.log(err_select2);
        res.send('error');
      }
    });


  } catch (e) {
    console.log(e);
    res.send('error');
  }
});


app.post('/api/return', (req, res) => {

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


app.post('/api/pay', (req, res) => {

  let TagID = req.query.TagID;
  let NodeID = req.query.NodeID;
  let Amount = req.query.Amount;

  let sql_select = "SELECT * FROM `Money_Control` WHERE `TagID`='" + TagID + "'; "

  try {

    pool.query(sql_select, (err_select, rows_select) => {
      if (!err_select) {
        if (rows_select[0]) {

          Amount = parseInt(rows_select[0].Amount) - parseInt(req.query.Amount);
          console.log(Amount);
          if (Amount >= 0) {
            let sql_update = "UPDATE `Money_Control`  SET    `Amount` = '" + Amount + "'  WHERE `TagID` = '" + TagID + "'";
            pool.query(sql_update, (err_update, rows_update) => {
              if (!err_update) {
                let sql_log = "INSERT INTO `Log`  (`TagID`,  `UserID`,  `TimeStamp`,  `NodeID`,  `Amount`)  VALUES  ('" + TagID + "',  '" + rows_select[0].UserID + "',  NOW(),  '" + NodeID + "',  '-" + req.query.Amount + "');";
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
            console.log('E')
            res.send('E');
          }
        } else {
          res.send('error');
        }
      }

    });


  } catch (e) {
    console.log(e);
    res.send('error');
  }
});


app.post('/api/rating', (req, res) => {

  let TagID = req.query.TagID;
  let Rating = req.query.Rating;
  let NodeID = req.query.NodeID;

  let sql_select = "SELECT *  FROM `Log` WHERE `TagID`='" + TagID + "' AND TimeStamp = ( SELECT MAX(TimeStamp) FROM `Log` WHERE `TagID`='" + TagID + "' AND NodeID = '" + NodeID + "' ); "
  try {
    pool.query(sql_select, (err_select, rows_select) => {
      if (!err_select) {
        if (rows_select[0]) {
          let sql_update = "UPDATE `Log`  SET   `Ratting` = '" + Rating + "'     WHERE `LogID` = '" + rows_select[0].LogID + "'";
          console.log(sql_update);
          pool.query(sql_update, (err_update, rows_update) => {
            if (!err_update) {
              res.send('success');
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
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});



app.post('/api/create-user', (req, res) => {

  let UserID = req.query.UserID;
  let Name = req.query.Name;
  let DateofBirth = req.query.DateofBirth;
  let Sex = req.query.Sex;
  let Tel = req.query.Tel;
  let Address = req.query.Address;


  let sql_insert = "INSERT INTO `User_Info`(`UserID`,`Name`,`DateofBirth`,`Sex`,`Tel`,`Address`)VALUES('" + UserID + "','" + Name + "','" + DateofBirth + "','" + Sex + "','" + Tel + "','" + Address + "');  "

  try {
    pool.query(sql_insert, (err_insert, rows_insert) => {
      if (!err_insert) {
        res.send({ 'success': true, 'massage': 'success' });
      } else {
        console.log(err_insert);
        console.log(sql_insert);
        res.send({ 'success': false, 'massage': 'not success' });
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});


app.post('/api/check-bl', (req, res) => {

  let TagID = req.query.TagID;


  let sql_count = "SELECT *  FROM `Money_Control` WHERE `TagID`='" + TagID + "'; "

  try {
    pool.query(sql_count, (err_count, rows_count) => {
      if (!err_count) {
        if (rows_count[0]) {
          let aa = String(rows_count[0].Amount);
          res.send(aa);
        } else {
          res.send('error');
        }
      } else {
        res.send('error');
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});


app.post('/api/check-user', (req, res) => {

  let UserID = req.query.UserID;


  let sql_count = "SELECT * FROM `User_Info` WHERE UserID = '" + UserID + "'";

  try {
    pool.query(sql_count, (err_count, rows_count) => {
      if (!err_count) {
        if (rows_count[0]) {
          res.send({ 'success': true, 'massage': rows_count[0] });
        } else {
          res.send({ 'success': false, 'massage': 'not success' });
        }
      } else {
        res.send({ 'success': false, 'massage': 'not success' });
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});


app.post('/api/update-user', (req, res) => {

  let UserID = req.query.UserID;
  let Name = req.query.Name;
  let DateofBirth = req.query.DateofBirth;
  let Sex = req.query.Sex;
  let Tel = req.query.Tel;
  let Address = req.query.Address;


  let sql_update = "UPDATE `User_Info`SET `Name` = '" + Name + "',`DateofBirth` = '" + DateofBirth + "',`Sex` = '" + Sex + "',`Tel` = '" + Tel + "',`Address` = '" + Address + "'WHERE `UserID` = '" + UserID + "';";

  try {
    pool.query(sql_update, (err_update, rows_update) => {
      if (!err_update) {
        res.send({ 'success': true, 'massage': 'success' });
      } else {
        res.send({ 'success': false, 'massage': 'not success' });
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});

app.post('/api/get-rec', (req, res) => {

  let sql_update = "SELECT NodeID,count(1) as Qty  from Log  where NodeID<>'node00'  and `TimeStamp` >= DATE_ADD(now(), INTERVAL -5 MINUTE)  group by NodeID  order by count(1) asc;";

  try {
    pool.query(sql_update, (err_update, rows_update) => {
      if (!err_update) {
        if (rows_update[0] != undefined) {
          res.send({ 'success': true, 'massage': rows_update });
        } else {
          res.send({ 'success': true, 'massage': [] });
        }
      } else {
        res.send({ 'success': false, 'massage': 'not success' });
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});

app.post('/api/get-rec1', (req, res) => {

  let sql_update = "select a.NodeID,count(1) as QTY FROM Log as a LEFT JOIN Node_Name as b  ON a.NodeID = b.Node_ID  where DATE(a.`TimeStamp`) = CURDATE() and a.nodeID <> 'node00'  and (     select count(DISTINCT NodeID)      FROM Log where DATE(`TimeStamp`) = CURDATE() and nodeID <> 'node00'     )=3  group by a.nodeID,b.Node_Price  order by count(1),b.Node_Price desc  LIMIT 1";
  try {
    pool.query(sql_update, (err_update, rows_update) => {
      console.log(rows_update);
      if (!err_update) {
        if (typeof (rows_update[0].NodeID) != 'undefined') {
          res.send(rows_update[0].NodeID);
        } else {
          res.send('');
        }
      } else {
        res.send('error');
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});

app.post('/api/now', (req, res) => {

  let sql_update = 'SELECT DATE_FORMAT(NOW(),"@%Y/%m/%d %H:%i:%s") as now';

  try {
    pool.query(sql_update, (err_update, rows_update) => {
      if (!err_update) {

        res.send(rows_update[0].now);

      } else {
        res.send('error');
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});

app.post('/api/reset', (req, res) => {

  let TagID = req.query.TagID;

  let sql_update = "UPDATE Money_Control`  SET  `Lock_n` = '0'  WHERE `TagID` = '" + TagID + "'";

  try {
    pool.query(sql_update, (err_update, rows_update) => {
      if (!err_update) {

        res.send('success');

      } else {
        res.send('error');
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
});

app.use(express.static(path.join(__dirname, './views/dist/views')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './views/dist/views/index.html'));
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))
