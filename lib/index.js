'use strict';

exports.__esModule = true;
exports.validate = validate;
exports.validateSync = validateSync;

var _fp = require('lodash/fp');

var _ValidationReport = require('./report/ValidationReport');

var _ValidationReport2 = _interopRequireDefault(_ValidationReport);

var _rng = require('./validator/rng');

var _rng2 = _interopRequireDefault(_rng);

var _schematron = require('./validator/schematron');

var _schematron2 = _interopRequireDefault(_schematron);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(meiString, schemaPaths) {
  var shouldCache = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var validationSteps = [_rng2.default.validateWithFile(meiString, schemaPaths.rng, shouldCache), _schematron2.default.validateWithFile(meiString, schemaPaths.schematron, shouldCache)];

  return Promise.all(validationSteps).then(_fp.flatten).then(_ValidationReport2.default.create);
}

function validateSync(meiString, schemaPaths) {
  var shouldCache = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var messages = [].concat(_rng2.default.validateWithFileSync(meiString, schemaPaths.rng, shouldCache), _schematron2.default.validateWithFileSync(meiString, schemaPaths.schematron, shouldCache));

  return _ValidationReport2.default.create(messages);
}