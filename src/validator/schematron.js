import * as path from 'path';
import { flow, partial, map, compact } from 'lodash/fp';
import * as xslt4node from 'xslt4node';

import * as fileReader from '../util/fileReader';
import Message, { MessageType } from '../report/Message';

const saxonPath = path.resolve(__dirname, '../../vendor/saxon/saxon9he.jar');

xslt4node.addLibrary(saxonPath);

const schematronValidator = {
  TYPE: 'schematron',

  validateWithFile(
    xmlString,
    schemaPath,
    shouldCache
  ) {
    const read = shouldCache ? fileReader.readWithCache : fileReader.read;
    const validate = partial(schematronValidator.validateWithString, [xmlString]);

    return read(schemaPath, null).then(validate);
  },

  validateWithString(xmlString, xslString) {
    return new Promise((resolve, reject) => {
      const transformConfig = {
        xslt: xslString,
        source: xmlString,
        result: Buffer,
      };

      xslt4node.transform(transformConfig, (err, result) => {
        if (!err) {
          const messages = createMessages(result.toString());
          resolve(messages);
        } else {
          reject(err);
        }
      });
    });
  },

  validateWithFileSync(xmlString, schemaPath, shouldCache) {
    const read = shouldCache ? fileReader.readWithCacheSync : fileReader.readSync;
    const schematronString = read(schemaPath, null);

    return schematronValidator.validateWithStringSync(xmlString, schematronString);
  },

  validateWithStringSync(xmlString, xslString) {
    const transformConfig = {
      xslt: xslString,
      source: xmlString,
      result: Buffer,
    };

    const result = xslt4node.transformSync(transformConfig).toString();

    return createMessages(result);
  },
};

const createMessages = flow(
  splitByRegularLineBreak,
  map(createMessage),
  compact
);

function createMessage(textLine) {
  const textLineItems = splitBySoftLineBreak(textLine);
  const text = textLineItems[1];
  if (textLineItems && text) {
    const messageType = getMessageType(textLineItems[0]);
    return new Message(schematronValidator.TYPE, messageType, text);
  }
  return null;
}

// the TIDO schema currently contains two types of schematron messages:
// with @role="warning" and without @role attribute. For now we interpret all
// messages which are not warnings as errors, but we should make the schema
// consistent. Some but not all messages without @role seem to be errors.
function getMessageType(schematronRole) {
  return schematronRole === 'warning'
    ? MessageType.WARNING
    : MessageType.ERROR;
}

function splitByRegularLineBreak(str) {
  return str.split(/\u2029/);
}

function splitBySoftLineBreak(str) {
  return str.split(/\u2028/);
}

export default schematronValidator;
