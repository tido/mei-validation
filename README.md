# tido-mei-validation
Validating MEI in node

## Install

```bash
git clone https://github.com/tido/mei-validation.git
cd mei-validation
npm install
```

### Java dependency
Beside the npm dependencies, you will also need to have a Java Runtime Environment (JRE)
installed.

## Usage

You can validate XML strings asynchronously by calling `validate`, which returns a Promise:
```js
var validation = require('tido-mei-validation');
validation.validate(meiString, schemaPaths)
  .then(report => {
    // process the validation report
    var status = report.isValid ? 'valid' : 'invalid';
    console.log('document is ' + status);
    report.messages.forEach(message => {
      console.log(message.toString());
    });
  })
  .catch(err => console.log(err));
```
`validate` depends on a global Promise object, which is available in `node`
natively since v4.0.0. If you'd like to run validation on an older version
of Node, you need to install a Promise polyfill.

The synchronous counterpart of `validate`, `validateSync`, can be used this way:
```js
var validation = require('tido-mei-validation');
var report = validation.validateSync(meiString, schemaPaths);
```

Both functions take a string providing the input XML as first argument. The second
argument, `schemaPaths`, must be an object that specifies the paths to an RNG
schema and an XSLT stylesheet for Schematron validation with Saxon:
```js
var schemaPaths = {
  rng: 'path/to/rng/schema.rng',
  schematron: 'path/to/schmatron/schema.xsl',
};
```
