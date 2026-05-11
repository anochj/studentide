// Arrays and Objects
// TypeScript can describe lists and object shapes.

type Course = {
  title: string;
  lessons: number;
  complete: boolean;
};

let course: Course = {
  title: "Learning TypeScript",
  lessons: 6,
  complete: false,
};

let topics: string[] = ["types", "functions", "objects"];

console.log(course.title);
for (let topic of topics) {
  console.log("-", topic);
}
