# Low-Level Next Steps
Welcome to Low-Level Next Steps.

This project is for learners who have tried basic C and want to understand memory, pointers, structs, and small command-line programs.

Each module has two main files:
- `README.md`: the lesson instructions
- a source file you will run and edit

The best way to learn is simple:

1. Open the module folder.
2. Read the `README.md`.
3. Open the source file.
4. Run the code.
5. Change something small.
6. Run it again and notice what changed.

## Table of Contents
1. [What you will learn](#what-you-will-learn)
2. [How to use this course](#how-to-use-this-course)
3. [How to run a module](#how-to-run-a-module)
4. [Modules overview](#modules-overview)
5. [Final project](#final-project)
6. [Tips for learning](#tips-for-learning)
7. [Wrap up](#wrap-up)

## What you will learn

By the end of this course, you will have practiced:
- seeing addresses and values
- using pointer variables
- moving through arrays
- allocating and freeing memory
- saving structured records
- using warnings and small debugging habits
- building a small records tool
- building a small final project

That is a real foundation.

You will not know every part yet, and that is completely fine.

## How to use this course

Start with Module 1 and go in order.

Each module builds on the one before it. Try not to rush. It is better to understand a small piece well than to fly through everything and feel lost.

## How to run a module

Open the terminal from the `low-level-next-steps` folder.

For example:

```bash
gcc -Wall -Wextra -std=c11 01_memory_basics/main.c -o 01_memory_basics/main
./01_memory_basics/main
```

For another module, change the folder name in the command.

## Modules overview

### [Module 1: Memory Basics](01_memory_basics)

You will practice seeing addresses and values.

This module stays small on purpose. Run it, read it, change one thing, and run it again.

### [Module 2: Pointers](02_pointers)

You will practice using pointer variables.

This module stays small on purpose. Run it, read it, change one thing, and run it again.

### [Module 3: Arrays and Pointer Math](03_arrays_and_pointer_math)

You will practice moving through arrays.

This module stays small on purpose. Run it, read it, change one thing, and run it again.

### [Module 4: Dynamic Memory](04_dynamic_memory)

You will practice allocating and freeing memory.

This module stays small on purpose. Run it, read it, change one thing, and run it again.

### [Module 5: Structs and Files](05_structs_and_files)

You will practice saving structured records.

This module stays small on purpose. Run it, read it, change one thing, and run it again.

### [Module 6: Debugging and Build Tools](06_debugging_and_build_tools)

You will practice using warnings and small debugging habits.

This module stays small on purpose. Run it, read it, change one thing, and run it again.

### [Final Project: CLI Records Tool](07_final_project_cli_records)

You will practice building a small records tool.

This module stays small on purpose. Run it, read it, change one thing, and run it again.

## Final project

### Final Project: CLI Records Tool

The final project is not about being perfect.

It is about putting the pieces together and seeing that you can build something real.

## Tips for learning

Run the code often.

Change one thing at a time.

If an error appears, do not panic. Errors are part of learning. Check the line number, read the message, and compare your code to the example.

After testing, delete compiled binaries and any temporary data files created by a module.

## Wrap up

This course starts small on purpose. By the end, you will have built a real starter project using the ideas you practiced along the way.
