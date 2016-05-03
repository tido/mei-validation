import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import * as validation from '..';
import ValidationReport from '../report/ValidationReport';

const { ok, isTrue, isFalse, lengthOf, instanceOf } = assert;

const schemaPaths = {
  rng: path.resolve(__dirname, '../../resources/schema/tido.rng'),
  schematron: path.resolve(__dirname, '../../resources/schema/tido.xsl'),
};

describe('validation', () => {
  let validMEI;

  before(() => {
    const validMEIPath = path.resolve(__dirname, '../../resources/mei/valid.mei');
    validMEI = fs.readFileSync(validMEIPath, 'utf-8');
  });

  describe('#validate', () => {
    describe('given a not well-formed XML string and no schema paths', () => {
      it('passes an error and no result to the cb function', (done) => {
        validation
          .validate('sdf', schemaPaths)
          .then(() => {
            done('Validating a not well-formed XML fragment should throw an error.');
          })
          .catch((err) => {
            ok(err);
            done();
          });
      });

      describe('given a well-formed invalid XML string and no schema paths', () => {
        it('passes no error (null) and an invalid validation report to the cb function', (done) => {
          validation
            .validate('<xml/>', schemaPaths)
            .then((result) => {
              instanceOf(result, ValidationReport);
              isFalse(result.isValid);
              lengthOf(result.getErrors(), 1);
              done();
            })
            .catch(done);
        });
      });

      describe('given a valid MEI string and no schema paths', () => {
        it('passes no error (null) and a valid validation report to the cb function', (done) => {
          validation
             .validate(validMEI, schemaPaths)
             .then((result) => {
               instanceOf(result, ValidationReport);
               isTrue(result.isValid);
               lengthOf(result.getErrors(), 0);
               done();
             })
             .catch(done);
        });
      });
    });
  });

  describe('#validateSync', () => {
    describe('given a not well-formed XML string and no schema paths', () => {
      it('throws an error', () => {
        const run = () => validation.validateSync('sdf', schemaPaths);
        assert.throws(run);
      });

      describe('given a well-formed invalid XML string and no schema paths', () => {
        it('returns an invalid validation report', () => {
          const report = validation.validateSync('<xml/>', schemaPaths);
          assert.instanceOf(report, ValidationReport);
          assert.isFalse(report.isValid);
          assert.lengthOf(report.getErrors(), 1);
        });
      });

      describe('given a valid MEI string and no schema paths', () => {
        it('returns a valid validation report', () => {
          const report = validation.validateSync(validMEI, schemaPaths);
          assert.instanceOf(report, ValidationReport);
          assert.isTrue(report.isValid);
          assert.lengthOf(report.getErrors(), 0);
        });
      });
    });
  });
});
