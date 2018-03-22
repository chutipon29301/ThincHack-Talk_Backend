require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs-extra');
var path = require('path');
var Twitter = require('twitter');

var app = express();
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    next();
});
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// TODO: Make express send static files

// Config port for server
app.listen(process.env.PORT, _ => {
    console.log('Listening to port ' + process.env.PORT);
});

// Connect to SQL database
con.connect(err => {
    if (err) throw err;
    console.log('Connected');

    // TODO: Fill in method for add user into database
    // SQL Hint: use `INSERT INTO user VALUE("example@email.com","yourname","yourpassword")`
    app.post('/register', (req, res) => {});

    // TODO: Fill in method for check if user is exist in the database and also check if the password is correct
    // SQL Hint: use `SELECT * FROM user WHERE [your condition]` to get the array of object that match yoour condition
    app.post('/login', (req, res) => {});

    // TODO: Find the name of the given email
    // Hint: Use the same query statement like login
    app.get('/name', (req, res) => {});

    // This method list all the user in the database
    app.get('/list', (req, res) => {
        con.query('SELECT * FROM user', (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(200).send(result);
        });
    });

    // This method return the sum of 2 numbers
    app.get('/add', (req, res) => {
        var a = parseInt(req.query.a);
        var b = parseInt(req.query.b);
        return res.status(200).send(a + b + '');
    });

    // This method return the specific image from non public folder
    // path.join is use 
    app.get('/getimage', (req, res) => {
        return res.status(200).sendFile(path.join(__dirname, '../secret_image/Cherprang.jpg'));
    });


    // TODO: Return random selected image in folder
    // Hint: use `fs.readdirSync(path)` to get the list of file name in folder
    app.get('/image', (req, res) => {});


    // Additional: Return modified search result of twitter
    // For more information about twitter lib [https://github.com/desmondmorris/node-twitter/tree/master/examples#search]
    app.post('/searchTweet', (req, res) => {
    });

    app.all('*', (req, res) => {
        return res.status(200).sendFile(path.join(__dirname, '../public/404.html'));
    });
});