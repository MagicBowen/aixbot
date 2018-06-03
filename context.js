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
    .method('audio')
    .method('appendTts')
    .method('display')
    .method('openMic')
    .method('closeSession')
    .method('notUnderstand')
    .method('setSession')
    .method('record')
    .method('playMsgs')
    .method('registerPlayFinishing')
    .getter('body');

module.exports = Context;