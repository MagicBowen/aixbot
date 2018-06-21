const Response = require('./response');
const delegate = require('delegates');

class Context {
    constructor(req) {
        this.req = req;
        this.res = new Response();
    }

    get request() {
        return this.req;
    }

    get response() {
        return this.res;
    }
}

delegate(Context.prototype, 'res')
    .method('speak')
    .method('reply')
    .method('query')
    .method('directiveAudio')
    .method('directiveTts')
    .method('directiveRecord')
    .method('display')
    .method('playMsgs')
    .method('launchQuickApp')
    .method('launchApp')
    .getter('body');

module.exports = Context;