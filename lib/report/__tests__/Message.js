'use strict';

var _chai = require('chai');

var _Message = require('../Message');

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* @flow */

describe('Message', function () {
  describe('#toString', function () {
    it('returns a string', function (done) {
      var message = new _Message2.default('bla', _Message.MessageType.ERROR, 'message');

      var string = message.toString();
      _chai.assert.equal(string, 'ERROR [bla] message');
      done();
    });
  });
});