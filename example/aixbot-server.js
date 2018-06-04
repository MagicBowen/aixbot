const AixBot = require('../aixbot');

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