import { DOMParser } from 'xmldom';

import wrapFragment from './wrapFragment';
import fileReader from './fileReader';

export { wrapFragment, fileReader };

export function getMEI(
  wrapperName,
  data,
  options = {},
  valid = true,
  validate
) {
  const mei = wrapFragment(wrapperName, data, options, valid, validate);
  return parseXML(mei);
}

export function parseXML(str) {
  return new DOMParser().parseFromString(str, 'text/xml');
}
