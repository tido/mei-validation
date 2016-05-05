
import { flatten } from 'lodash/fp';
import ValidationReport from './report/ValidationReport';
import rng from './validator/rng';
import schematron from './validator/schematron';

export function validate(meiString, schemaPaths, shouldCache = false) {
  if (typeof schemaPaths !== 'object' || !schemaPaths.rng || !schemaPaths.schematron) {
    throw new Error('the second parameter must be an object ' +
      'specifying both an rng and a schematron schema.');
  }
  const validationSteps = [
    rng.validateWithFile(meiString, schemaPaths.rng, shouldCache),
    schematron.validateWithFile(meiString, schemaPaths.schematron, shouldCache),
  ];

  return Promise
    .all(validationSteps)
    .then(flatten)
    .then(ValidationReport.create);
}

export function validateSync(meiString, schemaPaths, shouldCache = false) {
  if (typeof schemaPaths !== 'object' || !schemaPaths.rng || !schemaPaths.schematron) {
    throw new Error('the second parameter must be an object ' +
      'specifying both an rng and a schematron schema.');
  }
  const messages = [
    ...rng.validateWithFileSync(meiString, schemaPaths.rng, shouldCache),
    ...schematron.validateWithFileSync(meiString, schemaPaths.schematron, shouldCache),
  ];

  return ValidationReport.create(messages);
}
