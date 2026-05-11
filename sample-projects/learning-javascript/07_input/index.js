// Input
// This module uses readline to ask questions in the terminal.

const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What is your name? ", (name) => {
  rl.question("What do you want to build? ", (goal) => {
    console.log(`Hello, ${name}.`);
    console.log(`One day, you want to build ${goal}.`);
    rl.close();
  });
});
