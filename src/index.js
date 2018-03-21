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
app.use(express.static('public'));

app.listen(process.env.PORT | 3000, () => {
    console.log('Listening on port 3000');
});

con.connect(err => {
    if (err) throw err;
    console.log('Connected');

    /**
     * Register user
     */
    app.post('/register', (req, res) => {
        if (!(req.body.email && req.body.name && req.body.password)) return res.status(400).send('Bad Request');
        con.query('INSERT INTO user VALUE("' + req.body.email + '","' + req.body.name + '","' + req.body.password + '")', err => {
            if (err) return res.status(500).send(err);
            return res.status(200).send('Success');
        });
    });

    /**
     * User login
     */
    app.post('/login', (req, res) => {
        if (!(req.body.email && req.body.password)) return res.status(400).send('Bad Request');
        con.query('SELECT COUNT(*) FROM user WHERE email = "' + req.body.email + '" AND password = "' + req.body.password + '"', (err, result) => {
            if (err) return res.status(500).send(err);
            if (result[0]['COUNT(*)'] === 0) {
                return res.status(200).send({
                    isVerify: false
                });
            } else {
                return res.status(200).send({
                    isVerify: true
                });
            }
        });
    });

    /**
     * List all user
     */
    app.get('/list', (req, res) => {
        con.query('SELECT * FROM user', (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(200).send(result);
        });
    });

    app.get('/name', (req, res) => {
        if (!req.query.email) return res.status(400).send('Bad Request');
        con.query('SELECT name, password FROM user WHERE email = "' + req.query.email + '"', (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.status(200).send(result[0]);
        });
    });
});

/**
 * Add number
 */
app.get('/add', (req, res) => {
    var a = parseInt(req.query.a);
    var b = parseInt(req.query.b);
    return res.status(200).send(a + b + '');
});

/**
 * Get random image using fs
 */
app.get('/image', (req, res) => {
    var files = fs.readdirSync(path.join(__dirname, '../secret_image/'));
    let index = Math.floor(Math.random() * files.length);
    res.status(200).sendFile(path.join(__dirname, '../secret_image/', files[index]));
});

app.post('/searchTweet', (req,res) => {
    client.get('search/tweets', {q: 'cherprang'}, function(error, tweets, response) {
        res.status(200).send(tweets);
     });
});