var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});

app.get('/api/data', (req, res) => {
    db.all('SELECT * FROM data', (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        res.json(rows);
    });
});

app.get('/api/date', (req, res) => {
    let year = req.query.year;
    let sql = 'SELECT * FROM data WHERE date = ?';
    db.all(sql, [date], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(rows);
    });
});

app.post('/api/insert', (req, res) => {
    let date = req.body.date;
    let value = req.body.value;
    let sql = 'INSERT INTO data (date, value) VALUES (?, ?)';
    db.run(sql, [date, value], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send('Insert success');
    });
});

module.exports = app;
