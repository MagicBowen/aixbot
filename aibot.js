class AiBot {
    constructor(appId) {
        this.appId = appId;
    }
    
    handleEvent(event) {
        const {query, session, context, request} = event;
    }
}

module.exports = AiBot;