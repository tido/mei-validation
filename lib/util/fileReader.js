'use strict';

exports.__esModule = true;
exports.read = read;
exports.readWithCache = readWithCache;
exports.readSync = readSync;
exports.readWithCacheSync = readWithCacheSync;

var _gumyen = require('gumyen');

var gumyen = _interopRequireWildcard(_gumyen);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var cache = {};

function read(filePath, transform) {
  return new Promise(function (resolve, reject) {
    gumyen.readFileWithDetectedEncoding(filePath, function (err, result) {
      if (!err) {
        var transformedResult = transform ? transform(result) : result;
        resolve(transformedResult);
      } else {
        reject(err);
      }
    });
  });
}

function readWithCache(filePath, transform) {
  if (cache[filePath]) {
    return Promise.resolve(cache[filePath]);
  }

  return read(filePath, transform).then(function (result) {
    cache[filePath] = result;
    return result;
  });
}

function readSync(filePath, transform) {
  var data = gumyen.readFileWithDetectedEncodingSync(filePath);

  if (transform) {
    return transform(data);
  }

  return data;
}

function readWithCacheSync(filePath, transform) {
  if (cache[filePath]) {
    return cache[filePath];
  }

  var data = readSync(filePath, transform);
  cache[filePath] = data;

  return data;
}