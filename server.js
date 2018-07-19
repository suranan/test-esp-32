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

app.post('/CheckDup_UserID', (req, res) => {
  try {

    let UserID = req.query.UserID;

    let sql = "SELECT count(1) as count  FROM `user_info` WHERE `UserID`='" + UserID + "'; "
    console.lo

    pool.query(sql, (err, rows) => {
      if (!err) {
        console.log(rows[0].count)
        if (rows[0].count == 0) {
          console.log('success');
          res.send('success');
        } else {
          console.log('error');
          res.send('error');
        }
      }
    });

  } catch (e) {
    console.log(e);
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

app.post('/registerUser', (req, res) => {
  try {

    let UserID = req.query.UserID;
    let Name = req.query.Name;
    let DateofBirth = req.query.DateofBirth;
    let Sex = req.query.Sex;
    let Tel = req.query.Tel;
    let Address = req.query.Address;

    let TagID = req.query.TagID;
    let NodeID = req.query.NodeID;

    let sql = "INSERT INTO `User_Info`  (`UserID`, `Name`, `DateofBirth`, `Sex`, `Tel`, `Address`)  VALUES  ('" + UserID + "',  '" + Name + "',  '" + DateofBirth + "',  '" + Sex + "',  '" + Tel + "',  '" + Address + "'); "
    //  let sql2 = "INSERT INTO `log`  (`UserID`, `TagID`, `Timestamp`, `NodeID`)  VALUES  ('" + UserID + "',  '" + TagID + "',  now(),  '" + NodeID + "'); "
    console.log(sql);
    pool.query(sql, (err, rows) => {
      if (!err) {
        //    pool.query(sql2, (err, rows) => {
        //      if (!err) {
        res.send('success');
        //      }
        //    });
      } else {
        console.log(err);
      }
    });
  } catch (e) {
    console.log(e);
    res.send('error');
  }

});


app.post('/user-update', (req, res) => {
  try {

    let UserID = req.query.UserID;
    let Name = req.query.Name;
    let DateofBirth = req.query.DateofBirth;
    let Sex = req.query.Sex;
    let Tel = req.query.Tel;
    let Address = req.query.Address;

    // let TagID = req.query.TagID;
    // let NodeID = req.query.NodeID;

    let sql = "UPDATE `User_Info`  SET `Name` = '" + Name + "',`DateofBirth` = '" + DateofBirth + "',`Sex` = '" + Sex + "',`Tel` = '" + Tel + "',  `Address` = '" + Address + "'  WHERE `UserID` ='" + UserID + "' ;  ";
    // let sql2 = "INSERT INTO `log`  (`UserID`, `TagID`, `Timestamp`, `NodeID`)  VALUES  ('" + UserID + "',  '" + TagID + "',  now(),  '" + NodeID + "'); "

    pool.query(sql, (err, rows) => {
      if (!err) {
        //     pool.query(sql2, (err, rows) => {
        //       if (!err) {
        res.send('success');
        //      }
        //    });

      } else {
        console.log(err);
      }
    });
  } catch (e) {
    res.send('error');
  }

});



app.post('/CheckOLD_UserID', (req, res) => {
  try {

    let UserID = req.query.UserID;

    let sql = "SELECT * FROM `User_Info`  WHERE `UserID` ='" + UserID + "' ;  ";
    console.log(sql);
    pool.query(sql, (err, rows) => {
      if (!err) {     
        console.log(rows);
        res.send("*************************\nข้อมูลเดิม\n*************************\nUserID : "+rows[0].UserID+"\nName : "+rows[0].Name+"\nDateofBirth : "+rows[0].DateofBirth+"\nSex : "+rows[0].Sex+"\nTel : "+rows[0].Tel+"\nAddress : "+rows[0].Address+"\n*************************");

      } else {
        console.log(err);
        res.send("error");
      }
    });
  } catch (e) {
    res.send('error');
  }

});

app.listen(3000, () => console.log('Example app listening on port 3000!'))