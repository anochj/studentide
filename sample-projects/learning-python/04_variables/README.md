# Module 4: Variables

Welcome back.

In this module, you will learn about variables.

A variable is a name that stores a value. That might sound a little abstract at first, but you already use this idea in real life.

For example, your name is a value. Your age is a value. Your favourite food is a value.

In Python, variables let you save those values so you can use them later.

## Table of Contents
1. [What you will learn](#what-you-will-learn)
2. [How to run this module](#how-to-run-this-module)
3. [What is a variable](#what-is-a-variable)
4. [Open the file](#open-the-file)
5. [Creating a variable](#creating-a-variable)
6. [Printing a variable](#printing-a-variable)
7. [Changing a variable](#changing-a-variable)
8. [Variable names](#variable-names)
9. [Common mistakes](#common-mistakes)
10. [Try it yourself](#try-it-yourself)
11. [Wrap up](#wrap-up)

## What you will learn

By the end of this module, you will know:

- what a variable is
- how to create a variable
- how to print a variable
- how to change the value inside a variable
- how to choose simple variable names

## How to run this module

To run this module, open the terminal and type:

```bash
python3 04_variables
```

Then press Enter.

## What is a variable

A variable is a name that stores a value.

Here is a simple example:

```python
name = "Alex"
```

This means:

- the variable name is `name`
- the value stored inside it is `"Alex"`

You can think of it like a label on a box.

The label says `name`.

The thing inside the box is `"Alex"`.

## Open the file

Open [__main__.py](__main__.py).

This is the file you will use for this module.

Inside, you should see examples of variables that store text and numbers.

Run the file first. Then change a few values and run it again.

## Creating a variable

You create a variable by choosing a name, using an equals sign, and giving it a value.

For example:

```python
city = "Toronto"
age = 14
```

The equals sign means Python should store the value on the right inside the name on the left.

So this:

```python
city = "Toronto"
```

means:

> Store the text `"Toronto"` inside the variable called `city`.

## Printing a variable

Once a variable has a value, you can print it.

```python
name = "Alex"
print(name)
```

This will show:

```text
Alex
```

Notice that `name` does not use quotes in the `print()` line.

That is because you want Python to use the variable called `name`.

If you write this:

```python
print("name")
```

Python will print the word:

```text
name
```

That is different.

## Changing a variable

Variables can change.

For example:

```python
mood = "happy"
print(mood)

mood = "excited"
print(mood)
```

This will print:

```text
happy
excited
```

The variable is still called `mood`, but the value inside it changed.

That is useful because programs often need to remember information and update it later.

## Variable names

Good variable names make code easier to read.

These are good beginner variable names:

```python
name = "Alex"
favourite_food = "pizza"
score = 10
```

Try to use names that describe what the value means.

In Python, variable names usually:

- use lowercase letters
- use underscores between words
- do not start with a number
- do not have spaces

So this works:

```python
favourite_colour = "blue"
```

This does not:

```python
favourite colour = "blue"
```

The space breaks the variable name.

## Common mistakes

Here are a few common mistakes.

### Putting quotes around the variable name

```python
name = "Alex"
print("name")
```

This prints the word `name`, not the value `"Alex"`.

Use this instead:

```python
print(name)
```

### Using a variable before creating it

```python
print(age)
age = 14
```

Python reads from top to bottom.

You need to create the variable before you use it.

### Using spaces in a variable name

```python
favourite food = "pizza"
```

Use an underscore instead:

```python
favourite_food = "pizza"
```

These mistakes are normal. The important thing is learning how to notice them.

## Try it yourself

Now try a few small experiments in [__main__.py](__main__.py).

### Challenge 1
Create a variable called `name` and store your name in it.

Then print it.

### Challenge 2
Create a variable called `favourite_food`.

Store your favourite food in it and print it.

### Challenge 3
Create a variable called `age`.

Store a number in it and print it.

### Challenge 4
Create a variable called `goal`.

Store something you want to build one day, then print it.

### Challenge 5
Change one variable after printing it once.

Then print it again and see how the output changes.

## Wrap up

That is it for this module.

You learned that variables are names that store values.

You also saw that variables can store:

- text
- numbers
- values that change later

Variables are one of the biggest ideas in programming.

You will use them constantly from here on.
