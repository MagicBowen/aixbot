const Response = require('./response')

class Context {
    constructor(req) {
        this.req = req;
        this.res = new Response();
    }
}

module.exports = Context;