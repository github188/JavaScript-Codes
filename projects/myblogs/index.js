/**
 * 入口文件
 * @authors zc li (ccc_simon@163.com)
 * @date    2017-03-22 15:13:25
 * @version $Id$
 */

var 
    path        = require('path'),
    express     = require( 'express' ),
    session     = require('express-session'),
    MongoStore  = require('connect-mongo')(session),
    flash       = require('connect-flash'),
    config      = require('config-lite'),
    app         = express(),

    routes      = require( './routes' )
    ;


/* ---------------------- Settings ------------------------- */
app.set('views', path.join(__dirname, 'views')); // 设置存放模版文件目录
app.set('view engine', 'ejs');  // 设置模版引擎

app.use(express.static(path.join(__dirname, 'public')));


/* ---------------------- Middlewares ------------------------- */
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true, // 强制更新 session
    saveUninitialized: false, // false 强制创建一个 session，即使无用户登录
    cookie: {
        maxAge: config.session.maxAge
    }/*,
    store: new MongoStore({
        url: config.mongodb
    })*/
}));

app.use(flash());


/* ---------------------- Router ------------------------- */
routes(app);

app.listen( 3000, function () {
    console.log( 'express server listening on port 3000.' );
} );




