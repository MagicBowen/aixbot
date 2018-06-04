//////////////////////////////////////////////////
const AixBot = require('../aixbot');

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