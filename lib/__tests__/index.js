'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chai = require('chai');

var _ = require('..');

var validation = _interopRequireWildcard(_);

var _ValidationReport = require('../report/ValidationReport');

var _ValidationReport2 = _interopRequireDefault(_ValidationReport);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ok = _chai.assert.ok;
var isTrue = _chai.assert.isTrue;
var isFalse = _chai.assert.isFalse;
var lengthOf = _chai.assert.lengthOf;
var instanceOf = _chai.assert.instanceOf;


var schemaPaths = {
  rng: _path2.default.resolve(__dirname, '../../resources/schema/tido.rng'),
  schematron: _path2.default.resolve(__dirname, '../../resources/schema/tido.xsl')
};

describe('validation', function () {
  var validMEI = void 0;

  before(function () {
    var validMEIPath = _path2.default.resolve(__dirname, '../../resources/mei/valid.mei');
    validMEI = _fs2.default.readFileSync(validMEIPath, 'utf-8');
  });

  describe('#validate', function () {
    describe('given a not well-formed XML string and no schema paths', function () {
      it('passes an error and no result to the cb function', function (done) {
        validation.validate('sdf', schemaPaths).then(function () {
          done('Validating a not well-formed XML fragment should throw an error.');
        }).catch(function (err) {
          ok(err);
          done();
        });
      });

      describe('given a well-formed invalid XML string and no schema paths', function () {
        it('passes no error (null) and an invalid validation report to the cb function', function (done) {
          validation.validate('<xml/>', schemaPaths).then(function (result) {
            instanceOf(result, _ValidationReport2.default);
            isFalse(result.isValid);
            lengthOf(result.getErrors(), 1);
            done();
          }).catch(done);
        });
      });

      describe('given a valid MEI string and no schema paths', function () {
        it('passes no error (null) and a valid validation report to the cb function', function (done) {
          validation.validate(validMEI, schemaPaths).then(function (result) {
            instanceOf(result, _ValidationReport2.default);
            isTrue(result.isValid);
            lengthOf(result.getErrors(), 0);
            done();
          }).catch(done);
        });
      });
    });
  });

  describe('#validateSync', function () {
    describe('given a not well-formed XML string and no schema paths', function () {
      it('throws an error', function () {
        var run = function run() {
          return validation.validateSync('sdf', schemaPaths);
        };
        _chai.assert.throws(run);
      });

      describe('given a well-formed invalid XML string and no schema paths', function () {
        it('returns an invalid validation report', function () {
          var report = validation.validateSync('<xml/>', schemaPaths);
          _chai.assert.instanceOf(report, _ValidationReport2.default);
          _chai.assert.isFalse(report.isValid);
          _chai.assert.lengthOf(report.getErrors(), 1);
        });
      });

      describe('given a valid MEI string and no schema paths', function () {
        it('returns a valid validation report', function () {
          var report = validation.validateSync(validMEI, schemaPaths);
          _chai.assert.instanceOf(report, _ValidationReport2.default);
          _chai.assert.isTrue(report.isValid);
          _chai.assert.lengthOf(report.getErrors(), 0);
        });
      });
    });
  });
});