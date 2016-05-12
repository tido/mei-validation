# mei-validation-js
Validating MEI in node

## Install

```bash
git clone https://github.com/tido/mei-validation-js.git
cd mei-validation-js
npm install
```

## Java dependencies
In order to build the schema and guidelines you will need
- `java` runtime environment
- `JDK`
- `ant`
- `saxon`

## Usage

Use it asyncronously (with ES6 promises):
```js
validate(meiString, schemaPaths)
.then((result) => {
  // process result
  done();
})
.catch(done);
```
Note that currently the asyncronous function can only be used in an ES6 environment,
but we are planning to use babel polifill in order to make this available
for use with ES5 too

Use it syncronously:
```js
var report = validation.validateSync(meiString, schemaPaths);
```

In both cases `shcemaPaths` is an object that specifies the paths
to RGN and Schematron schemas:
```js
var schemaPaths = {
  rng: 'path/to/rng/schema.rng',
  schematron: 'path/to/schmatron/schema.xsl'),
};
```
