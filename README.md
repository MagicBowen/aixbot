# Robot SDK for XiaoAi Public Platform

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
    ctx.speak('hi').openMic();
});

// define text listener
aixbot.hears('who are you', (ctx) => {
    ctx.speak('I am aixbot').openMic();
});

// define regex listener
aixbot.hears(/\w+/, (ctx) => {
    ctx.speak(ctx.request.query).openMic();
});

// close session
aixbot.onEvent('quitSkill', (ctx) => {
    ctx.speak('bye').closeSession();
});

// run http server
aixbot.run(8080);
```

### with KOA

```javascript
const AixBot = require('aixbot');

const aixbot = new AixBot('123');

// define event listener
aixbot.onEvent('enterSkill', (ctx) => {
    ctx.speak('hi').openMic();
});

// define text listener
aixbot.hears('who are you', (ctx) => {
    ctx.speak('I am aixbot').openMic();
});

// define regex listener
aixbot.hears(/\w+/, (ctx) => {
    ctx.speak(ctx.request.query).openMic();
});

// close session
aixbot.onEvent('quitSkill', (ctx) => {
    ctx.speak('bye').closeSession();
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
