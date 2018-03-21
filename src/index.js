var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs-extra');
var path = require('path');
var app = express();
var con = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12227895',
    password: 'ajc5611wal',
    database: 'sql12227895'
});

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.listen(3000, () => {
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
        con.query('SELECT name FROM user WHERE email = "' + req.query.email + '"', (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(200).send(result);
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