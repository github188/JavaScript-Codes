
前言（罗里吧嗦）：

有一段时间没记录点东西了，主要公司最近有两个新 IPTV 项目上线，问题很多，每天都在忙着处理BUG，对该书的阅读暂停了一会。本篇为第六篇，至于第五篇为什么没有，因为还没写，书和代码研究过了，只是还没记录下来，加上第五篇涉及代码比较多，因此先跳过，来学习下服务器的部分了，第五篇待有空会补上。

开始正题

---

### 1 创建简单服务器

最简单的 Node 服务器端程序

```javascript
// 引用 http 模块
var http = require("http");

http.createServer( function ( request, response ) {
    response.contentType( 'json' );

    response.end("Hello Node JS!");

}).listen(3000);

```


### 2 路由框架：Express

#### 2.1 使用方法

- 先安装 express
    
    `npm install express --save`

- 安装中间件
    
    在 4.+ 版本之后 express 不再依赖 connect 了，在使用中间件的时候必须单独安装，然后通过 require 加载，直接 app.use 方式调用，3.+ 版本的 app.confiure 已经移除无法使用了。

#### 2.2 使用过程：

1. 加载 express

    `var express = require( 'express' );`
    
    创建 app:
    
    `var app = express();`

2. 环境配置

    设置：运行程序时命令
    `NODE_ENV=production node app.js`
    
    获取环境配置
    `process.env.NODE_ENV` 或 `app.get('env');`
    
    环境变量取值：
    
    `development`：开发环境
    `testing`：测试环境
    `staging`：演示环境
    `production`：产品环境

