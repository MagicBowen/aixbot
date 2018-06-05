//////////////////////////////////////////////////
const AixBot = require('../aixbot');

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

//////////////////////////////////////////////////
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