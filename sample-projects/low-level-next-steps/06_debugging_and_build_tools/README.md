# Module 6: Debugging and Build Tools

In this module, you will practice using warnings and small debugging habits.

Do not worry about memorizing everything. The goal is to run the code, read it slowly, and make one small change.

## Table of Contents
1. [What you will learn](#what-you-will-learn)
2. [How to run this module](#how-to-run-this-module)
3. [What this module is about](#what-this-module-is-about)
4. [Open the file](#open-the-file)
5. [Small example](#small-example)
6. [Common mistakes](#common-mistakes)
7. [Try it yourself](#try-it-yourself)
8. [Wrap up](#wrap-up)

## What you will learn

By the end of this module, you will know how to:

- using warnings and small debugging habits
- compile with warnings enabled
- clean up generated files after testing

## How to run this module

From this course folder, run:

```bash
gcc -Wall -Wextra -std=c11 06_debugging_and_build_tools/main.c -o 06_debugging_and_build_tools/main
./06_debugging_and_build_tools/main
```

Then press Enter.

## What this module is about

Using warnings and small debugging habits is one small part of programming. You will see the idea in the README first, then in `main.c`.

## Open the file

Open [main.c](main.c).

Run the file first. Then change one small value and run it again.

## Small example

```c
int value = 10;
int *pointer = &value;
```

## Common mistakes

Here are a few things to check if something breaks:

- spelling of names
- matching quotes or brackets
- missing semicolons when the language uses them
- running the command from the right folder

Errors are normal. They are part of learning.

## Try it yourself

### Challenge 1
Change one record or value.

### Challenge 2
Compile with warnings enabled.

### Challenge 3
Delete the compiled `main` file when you are done.

## Wrap up

Nice work. You practiced one useful idea and changed working code yourself.
