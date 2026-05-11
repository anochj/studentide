# Module 1: Welcome to TypeScript

In this module, you will run your first TypeScript program.

Do not worry about memorizing every type rule. The goal is to notice how TypeScript gives names to the shapes of values.

## Table of Contents
1. [What you will learn](#what-you-will-learn)
2. [How to run this module](#how-to-run-this-module)
3. [Open the file](#open-the-file)
4. [Small example](#small-example)
5. [Common mistakes](#common-mistakes)
6. [Try it yourself](#try-it-yourself)
7. [Wrap up](#wrap-up)

## What you will learn

By the end of this module, you will know how to:

- run your first TypeScript program
- run a TypeScript file with `tsx`
- make one small typed change safely

## How to run this module

From the `learning-typescript` folder, run:

```bash
tsx 01_welcome_to_typescript/index.ts
```

Then press Enter.

## Open the file

Open [index.ts](index.ts).

Run it first. Then change one small value and run it again.

## Small example

```typescript
let name: string = "Alex";
console.log(name);
```

The `: string` part tells TypeScript that `name` should hold text.

## Common mistakes

Here are a few things to check if something breaks:

- assigning a number to a value typed as `string`
- forgetting a required object property
- spelling a type name or variable name two different ways
- running the command from the wrong folder

Errors are normal. TypeScript errors are often useful because they appear before the program runs.

## Try it yourself

### Challenge 1
Change one starter value.

### Challenge 2
Add one more typed variable or object property.

### Challenge 3
Run the module again and read the result.

## Wrap up

Nice work. You practiced one TypeScript idea and changed working code yourself.
