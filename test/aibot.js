const should = require('should');
const AiBot = require('../')

describe('AiBot', function () {
    describe('#getAppId()', function () {
        it('should get the correct app id', function () {
            const aibot = new AiBot('12345');
            aibot.appId.should.be.exactly('12345');
        });
    });
    describe('#onEvent()', function () {
        it('should set handler for valid event type', function () {
            const aibot = new AiBot('12345');
            let handler = () => {};
            aibot.onEvent('enterSkill', handler);
            aibot.eventListeners.enterSkill.should.be.exactly(handler);
        });
        it('should throw exception for invalid event type', function () {
            const aibot = new AiBot('12345');
            should(function() {aibot.onEvent('enterSkills', () => {})}).throw();
        });
        it('should throw exception for null handler type', function () {
            const aibot = new AiBot('12345');
            should(function() {aibot.onEvent('enterSkill')}).throw();
        });
        it('should throw exception for invalid handler type', function () {
            const aibot = new AiBot('12345');
            should(function() {aibot.onEvent('enterSkill', 123)}).throw();
        });
    });
    describe('#handleRequest()', function() {
        it('should invoke event handler for valid request', async function () {
            const aibot = new AiBot('12345');

            let handlerEntered = false;

            aibot.onEvent('enterSkill', function(ctx) {
                handlerEntered=true;
            });

            await aibot.handleRequest({ session: { 
                                          application: { app_id: "12345"}, user: {user_id: "456"}}
                                        , request: {type: 0}}
                                     );

            handlerEntered.should.be.exactly(true);
        });
        it('should not invoke event handler for invalid app id', async function () {
            const aibot = new AiBot('12345');

            let handlerEntered = false;

            aibot.onEvent('enterSkill', function(ctx) {
                handlerEntered=true;
            });

            await aibot.handleRequest({ session: {
                                          application: {app_id: "1234"}, user: {user_id: "456"}}
                                      , request: {type: 0}}
                                      );

            handlerEntered.should.be.exactly(false);
        });
        it('should not invoke enter skill event handler for quit skill request', async function () {
            const aibot = new AiBot('12345');

            let eventType = -1;

            aibot.onEvent('enterSkill', function(ctx) {
                eventType = 0;
            });
            
            aibot.onEvent('quitSkill', function(ctx) {
                eventType = 2;
            });

            await aibot.handleRequest({ session: {
                                          application: {app_id: "12345"}, user: {user_id: "456"}}
                                      , request: {type: 2}}
                                      );

            eventType.should.be.exactly(2);
        });
        it('should invoke intent handler for intent request', async function () {
            const aibot = new AiBot('12345');

            let intentHandled = false;

            aibot.onIntent('query-name', function(ctx) {
                intentHandled = true;
            });

            await aibot.handleRequest({ session: {
                                          application: {app_id: "12345"}, user: {user_id: "456"}}
                                      , request: {type: 1, slot_info: {intent_name : 'query-name'}}}
                                      );

            intentHandled.should.be.exactly(true);
        });
        it('should not invoke intent handler for unmatched intent name request', async function () {
            const aibot = new AiBot('12345');

            let intentHandled = false;

            aibot.onIntent('query-name', function(ctx) {
                intentHandled = true;
            });

            await aibot.handleRequest({ session: {
                                          application: {app_id: "12345"}, user: {user_id: "456"}}
                                      , request: {type: 1, slot_info: {intent_name : 'query-sex'}}}
                                      );

            intentHandled.should.be.exactly(false);
        });
        it('should invoke text handler for matched query text request', async function () {
            const aibot = new AiBot('12345');

            let textHandled = false;

            aibot.hears('hello', function(ctx) {
                textHandled = true;
            });

            await aibot.handleRequest({ session: {
                                          application: {app_id: "12345"}, user: {user_id: "456"}}
                                      , query: 'hello'
                                      , request: {type: 1}}
                                      );

            textHandled.should.be.exactly(true);
        });
        it('should invoke regex handler for matched query text request', async function () {
            const aibot = new AiBot('12345');

            let regexHandled = false;

            aibot.hears(/\w+/, function(ctx) {
                regexHandled = true;
            });

            await aibot.handleRequest({ session: {
                                          application: {app_id: "12345"}, user: {user_id: "456"}}
                                      , query: 'hello'
                                      , request: {type: 1}}
                                      );

            regexHandled.should.be.exactly(true);
        });
    });
});