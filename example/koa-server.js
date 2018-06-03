//////////////////////////////////////////////////
const AiBot = require('../aibot');

const aibot = new AiBot('123');

aibot.onEvent('enterSkill', (ctx) => {
    ctx.speak('welcome').openMic();
});

aibot.hears('hello', (ctx) => {
    ctx.speak('hi');
});

//////////////////////////////////////////////////
const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');

const router = new Router();
const app = new Koa();

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
router.post('/aibot', aibot.httpHandler());
  
app.use(router.routes());

app.listen(8080);
console.log('KOA server is runing...');