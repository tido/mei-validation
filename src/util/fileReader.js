import * as gumyen from 'gumyen';

const cache = {};

export function read(filePath, transform) {
  return new Promise((resolve, reject) => {
    gumyen.readFileWithDetectedEncoding(filePath, (err, result) => {
      if (!err) {
        const transformedResult = transform ? transform(result) : result;
        resolve(transformedResult);
      } else {
        reject(err);
      }
    });
  });
}

export function readWithCache(filePath, transform) {
  if (cache[filePath]) {
    return Promise.resolve(cache[filePath]);
  }

  return read(filePath, transform)
    .then(result => {
      cache[filePath] = result;
      return result;
    });
}

export function readSync(filePath, transform) {
  const data = gumyen.readFileWithDetectedEncodingSync(filePath);

  if (transform) {
    return transform(data);
  }

  return data;
}

export function readWithCacheSync(filePath, transform) {
  if (cache[filePath]) {
    return cache[filePath];
  }

  const data = readSync(filePath, transform);
  cache[filePath] = data;

  return data;
}
