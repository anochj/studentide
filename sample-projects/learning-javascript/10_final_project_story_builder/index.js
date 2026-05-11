// Final Project: Story Builder
// This project uses variables, strings, input, conditionals, arrays, and loops.

const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Welcome to the Story Builder.");
console.log("Answer a few questions and I will print a short story.");
console.log();

rl.question("What is your name? ", (name) => {
  rl.question("Name a place: ", (place) => {
    rl.question("Name something you like: ", (item) => {
      let storyEvents = ["found a clue", "made a plan", "shared the win"];

      console.log();
      console.log("Story Time");
      console.log("----------");

      if (item.length > 6) {
        console.log(`${name} packed the ${item} carefully before going to ${place}.`);
      } else {
        console.log(`${name} carried the ${item} all the way to ${place}.`);
      }

      for (let event of storyEvents) {
        console.log("-", event);
      }

      console.log(`${name} finished the adventure and learned something new.`);
      rl.close();
    });
  });
});
