// Final Project: Task Planner
// This project uses typed objects, arrays, functions, and union types.

type TaskStatus = "todo" | "doing" | "done";

type Task = {
  title: string;
  minutes: number;
  status: TaskStatus;
};

function printTask(task: Task): void {
  console.log(`${task.title} - ${task.minutes} minutes - ${task.status}`);
}

function countDone(tasks: Task[]): number {
  let total = 0;

  for (let task of tasks) {
    if (task.status === "done") {
      total = total + 1;
    }
  }

  return total;
}

let tasks: Task[] = [
  { title: "Review JavaScript", minutes: 20, status: "done" },
  { title: "Practice TypeScript types", minutes: 25, status: "doing" },
  { title: "Build a small project", minutes: 30, status: "todo" },
];

console.log("Task Planner");
console.log("------------");

for (let task of tasks) {
  printTask(task);
}

console.log();
console.log("Finished tasks:", countDone(tasks));
console.log("Nice work. You built a typed starter project.");
