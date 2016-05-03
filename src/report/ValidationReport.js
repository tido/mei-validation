
export default class ValidationReport {
  isValid;
  messages;

  static create(messages) {
    const isValid = !messages.some(message => message.isError());

    return new ValidationReport(isValid, messages);
  }

  constructor(isValid, messages) {
    this.isValid = isValid;
    this.messages = messages;
  }

  getErrors() {
    return this.messages.filter((message) => message.isError());
  }
}