3. 中间件使用

    以 logger 为例
    
    单独安装：
    
    `npm install logger --save`
    
    导入：
    
    `var logger = require( 'logger' );`
    
    使用：
    
    `app.use( logger() );


4. 设置路由
    
    通过，app.get 来获取路由，并设置响应回调
    
    比如：根路由的处理
    
    ```
    app.get( '/', function ( request, response ) {
    
        response.send( 'Hello Express !' );
    });
    
    ```
    
    其他：

    `app.get( '/users', callback );`

5. 创建服务

    `server.createServer( app );`

6. 监听端口
    
    监听成功后，输出：‘Listening on port 3000.’
    `server.listen( 3000, function () { console.log('Listenning on port 3000); } );`
    
    设置端口：
    
    `app.set('port', process.env.PORT || 3000);`
    
    获取端口：
    
    `app.get('port')` 或 `process.env.PORT`

7. 完整代码
    
    ```
    $ npm install express --save
    $ npm install logger --save
    
    // app.js
    
    var 
        http    = require( 'http' ),
        express = require( 'http' ),
    
        // 这里名称是：morgan
        logger  = require( 'morgan' ),
        errorHandler = require( 'errorhandler' ),
        app     = express(),
    
        server, port, env;
    
    // 环境配置
    app.set( 'port', process.env.PORT || 3000 );
    
    // 中间件使用
    app.use( logger('dev') );
    
    // 获取并设置路由
    app.get( '/', function ( request, response ) {
        response.send( 'Hello express !' );
    } );
    
    app.get( '/user', callback );
    
    env = app.get('env');
    
    // 根据环境来决定使用何种中间件
    if ( env === 'development' ) {
        app.use( errorHandler() );
    }
    
    port = app.get('port');
    
    server = http.createServer( app );
    server.listen( port, function () {
        console.log( 'Express server listening on port ' + port );
    });
    
    ```

### 3 Express 静态文件服务

需要安装中间件：`serve-static`

`npm install serve-static --save`

然后：( path.join 需要引入 `path` )

`app.use( static( path.join( __dirname, 'public/spa' ) ) );`

事实上这样也可以：

`app.use( static( __dirname + '/public/spa' );`

将 '/' 目录与 `spa` 项目文件：`spa.html` 联系起来，即：将 '/' 重定向到 `.../spa.html`

首先获取 '/' 路由，在其处理函数里面重定向
```
app.get( '/', function ( request, response ) {
    response.redirect( '/spa.html' );
} );
```

上面重定向失败，报错：

浏览器：

`Cannot GET /spa.html`

Server:

    
    GET /spa.html 404 4.871 ms - 21
    GET /spa.html 404 1.682 ms - 21
    GET / 302 85.322 ms - 62
    GET /spa.html 404 0.442 ms - 21

这个错误主要没注意，项目路径不是`public` 而是 `public/spa`，把静态路径设置成 `public/spa`搞定


### 4 高级路由

#### 4.1 用户对象的 CRUD 路由

术语：

CRUD： Create, Read, Update, Delete

**TEST(Representational State Transfer)**: 实现 CRUD 的一种设计模式【TODO】

- 获取用户列表路由

    `contentType` 告诉客户端返回的是什么类型的数据，这里是：`json`；
    `send`：服务器返回给客户段的数据；
    
    ```
    app.get( '/user/list', function ( request, response ) {
        response.contentType( 'json' );
        response.send({ title: 'user list' });
    } );
    ```

- 创建用户路由
    
    创建用户，客户端需要将新用户信息发送给服务器，服务器保存用户信息，并返回创建结果给客户端，因此需要用到 `POST` 请求，Express 提供了 app.post 来处理客户端的 `POST` 请求，如下：
    
    ```
    app.post( '/user/create', function ( request, response ) {
    
        // 处理从客户端接受到的用户信息 ....
    
        // 响应结果
        response.contentType( 'json' );
        response.send({ title: 'user created' });
    } );
    ```
    
    
    访问：`http://localhost:3000/user/create` 结果显示：
    
    ```
    Cannot GET /user/create
    
    Request URL:http://localhost:3000/user/create
    Request Method:GET
    Status Code:404 Not Found
    Remote Address:192.168.179.103:3000
    ```
    
    是因为浏览器发送的是 GET 类型请求，而服务器那边是处理的 POST。
    
    可以通过 `curl` 命令测试
    
    `curl http://localhost:3000/user/create -d {}`
    
    结果：说明创建用户路由是没问题的
    
    ```
    lizc@ubuntu:~$ curl http://localhost:3000/user/create -d {}
    {"title":"user created"}
    ```

- 读取用户对象路由，带参数的路由
    
    参数通过在路由后面添加 `/:name` 来书写，比如：`/user/read/:id`，id 就是浏览器URL 中的参数，冒号只是服务器端，路由编写时使用，浏览器中直接使用 `/user/read/id` 传递即可。
    
    ```
    app.get( '/user/read/:id', function ( request, response ) {
        app.contentType( 'json' );
        app.send({
            title: 'user with id: ' + request.params.id + ' found'
        });
    } );
    ```
    
    从代码可知，浏览器传递的参数，可以在对象 `request.params` 里面获取
    
    TEST: 
    
    ```
    lizc@ubuntu:~$ curl http://localhost:3000/user/create -d {}
    {"title":"user created"}lizc@ubuntu:~$ curl http://localhost:3000/user/read/:lizc
    {"title":"user with id :lizc found"}lizc@ubuntu:~$ curl http://localhost:3000/user/read/lizc
    {"title":"user with id lizc found"}lizc@ubuntu:~$ curl http://localhost:3000/user/read/dd
    {"title":"user with id dd found"}lizc@ubuntu:~$ curl http://localhost:3000/user/read/111
    {"title":"user with id 111 found"}lizc@ubuntu:~$ curl http://localhost:3000/user/read/
    Cannot GET /user/read/
    lizc@ubuntu:~$ curl http://localhost:3000/user/read/?
    Cannot GET /user/read/?
    lizc@ubuntu:~$ curl http://localhost:3000/user/read/?*
    Cannot GET /user/read/?*
    lizc@ubuntu:~$ curl http://localhost:3000/user/read/?111
    Cannot GET /user/read/?111
    ```
    从上面的测试可知，后面传什么字符和数字都能返回，传其他字符开头的字符串，会返回错误。
    
    这时候可以通过在路由中添加正则表达式，作为条件来限制客户端传过来的参数类型和参数值范围等等，如：
    
    `/user/read/:id([0-9]+)`
    
    条件正则表达式写在参数的小括号内，上面意思是只接受纯数字的用户 id
    
    ```
    lizc@ubuntu:~$ curl http://localhost:3000/user/read/!
    Cannot GET /user/read/!
    lizc@ubuntu:~$ curl http://localhost:3000/user/read/ddd
    Cannot GET /user/read/ddd
    lizc@ubuntu:~$ curl http://localhost:3000/user/read/12d
    Cannot GET /user/read/12d
    lizc@ubuntu:~$ curl http://localhost:3000/user/read/d1
    Cannot GET /user/read/d1
    
    正确：
    lizc@ubuntu:~$ curl http://localhost:3000/user/read/111
    {"title":"user with id 111 found"}
    
    Express server listening on port 3000
    GET /user/read/cls 404 5.862 ms - 26
    GET /user/read/! 404 1.364 ms - 24
    GET /user/read/ddd 404 0.618 ms - 26
    GET /user/read/12d 404 0.182 ms - 26
    GET /user/read/d1 404 0.286 ms - 25
    GET /user/read/111 200 4.974 ms - 34
    GET /user/read/@@ 404 0.194 ms - 25
    ```

- 更新用户路由
    
    ```
    app.post( '/user/update/:id([0-9]+)', 
        function ( request, response ) {
            
            // TODO: 更新用户
            
            response.contentType( 'json' );
            response.send({
               title: 'user with id ' + request.params.id + ' updated'   
            });
        } 
    );
    ```

- 删除用户路由
    
    ```
    app.get( '/user/delete/:id([0-9]+)', 
        function ( request, response ) {
            
            // TODO: 删除用户
            
            response.contentType( 'json' );
            response.send({
               title: 'user with id ' + request.params.id + ' deleted'   
            });
        } 
    );
    ```

#### 4.2 路由通用属性设置：`app.all`

在上面的例子中，代码一样，设置的属性内容都一样，比如：`response.contentType( 'json' );`
设置响应内容类型，会发现每个里面都需要设置这些，于是可以通过一些通用函数来设置一些公用的东西

比如：
```
app.all( '/user/*?', function ( request, response, next ) {

    response.contentType( 'json' );

    // 将控制流传回给下一个路由
    next();
} );
```

如上面代码，可以将所有 `/user` 下的路由先拦截掉，之后设置其路由下的通用属性，但是拦截之后，控制流会终止，这个时候就需要用到第三个参数，`next()` 的作用正是将路由控制流传给下一个路由。

#### 4.3 通用路由

通过 4.2 中通用属性设置，可以联想是否可以设置通用路由，上面都是固定了 `/user` 路由的情况，也就是说上面的编码完成之后只能接受 `/user` 路由下的请求，而注入 `/person` 请求是不会响应的

如下：因为压根没有添加 `/person` 路由
```
lizc@ubuntu:~$ curl http://localhost:3000/person/read/1
Cannot GET /person/read/1
```

参数路由： `/:obj_type/read/:id([0-9]+)`

比如：
```
app.get( '/:obj_type/create/:id([0-9]+)', function ( request, response ) {

    response.send({
        title: request.params.obj_type + ' with id ' + request.params.id + ' created'   
    });
} );
```

结果：
```
// read person
lizc@ubuntu:~$ curl http://localhost:3000/person/read/111
{"title":"person with id 111 found"}

// read people
lizc@ubuntu:~$ curl http://localhost:3000/people/read/111
{"title":"people with id 111 found"}

// create people
lizc@ubuntu:~$ curl http://localhost:3000/people/create -d {}
{"title":"people created"}
```


**另外需要注意的是，静态和动态文件路由优先级问题：**

3.+ 版本中存在 `app.router` 

```
app.use( static( __dirname + '/public/spa' ) );
app.use( app.router );
```

上面顺序意思是先访问静态文件，然后再匹配路由，意思见下：

比如 `/public/spa` 路径下有这么个文件 `user/read/12` 

文件内容： `i am 12 file.`

然后有下面的路由
```
app.get( '/user/read/:id([0-9]+)', 
    function ( request, response ) {
        response.send({
            title: 'read user with id ' +  request.params.id
        });
    } 
);
```

然后访问URL：`http://localhost:3000/user/read/12` 会发现

执行：

`node app.js`

```
lizc@ubuntu:~$ curl http://localhost:3000/user/read/12
i am 12 file.
lizc@ubuntu:~$ 
```

会发现把文件内容输出了，也就是说其实是访问了静态文件：12，而不是路由，其实很好理解，3.+版本上面的设置是静态文件在前，路由在后，如果把路由放前面，输出将会是对应的请求路由处理后的响应内容。

不过4.+的版本，`app.router` 被删除了，没找到替代的部分，就当了解下吧。

**解决方法**

其实很简单，把 CRUD 请求几种放置在一定的目录下不就行了，命名一个特殊点的文件路径，比如用版本号之类的，说白了就是自己尽量避免路由和静态文件重名，而发生冲突

#### 4.4 路由模块化

将路由进行模块化管理，让代码更具通用性和可维护性

- 明示搜索路径逻辑
    
    |代码|路径|
    |---|---|
    |`requrie('./routes.js');`|明确后缀，表示当前路径下的 routes.js 文件|
    |`require('./routes');`|不指定后缀，可匹配当前路径下的如：routes.js,routes.css,routes.node等文件|
    |`require('../routes.js');`|`../routes.js`|
    |`require('routes');`|该语法指定的是当前项目下的模块路径：node_modules/，或者系统下的 node_module/路径|

- 模块模版
    
    ```
    // routes.js
    
    // 声明
    var configRoutes;
    
    // 模块内容
    
    configRoutes = function ( app, server ) {
    
        // ... functions ...
    
        // 将 app.js 中所有的路由请求放到该函数里面
    };
    
    
    // 导出模块
    
    module.exports = {
        configRoutes: configRoutes
    };
    
    ```

- 引用模块
    
    ```
    // app.js
    
    var routes = require( './routes' );
    
    // 执行模块内容
    routes.configRoutes( app, server );
    ```

- 路由模块

    ```
    // routes.js
    
    // 将 app.js 中跟路由相关的设置移到该文件中
    // 这就不重复代码了
    ```

### 5 认证

认证中间件是：`basic-auth`

安装：

`npm install basic-auth --save`

使用：

`var basicAuth = require( 'basic-auth' );`

`app.use( basicAuth( request ) );`

也可以在基本认证中间件基础上加上自己的逻辑，比如：

```javascript
// auth.js

var basicAuth = require( 'basic-auth' );

var auth;

auth = function ( request, response ) {

    function unauthorized ( response ) {
        response.set( 'WWW-Authenticate', 'Basic realm=Authorization Required' );
        return response.send( 401 );
    }

    var user = basicAuth( request );

    if ( !user || !user.name || !user.pass ) {
        return unauthorized( response );
    }

    // 指定用户名和密码
    if ( user.name === 'lizc' && user.pass === 'fll' ) {
        return next();
    } else {
        return unauthorized( response );
    }
};

module.exports = auth;
```


### 6 全局属性

|属性|含义|
|---|---|
|`__dirname`|当前目录完整路径|
|`process`|服务进程对象|

### 7 Express 3.+ 和 4.+ 版本差异

中间件差异，3.+ 可通过 app.configure + app.use 可以直接使用，不需要单独安装，而 4.+ 需要针对单个中间件进行安装，然后直接通过 app.use 去使用；

左列为：3.+版本直接挂接在 express 对象下的属性；
右列为：4.+版本单独出来的需要安装的包名；


| Express 3 |  Express 4 |
| --------- | ---------- | 
| express.bodyParser | body-parser + multer |
| express.compress|compression|
|express.cookieSession|cookie-session|
|express.cookieParser|cookie-parser|
|express.logger|morgan|
|express.session|express-session|
|express.favicon|serve-favicon|
|express.responseTime|response-time|
|express.errorHandler|errorhandler|
|express.methodOverride|method-override|
|express.timeout|connect-timeout|
|express.vhost|vhost|
|express.csrf|csurf|
|express.directory|serve-index|
|express.static|serve-static|

左列是 3.+ 直接使用形式，右侧都是插件名称，需要通过单独安装后才可使用。

其他一些更新：

|对象|描述|
|---|---|
|Node.js|Express 4 需要 0.10.x 以上版本并且不支持 0.8.x 版本|
|app.configure|已经移除。新版可以通过 `process.env.NODE_ENV` 或 `app.get('env')`来获取环境变量，然后根据不同类型进行判断，直接使用 app.use |
|json spaces|新版无效|
|req.accepted()|`Use req.accepts(), req.acceptsEncodings(), req.acceptsCharsets(), and req.acceptsLanguages()`.|
|res.location()|不再解析相对 URLs|
|req.params|之前是数组，现在是对象|
|res.locals|之前是函数，现在是对象|
|res.headerSent|`res.headersSent`|
|app.route|如今可用：`app.mountpath`|
|res.on('header')|已移除|
|res.charset|已移除|
|res.setHeader('Set-Cookie', val)|新版只支持基本属性设置，更多cookie设置使用`res.cookie()`|
| app.router|该函数已经废除不能使用|

另外，针对 `http.createServer` 已经不再是必须的，可以直接使用 `app.listen` 即可启动服务，除非需要直接使用 `http` 模块（如：socket.io/SPDY/HTTPS）


### 总结

该篇主要大概记录了下 Node.js 的 Express 框架，及其中间件，路由和一些版本差异

Node.js 部分：

1. 搭建简单服务器
2. 引入 http 模块，利用 

    `http.createServer( function ( req, res ) { ... }).listen( port )` 

    创建服务并进行监听；

Express 部分：

1. 安装： `npm install express --save`
2. 引入： `var express = require( 'express' );`
3. 创建App： `var app = express();`
4. 端口号： `app.set( 'port', process.env.PORT || 3000 );`
5. 配置环境： 
    `app.set( 'env', 'development );`

    环境变量取值：
    `development - 开发环境`
    `testing - 测试环境`
    `staging - 演示环境`
    `production - 产品阶段环境`

6. 启用中间件： `app.use( logger() );`，`app.use( errorHandler() );` 等；
7. 设置路由： `app.get( '/', function ( req, res ) { // 路由响应... } );`
8. 创建服务：`var server = http.createServer( app );`
9. 监听端口：`server.listen( app.get( 'port' ), function () { // 监听成功后的回调 } );`
10. 在不直接使用 `http` 模块的情况下，步骤8和9可以合并成：`app.listen( app.get( 'port' ), function () { // do something ... } );`

路由部分：

1. 设置路由：`app.get( '/', function ( req, res ) { // 路由响应... } );`
2. CRUD 路由： `Create, Read, Update, Delete`
3. 路由参数： `app.get( '/user/read/:id' ,function ( req, res ) { // .... } );`
4. 路由参数匹配规则：使用正则表达式限制传入的参数类型和值范围，比如值允许数字的用户 id

    `app.get( '/user/read/:id([0-9]+)', function ( req, res ) { // ... } );`
5. 通用路由： 

    `app.get( '/:obj_type/read/:id([0-9]+)',function ( req, res ) { // ... } );`
6. 通用属性设置： 

    `app.all( '/', function ( req, res, next ) { // 通用设置 -> next(); 传递路由控制流 } );`

    app.all 会阻截路由控制流，必须使用 `next();` 将路由传递到下一个才能恢复路由控制；
7. 路由模块化： 将路由处理几种到路由模块处理，`routes.js`，模块模版：
    ```
    // routes.js 路由模块
    
    'use strict';
    
    var routesConfig = function ( app, server ) {
    
        // ... 路由处理
    
    };
    
    module.exports = {
        routesConfig : routesConfig
    };
    
    // app.js
    var routes = require( './routes' );
    
    routes.routesConfig( app, server );
    ```

认证部分：

> 基本认证，高级认证推荐使用第三方认证，比如：Facebook 或 Google 认证

```
$ npm install basic-auth --save

// app.js

var basicAuth = require( 'basic-auth' );

// 对请求做基本认证，也可以自己封装 basic-auth 指定用户名和密码等认证信息
basicAuth( req );

```

最后就是 Express 3.+ 和 Express 4.+ 的差异部分了，本篇提到的主要两个部分，一个是中间件部分，一个是一些对象和数组的变化，具体的可以从该官网地址查看：[3.+ -> 4.+](http://expressjs.com/en/guide/migrating-4.html)，学习技术，最好最有效的方法应该就是官方文档了，当然英语阅读能力必须要具备，本人英语糟透透，四级考了两次还是刚好压线过，翻译软件常备无患。


