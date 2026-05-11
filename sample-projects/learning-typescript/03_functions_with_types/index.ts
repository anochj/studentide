// Functions with Types
// Functions can type their parameters and return value.

function makeGreeting(name: string): string {
  return `Hello, ${name}.`;
}

function addMinutes(first: number, second: number): number {
  return first + second;
}

console.log(makeGreeting("Alex"));
console.log("Study minutes:", addMinutes(20, 15));
