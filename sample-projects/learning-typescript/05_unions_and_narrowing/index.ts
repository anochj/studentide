// Unions and Narrowing
// A union type lets a value be one of a few choices.

type TaskStatus = "todo" | "doing" | "done";

function describeStatus(status: TaskStatus): string {
  if (status === "todo") {
    return "This task is ready to start.";
  }

  if (status === "doing") {
    return "This task is in progress.";
  }

  return "This task is finished.";
}

let currentStatus: TaskStatus = "doing";
console.log(describeStatus(currentStatus));
