# Module 9: Loops and Lists

You made it to the last regular module.

In this module, you will learn about lists and loops.

Lists let you store more than one value.

Loops let you repeat code.

Together, they are very useful.

## Table of Contents
1. [What you will learn](#what-you-will-learn)
2. [How to run this module](#how-to-run-this-module)
3. [What is a list](#what-is-a-list)
4. [Open the file](#open-the-file)
5. [Creating a list](#creating-a-list)
6. [Printing a list](#printing-a-list)
7. [Using a `for` loop](#using-a-for-loop)
8. [Adding to a list](#adding-to-a-list)
9. [Common mistakes](#common-mistakes)
10. [Try it yourself](#try-it-yourself)
11. [Wrap up](#wrap-up)

## What you will learn

By the end of this module, you will know:

- what a list is
- how to create a list
- how to print a list
- how to use a `for` loop
- how to add an item with `.append()`

## How to run this module

To run this module, open the terminal and type:

```bash
python3 09_loops_and_lists
```

Then press Enter.

## What is a list

A list stores multiple values in one variable.

For example:

```python
foods = ["pizza", "sushi", "tacos"]
```

The variable is called `foods`.

Inside the list, there are three strings.

Lists use square brackets:

```python
[]
```

The items inside are separated by commas.

## Open the file

Open [__main__.py](__main__.py).

This is the file you will use for this module.

Inside, you should see lists and loops.

Run the file first. Then change the list items and run it again.

## Creating a list

Here is a list of foods:

```python
foods = ["pizza", "sushi", "tacos"]
```

Here is a list of numbers:

```python
scores = [10, 20, 30]
```

Lists can store different kinds of values, but for now, keep your lists simple.

A list of strings is a great place to start.

## Printing a list

You can print the whole list:

```python
foods = ["pizza", "sushi", "tacos"]
print(foods)
```

This works, but the output looks like a Python list:

```text
['pizza', 'sushi', 'tacos']
```

Sometimes that is fine.

But often, you want to print each item one at a time.

That is where loops help.

## Using a `for` loop

A `for` loop repeats code for each item in a list.

```python
foods = ["pizza", "sushi", "tacos"]

for food in foods:
    print(food)
```

This prints:

```text
pizza
sushi
tacos
```

Read this line:

```python
for food in foods:
```

as:

> For each food in the foods list, run the indented code.

The variable `food` holds one item at a time.

## Adding to a list

You can add an item to the end of a list with `.append()`.

```python
foods = ["pizza", "sushi"]
foods.append("tacos")

print(foods)
```

Now the list has three items.

`.append()` is useful when your program learns something new and needs to store it.

## Common mistakes

Here are a few common mistakes.

### Forgetting commas

```python
foods = ["pizza" "sushi" "tacos"]
```

Use commas:

```python
foods = ["pizza", "sushi", "tacos"]
```

### Forgetting the colon in a loop

```python
for food in foods
    print(food)
```

Use a colon:

```python
for food in foods:
    print(food)
```

### Forgetting indentation

```python
for food in foods:
print(food)
```

Indent the line inside the loop:

```python
for food in foods:
    print(food)
```

## Try it yourself

Now try a few small experiments in [__main__.py](__main__.py).

### Challenge 1
Create a list of three favourite foods.

Print the whole list.

### Challenge 2
Use a `for` loop to print each food on its own line.

### Challenge 3
Create a list of three things you want to learn.

Loop through the list and print each one.

### Challenge 4
Use `.append()` to add one more item to a list.

Then print the list again.

## Wrap up

That is it for the regular modules.

You learned that lists store multiple values.

You also learned that loops repeat code.

Together, they let you work with groups of information.

You are ready for the final project.
