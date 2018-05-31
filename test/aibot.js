const should = require('should');
const AiBot = require('../')

describe('AiBot', function () {
    describe('#getAppId()', function () {
        it('should get the correct app id', function () {
            const aibot = new AiBot('12345');
            aibot.appId.should.be.exactly('12345');
        });
    });
});