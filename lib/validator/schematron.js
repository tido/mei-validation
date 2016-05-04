'use strict';

exports.__esModule = true;

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _fp = require('lodash/fp');

var _xslt4node = require('xslt4node');

var xslt4node = _interopRequireWildcard(_xslt4node);

var _fileReader = require('../util/fileReader');

var fileReader = _interopRequireWildcard(_fileReader);

var _Message = require('../report/Message');

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var saxonPath = path.resolve(__dirname, '../../vendor/saxon/saxon9he.jar');

xslt4node.addLibrary(saxonPath);

var schematronValidator = {
  TYPE: 'schematron',

  validateWithFile: function validateWithFile(xmlString, schemaPath, shouldCache) {
    var read = shouldCache ? fileReader.readWithCache : fileReader.read;
    var validate = (0, _fp.partial)(schematronValidator.validateWithString, [xmlString]);

    return read(schemaPath, null).then(validate);
  },
  validateWithString: function validateWithString(xmlString, xslString) {
    return new Promise(function (resolve, reject) {
      var transformConfig = {
        xslt: xslString,
        source: xmlString,
        result: Buffer
      };

      xslt4node.transform(transformConfig, function (err, result) {
        if (!err) {
          var messages = createMessages(result.toString());
          resolve(messages);
        } else {
          reject(err);
        }
      });
    });
  },
  validateWithFileSync: function validateWithFileSync(xmlString, schemaPath, shouldCache) {
    var read = shouldCache ? fileReader.readWithCacheSync : fileReader.readSync;
    var schematronString = read(schemaPath, null);

    return schematronValidator.validateWithStringSync(xmlString, schematronString);
  },
  validateWithStringSync: function validateWithStringSync(xmlString, xslString) {
    var transformConfig = {
      xslt: xslString,
      source: xmlString,
      result: Buffer
    };

    var result = xslt4node.transformSync(transformConfig).toString();

    return createMessages(result);
  }
};

var createMessages = (0, _fp.flow)(splitByRegularLineBreak, (0, _fp.map)(createMessage), _fp.compact);

function createMessage(textLine) {
  var textLineItems = splitBySoftLineBreak(textLine);
  var text = textLineItems[1];
  if (textLineItems && text) {
    var messageType = getMessageType(textLineItems[0]);
    return new _Message2.default(schematronValidator.TYPE, messageType, text);
  }
  return null;
}

// the TIDO schema currently contains two types of schematron messages:
// with @role="warning" and without @role attribute. For now we interpret all
// messages which are not warnings as errors, but we should make the schema
// consistent. Some but not all messages without @role seem to be errors.
function getMessageType(schematronRole) {
  return schematronRole === 'warning' ? _Message.MessageType.WARNING : _Message.MessageType.ERROR;
}

function splitByRegularLineBreak(str) {
  return str.split(/\u2029/);
}

function splitBySoftLineBreak(str) {
  return str.split(/\u2028/);
}

exports.default = schematronValidator;