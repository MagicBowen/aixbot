# Robot SDK for XiaoAi Public Platform

SDK for [XiaoAi public platform](https://xiaoai.mi.com/skill/create/index).

## install

```bash
npm install aixbot
```
## usage

### independent

```javascript
const AixBot = require('aixbot');

const aixbot = new AixBot('123');

// define middleware
aixbot.use(async (ctx, next) => {
    console.log(`process request for '${ctx.request.query}' ...`);
    var start = new Date().getTime();
    await next();
    var execTime = new Date().getTime() - start;
    console.log(`... response in duration ${execTime}ms`);
});

// define event listener
aixbot.onEvent('enterSkill', (ctx) => {
    ctx.query('hi');
});

// define text listener
aixbot.hears('who are you', (ctx) => {
    ctx.query('I am aixbot');
});

// define regex listener
aixbot.hears(/\w+/, (ctx) => {
    ctx.query(ctx.request.query);
});

// close session
aixbot.onEvent('quitSkill', (ctx) => {
    ctx.reply('bye').closeSession();
});

// run http server
aixbot.run(8080);
```

### https

```javascript
let tlsOptions = {
    key: fs.readFileSync('./keys/1522555444697.key'),
    cert: fs.readFileSync('./keys/1522555444697.pem')
};

aixbot.run(8080, '0.0.0.0', tlsOptions);
```

### with KOA

```javascript
const AixBot = require('aixbot');

const aixbot = new AixBot('123');

// define event listener
aixbot.onEvent('enterSkill', (ctx) => {
    ctx.query('hi');
});

// define text listener
aixbot.hears('who are you', (ctx) => {
    ctx.query('I am aixbot');
});

// define regex listener
aixbot.hears(/\w+/, (ctx) => {
    ctx.query(ctx.request.query);
});

// close session
aixbot.onEvent('quitSkill', (ctx) => {
    ctx.reply('bye').closeSession();
});

const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');

const router = new Router();
const app = new Koa();

// koa middleware
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
