let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();
let http = require('http').Server(app);

app.use('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
});

http.listen(2000, function () {
    console.log('listening on *:2000');
});

let io = new require('socket.io')(http);

io.on('connection', function (socket) {
    newConnection(socket);

    socket.on('pPlay', () => {
        io.emit('play')
    });

    socket.on('pPause', () => {
        io.emit('pause')
    });

    socket.on('pTimeChange', (time) => {
        io.emit('timeChange', time);
    })
});

function newConnection(socket) {
    console.log('New connection:');
    console.log(socket.id);
    console.log('-------')
}

app.use('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
