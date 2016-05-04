"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationReport = function () {
  ValidationReport.create = function create(messages) {
    var isValid = !messages.some(function (message) {
      return message.isError();
    });

    return new ValidationReport(isValid, messages);
  };

  function ValidationReport(isValid, messages) {
    _classCallCheck(this, ValidationReport);

    this.isValid = isValid;
    this.messages = messages;
  }

  ValidationReport.prototype.getErrors = function getErrors() {
    return this.messages.filter(function (message) {
      return message.isError();
    });
  };

  return ValidationReport;
}();

exports.default = ValidationReport;