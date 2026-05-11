// Arrays and Loops
// Arrays store groups of values. Loops repeat code.

let foods = ["pizza", "sushi", "tacos"];

console.log("Favourite foods:");
for (let food of foods) {
  console.log("-", food);
}

foods.push("pasta");

console.log("Updated foods:");
for (let food of foods) {
  console.log("-", food);
}
