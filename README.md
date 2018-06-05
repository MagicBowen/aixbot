# 小爱开放平台语音技能SDK

[小爱开放平台语音技能](https://xiaoai.mi.com/skill/create/index)的非官方nodejs SDK。
使用前需要先在小爱开放平台注册开发者身份，申请语音技能，并填写服务器URL。具体参见[小爱平台文档](https://xiaoai.mi.com/documents/Home)。

## 安装

```bash
npm install aixbot
```

源码在[github](https://github.com/MagicBowen/aixbot)，有问题请提issue。

## 用法

AixBot和nodejs社区著名的[koa](https://www.npmjs.com/package/koa)框架用法基本一致，通过定义中间件和事件监听回调来完成任务。

### 快速启动

以下示例实现了一个简单的语音技能：
- 支持进入和退出技能时的礼貌用语
- 支持用户直接询问"你是谁"
- 其它消息环回播放

```javascript
const AixBot = require('aixbot');

const aixbot = new AixBot();

// define event handler
aixbot.onEvent('enterSkill', (ctx) => {
    ctx.speak('你好').wait();
});

// define text handler
aixbot.hears('你是谁', (ctx) => {
    ctx.speak(`我是Bowen`).wait();
});

// define regex handler, echo message
aixbot.hears(/\W+/, (ctx) => {
    ctx.speak(ctx.request.query);
});

// close session
aixbot.onEvent('quitSkill', (ctx) => {
    ctx.reply('再见').closeSession();
});

// run http server
aixbot.run(8080);
```

### HTTPS启动

AixBot默认使用http协议。由于小爱开放平台需要开发者提供https，建议最好在nginx上配置好SSL证书，然后代理到内部aixbot的端口。

AixBot也支持直接以https启动，如下。

```javascript
// config your ssl key and pem
let tlsOptions = {
    key: fs.readFileSync('./keys/1522555444697.key'),
    cert: fs.readFileSync('./keys/1522555444697.pem')
};

aixbot.run(8080, '0.0.0.0', tlsOptions);
```

### 定义中间件

AixBot支持像koa那样注册中间件。AixBot当前只支持中间件使用`async`和`await`的方式处理异步。

```javascript
const AixBot = require('aixbot');

const aixbot = new AixBot();

// define middleware for response time
aixbot.use(async (ctx, next) => {
    console.log(`process request for '${ctx.request.query}' ...`);
    var start = new Date().getTime();
    await next();
    var execTime = new Date().getTime() - start;
    console.log(`... response in duration ${execTime}ms`);
});

// define middleware for DB
aixbot.use(async (ctx, next) => {
    ctx.db = {
        username : 'Bowen'
    };
    await next();
});

// define event handler
aixbot.onEvent('enterSkill', (ctx) => {
    ctx.speak('你好').wait();
});

// define text handler
aixbot.hears('你是谁', (ctx) => {
    ctx.speak(`我是${ctx.db.username}`).wait();
});

// define regex handler
aixbot.hears(/\W+/, (ctx) => {
    ctx.speak(ctx.request.query);
});

// close session
aixbot.onEvent('quitSkill', (ctx) => {
    ctx.reply('再见').closeSession();
});

// define error handler
aixbot.onError((err, ctx) => {
    logger.error(`error occurred: ${err}`);
    ctx.reply('内部错误，稍后再试').closeSession();
});

// run http server
aixbot.run(8080);
```

如上我们定义了两个中间件，一个打印消息的处理时间，一个为context添加访问DB的属性。
由于中间件或者消息处理过程中可能会抛出异常，所以我们为异常定义了处理方式`aixbot.onError((err, ctx) => {...})`。

### 和KOA结合使用

大多数场景下我们只用像上面那样将AixBot独立启动就可以了，但是某些场景下我们需要在同一个程序里同时发布其它的web接口，这时可以将AixBot和koa结合使用。

```javascript
const AixBot = require('aixbot');

const aixbot = new AixBot();

// define axibot middleware
aixbot.use(async (ctx, next) => {
    ctx.db = {
        username : 'Bowen'
    };
    await next();
});

// define event handler
aixbot.onEvent('enterSkill', (ctx) => {
    ctx.query('你好');
});

// define text handler
aixbot.hears('你是谁', (ctx) => {
    ctx.speak(`我是${ctx.db.username}`).wait();
});

// define regex handler
aixbot.hears(/\W+/, (ctx) => {
    ctx.speak(ctx.request.query);
});

// close session
aixbot.onEvent('quitSkill', (ctx) => {
    ctx.reply('再见').closeSession();
});

// define error handler
aixbot.onError((err, ctx) => {
    logger.error(`error occurred: ${err}`);
    ctx.reply('内部错误，稍后再试').closeSession();
});

const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');

const router = new Router();
const app = new Koa();

// koa middleware
app.use(async (ctx, next) => {
    console.log(`process request for '${ctx.request.url}' ...`);
    var start = new Date().getTime();
    await next();
    var execTime = new Date().getTime() - start;
    console.log(`... response in duration ${execTime}ms`);
});

app.use(koaBody());
router.get('/', (ctx, next) => {
    ctx.response.body = 'welcome';
    ctx.response.status = 200;    
});

// register aixbot handler to koa router
router.post('/aixbot', aixbot.httpHandler());
  
app.use(router.routes());

app.listen(8080);
console.log('KOA server is runing...');
```

在上面的例子里，我们没有直接调用`aixbot.run()`，而是使用`router.post('/aixbot', aixbot.httpHandler())`将aixbot的处理绑定到koa router指定的`/aixbot`路由上。同时我们为AixBot和koa定义了各自的消息中间件。在运行时会先执行koa的中间件，然后再根据koa的路由规则进行消息分派。分派到`/aixbot`上的post消息先会执行AixBot的中间件，然后执行对应的已注册的AixBot消息回调。

### 对接NLU平台

AixBot支持对小爱发来的消息按照事件类型或者消息内容定义回调方法，并支持对消息内容以正则表达式的方式定义规则。但是如果需要完成复杂的语音技能，就必须对接功能完备的NLU处理平台。

对于NLU处理平台，最直接的是使用[小爱自己的NLU配置界面](https://xiaoai.mi.com/documents/Home?type=/api/doc/render_markdown/SkillAccess/BackendDocument/NLPModel)进行配置，然后在收到的消息里就会直接携带具体的intent和slot信息。

通过AixBot可以监听指定的intent，在context中可以取出对应的intent和slot信息，然后进行相应的处理。

```javascript
// define intent handler
aixbot.onIntent('query-weather', (ctx) => {
    console.log(JSON.stringify(ctx.request.slotInfo));
});
```


