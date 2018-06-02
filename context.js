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

    get body() {
        return this.res.getBody();
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
    .method('registerPlayFinishing');

module.exports = Context;