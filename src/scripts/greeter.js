class Greeter {
  constructor(message) {
    this.greeting = message;
  }

  greet() {
    return `Hello, ${this.greeting}!`;
  }
}

export default Greeter;
