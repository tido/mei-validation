
export default class Message {
  validator;
  type;
  text;

  constructor(validator, type, text) {
    this.validator = validator;
    this.type = type;
    this.text = text;
  }

  isError() {
    return this.type === MessageType.ERROR;
  }

  toString() {
    return `${this.type.toUpperCase()} [${this.validator}] ${this.text}`;
  }
}

export const MessageType = {
  ERROR: 'error',
  WARNING: 'warning',
};
