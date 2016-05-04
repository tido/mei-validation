'use strict';

exports.__esModule = true;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _java = require('java');

var _java2 = _interopRequireDefault(_java);

var _fp = require('lodash/fp');

var _Message = require('../report/Message');

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_java2.default.classpath.push(_path2.default.resolve(__dirname, '../../vendor/njing/njing.jar'));
_java2.default.classpath.push(_path2.default.resolve(__dirname, '../../vendor/njing/jing.jar'));

var cache = {};

var rngValidator = {
  TYPE: 'rng',

  validateWithFile: function validateWithFile(xmlString, schemaPath, shouldCache) {
    return validate(xmlString, schemaPath, shouldCache, ['loadSchemaFile', schemaPath]);
  },

  validateWithFileSync: function validateWithFileSync(xmlString, schemaPath, shouldCache) {
    return validateSync(xmlString, schemaPath, shouldCache, ['loadSchemaFile', schemaPath]);
  },

  validateWithStringSync: function validateWithStringSync(xmlString, schemaPath, rngString, shouldCache) {
    return validateSync(xmlString, schemaPath, shouldCache, ['loadSchemaString', rngString, '/']);
  }
};

var validate = function validate(xmlString, schemaPath, shouldCache, params) {
  return shouldCache && cache[schemaPath] ? runValidation(cache[schemaPath]) : createOutputStream().then(createValidator).then(loadSchema(params, schemaPath, shouldCache)).then(runValidation(xmlString));
};

var createOutputStream = function createOutputStream() {
  return new Promise(function (resolve, reject) {
    _java2.default.newInstance('java.io.ByteArrayOutputStream', 1024, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

var createValidator = function createValidator(result) {
  return new Promise(function (resolve, reject) {
    _java2.default.newInstance('com.tido.njing.NJing', result, function (err, validator) {
      if (err) {
        reject(err);
      } else {
        resolve({ validator: validator, result: result });
      }
    });
  });
};

var loadSchema = function loadSchema(params, schemaPath, shouldCache) {
  return function (_ref) {
    var validator = _ref.validator;
    var result = _ref.result;
    return new Promise(function (resolve, reject) {
      _java2.default.callMethod.apply(_java2.default, [validator].concat(params, [function (err) {
        if (err) {
          reject(err);
        } else {
          if (shouldCache) {
            cache[schemaPath] = { result: result, validator: validator };
          }
          resolve({ validator: validator, result: result });
        }
      }]));
    });
  };
};

var runValidation = function runValidation(xmlString) {
  return function (_ref2) {
    var validator = _ref2.validator;
    var result = _ref2.result;
    return new Promise(function (resolve, reject) {
      _java2.default.callMethod(validator, 'validateString', xmlString, '/', function (err) {
        if (err) {
          reject(err);
        } else {
          result.toByteArray(function (err, byteArray) {
            if (err) {
              reject(err);
            } else {
              (function () {
                var buf = new Buffer(byteArray);
                var rawMessages = buf.toString().split('\n');
                var messages = createMessages(rawMessages);
                result.reset(function (err) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(messages);
                  }
                });
              })();
            }
          });
        }
      });
    });
  };
};

var validateSync = function validateSync(xmlString, schemaPath, shouldCache, params) {
  var result = void 0;
  var validator = void 0;

  if (shouldCache && cache[schemaPath]) {
    result = cache[schemaPath].result;
    validator = cache[schemaPath].validator;
  } else {
    result = _java2.default.newInstanceSync('java.io.ByteArrayOutputStream', 1024);
    validator = _java2.default.newInstanceSync('com.tido.njing.NJing', result);
    _java2.default.callMethodSync.apply(_java2.default, [validator].concat(params));

    if (shouldCache) {
      cache[schemaPath] = { result: result, validator: validator };
    }
  }

  _java2.default.callMethodSync(validator, 'validateString', xmlString, '/');
  var buf = new Buffer(result.toByteArraySync());
  var rawMessages = buf.toString().split('\n');
  result.resetSync();

  return createMessages(rawMessages);
};

var createMessages = (0, _fp.flow)((0, _fp.map)(createMessage), _fp.compact);

var regex = /(.*):(\d+):(\d+): (\w+): (.*)/;

function createMessage(rawMessage) {
  if (rawMessage === '') return null;
  var match = regex.exec(rawMessage);
  if (!match) {
    throw new Error('unknown message format ' + rawMessage);
  }

  // currently ignoring systemId (first item in array) and message type
  // (fourth item) in validation report

  var _match$slice = match.slice(1);

  var line = _match$slice[1];
  var column = _match$slice[2];
  var rawText = _match$slice[4];


  var messageType = _Message.MessageType.ERROR;
  var text = '[' + line + ':' + column + '] ' + rawText;
  return new _Message2.default(rngValidator.TYPE, messageType, text);
}

exports.default = rngValidator;