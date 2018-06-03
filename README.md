# Robot SDK for XiaoAi Public Platform

## install

```bash
npm install aibot
```

## usage

### independent

```javascript
const AiBot = require('aibot');

const aibot = new AiBot('123');

// define middleware
aibot.use(async (ctx, next) => {
    console.log(`process request for '${ctx.request.query}' ...`);
    var start = new Date().getTime();
    await next();
    var execTime = new Date().getTime() - start;
    console.log(`... response in duration ${execTime}ms`);
});

// define event listener
aibot.onEvent('enterSkill', (ctx) => {
    ctx.speak('hi').openMic();
});

// define text listener
aibot.hears('who are you', (ctx) => {
    ctx.speak('I am aibot').openMic();
});

// define regex listener
aibot.hears(/\w+/, (ctx) => {
    ctx.speak(ctx.request.query).openMic();
});

// close session
aibot.onEvent('quitSkill', (ctx) => {
    ctx.speak('bye').closeSession();
});

// run http server
aibot.run(8080);
```

### with KOA

```javascript
const AiBot = require('aibot');

const aibot = new AiBot('123');

// define event listener
aibot.onEvent('enterSkill', (ctx) => {
    ctx.speak('hi').openMic();
});

// define text listener
aibot.hears('who are you', (ctx) => {
    ctx.speak('I am aibot').openMic();
});

// define regex listener
aibot.hears(/\w+/, (ctx) => {
    ctx.speak(ctx.request.query).openMic();
});

// close session
aibot.onEvent('quitSkill', (ctx) => {
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

// register aibot handler to koa router
router.post('/aibot', aibot.httpHandler());
  
app.use(router.routes());

app.listen(8080);
console.log('KOA server is runing...');
```

## API

### AiBot

### Context

### Request

### Response