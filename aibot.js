const compose = require('koa-compose');
const Context = require('./context')
const Request = require('./request')

class AiBot {
    constructor(appId) {
        this.appId = appId;
        this.middlewares = [];
        this.eventListeners = {
            enterSkill    : null,
            quitSkill     : null,
            inSkill       : null,
            noResponse    : null,
            recordFinish  : null,
            recordFail    : null,
            playFinishing : null
        };
        this.intentListeners = {};
        this.textListeners   = {};
        this.regExpListeners = {};
        this.errorListener   = null;
    }

    run(port, host, tlsOptions) {
        this.server = tlsOptions ? 
                      require('https').createServer(tlsOptions, this.callback()) 
                      : require('http').createServer(this.callback());
        this.server.listen(port, host, () => { console.log('AiBot listening on port: %s', port)});
    }

    use(middleware) {
        if (typeof middleware !== 'function') throw new TypeError('middleware must be a function!');
        this.middlewares.push(middleware);
        return this;
    }

    callback() {
        const fn = compose(this.middlewares);
    
        const handleRequest = (req, res) => {
            if (req.getHeader('Content-Type') !== 'application/json') {
                const body = JSON.stringify({reason : 'incorrect content type, wish json!'});
                response.writeHead(404, {
                    'Content-Length': Buffer.byteLength(body),
                    'Content-Type': 'application/json' });
                res.end(body);
                return;
            }
            response = await this.handleHttpRequest(req, fn);
            
        };
    
        return handleRequest;
    }

    handler() {
        this.middlewares.push(async function(ctx, next) {
            try {
                reply = await this.handleRequest(ctx.request.body);
                ctx.response.body = reply;
                ctx.response.status = 200;
            } catch(err) {
                ctx.response.status = 404;
            }
        });
        const fn = compose(this.middlewares);
        return (ctx, next) => {
            await fn(ctx, next);
            next();
        }
    }

    async handleRequest(request) {
        let req = new Request(request);
        if (req.appId != this.appId) {
            console.log(`Error: received unknown app-id(${req.appId}) request!`);
            return;
        }
        let ctx = new Context(req);
        try {
            await this.doHandleRequest(ctx);
            return ctx.body;
        } catch(err) {
            if (this.errorListener) {
                this.errorListener(ctx);
            } else {
                console.log('Error: handle request failed!');
                throw err;
            }
        }
    }

    async doHandleRequest(ctx) {
        if (await this.doHandleRequestBy(ctx, this.eventListeners.enterSkill, ctx.request.isEnterSkill)) return;
        if (await this.doHandleRequestBy(ctx, this.eventListeners.quitSkill, ctx.request.isQuitSkill)) return;
        if (await this.doHandleRequestBy(ctx, this.eventListeners.noResponse, ctx.request.isNoResponse)) return;
        if (await this.doHandleRequestBy(ctx, this.eventListeners.recordFinish, ctx.request.isRecordFinish)) return;
        if (await this.doHandleRequestBy(ctx, this.eventListeners.recordFail, ctx.request.isRecordFail)) return;
        if (await this.doHandleRequestBy(ctx, this.eventListeners.playFinishing, ctx.request.isPlayFinishing)) return;
        if (await this.doHandleRequestBy(ctx, this.eventListeners.inSkill, ctx.request.isInSkill)) return;
        if (await this.doHandleRequestBy(ctx, this.intentListeners[ctx.request.intent], () => {
            return this.intentListeners.hasOwnProperty(ctx.request.intent);
        })) return;
        if (await this.doHandleRequestBy(ctx, this.textListeners[ctx.request.query], () => {
            return this.textListeners.hasOwnProperty(ctx.request.query);
        })) return;
        if (await this.doHandleRequestBy(ctx, this.getRegExpHandler(ctx.request.query))) return;
    }

    async doHandleRequestBy(ctx, handler, trigger) {
        if (!handler) return false;
        if ((trigger != undefined)&&(trigger != null)) {
            if ((typeof trigger === 'boolean') && !trigger) return false;
            if ((typeof trigger === 'function') && !trigger()) return false;
        }
        await handler(ctx);
        return true;
    }

    onEvent(eventType, handler) {
        if (!this.eventListeners.hasOwnProperty(eventType)) {
            throw new Error(`ApiBot does not support event type of ${eventType}`);
        }
        if (this.eventListeners[eventType]) {
            console.log(`Warning: override the existing handler of event type ${eventType}`);
        }
        this.verifyHandler(handler);
        this.eventListeners[eventType] = handler;
    }

    onIntent(intent, handler) {
        this.verifyHandler(handler);
        if (this.intentListeners.hasOwnProperty(intent)) {
            console.log(`Warning: override the existing handler of intent ${intent}`);
        }
        this.intentListeners[intent] = handler;
    }

    onError(handler) {
        this.verifyHandler(handler);
        this.errorListener = handler;
    }

    hears(text, handler) {
        this.verifyHandler(handler);
        if (text instanceof RegExp) {
            this.onRegExp(text, handler);
        } else if(typeof text === 'string') {
            this.onText(text, handler);
        }
        else {
            throw new Error(`ApiBot just support hearing String or RegExp!`);
        }
    }

    onRegExp(regex, handler) {
        let regexStr = (new RegExp(regex)).source;
        if (this.regExpListeners.hasOwnProperty(regexStr)) {
            console.log(`Warning: override the existing handler of regex ${regex}`);
        }        
        this.regExpListeners[regexStr] = handler;
    }
    
    onText(text, handler) {
        if (this.textListeners.hasOwnProperty(text)) {
            console.log(`Warning: override the existing handler of text ${text}`);
        }        
        this.textListeners[text] = handler;
    }

    verifyHandler(handler) {
        if (!handler) {
            throw new Error(`Event handler must not be empty`);
        }
        if (typeof handler != 'function') {
            throw new TypeError(`Event handler must be a function`);
        }        
    }

    getRegExpHandler(query) {
        for (let regexStr in this.regExpListeners) {
            if(RegExp(regexStr).test(query)) return this.regExpListeners[regexStr];
        }
        return null;
    }    
}

module.exports = AiBot;