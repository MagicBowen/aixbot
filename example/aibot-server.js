const AiBot = require('../aibot');

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