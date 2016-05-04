'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Message = function () {
  function Message(validator, type, text) {
    _classCallCheck(this, Message);

    this.validator = validator;
    this.type = type;
    this.text = text;
  }

  Message.prototype.isError = function isError() {
    return this.type === MessageType.ERROR;
  };

  Message.prototype.toString = function toString() {
    return this.type.toUpperCase() + ' [' + this.validator + '] ' + this.text;
  };

  return Message;
}();

exports.default = Message;
var MessageType = exports.MessageType = {
  ERROR: 'error',
  WARNING: 'warning'
};