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