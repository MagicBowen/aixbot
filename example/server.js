const AiBot = require('../aibot');


const aibot = new AiBot('123');

aibot.use(async (ctx, next) => {
    console.log(`process request for '${ctx.request.query}' ...`);
    var start = new Date().getTime();
    await next();
    var execTime = new Date().getTime() - start;
    console.log(`... response in duration ${execTime}ms`);
});

aibot.hears('hello', (ctx) => {
    ctx.speak('hi');
});

aibot.run(8080);