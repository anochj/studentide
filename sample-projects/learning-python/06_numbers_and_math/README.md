# Module 6: Numbers and Math

Welcome back.

In this module, you will use Python as a calculator.

Python can work with numbers, do math, and store results in variables. This is useful for scores, prices, ages, game points, measurements, and a lot more.

Do not worry if math is not your favourite thing. The Python part is the main focus here.

## Table of Contents
1. [What you will learn](#what-you-will-learn)
2. [How to run this module](#how-to-run-this-module)
3. [Numbers in Python](#numbers-in-python)
4. [Open the file](#open-the-file)
5. [Basic math](#basic-math)
6. [Storing math in variables](#storing-math-in-variables)
7. [Using parentheses](#using-parentheses)
8. [Text numbers and real numbers](#text-numbers-and-real-numbers)
9. [Common mistakes](#common-mistakes)
10. [Try it yourself](#try-it-yourself)
11. [Wrap up](#wrap-up)

## What you will learn

By the end of this module, you will know:

- how to write numbers in Python
- how to add, subtract, multiply, and divide
- how to store math results in variables
- why `"5"` and `5` are not the same thing
- how parentheses affect math

## How to run this module

To run this module, open the terminal and type:

```bash
python3 06_numbers_and_math
```

Then press Enter.

## Numbers in Python

Numbers do not need quotes.

For example:

```python
print(5)
print(100)
```

Python understands these as numbers.

You can also store numbers in variables:

```python
score = 10
age = 14
```

Then you can print them:

```python
print(score)
print(age)
```

## Open the file

Open [__main__.py](__main__.py).

This is the file you will use for this module.

Inside, you should see examples of numbers, math, and variables.

Run the file first. Then change the numbers and run it again.

## Basic math

Python can do basic math.

```python
print(2 + 3)
print(10 - 4)
print(6 * 7)
print(20 / 5)
```

These symbols are called operators.

- `+` adds
- `-` subtracts
- `*` multiplies
- `/` divides

Multiplication uses `*`, not `x`.

That is common in programming.

## Storing math in variables

You can store a math result in a variable.

```python
points = 10 + 5
print(points)
```

You can also use variables in math:

```python
score = 10
bonus = 5
total = score + bonus
print(total)
```

This prints:

```text
15
```

This is one reason variables are useful. They let your program remember values and work with them.

## Using parentheses

Parentheses can change the order of math.

```python
print(2 + 3 * 4)
print((2 + 3) * 4)
```

These give different answers.

Python follows math rules, so multiplication happens before addition unless parentheses say otherwise.

When in doubt, use parentheses to make your meaning clear.

## Text numbers and real numbers

This is important:

```python
5
```

is a number.

But this:

```python
"5"
```

is text.

They look similar, but Python treats them differently.

You can do math with numbers:

```python
print(5 + 5)
```

This prints:

```text
10
```

But if you join strings:

```python
print("5" + "5")
```

Python prints:

```text
55
```

That is because it is joining text, not adding numbers.

## Common mistakes

Here are a few common mistakes.

### Putting quotes around numbers by accident

```python
score = "10"
bonus = "5"
print(score + bonus)
```

This prints `105`, not `15`.

Use numbers without quotes when you want math:

```python
score = 10
bonus = 5
print(score + bonus)
```

### Using `x` for multiplication

```python
print(3 x 4)
```

Python uses `*`:

```python
print(3 * 4)
```

### Forgetting that division uses `/`

```python
print(10 / 2)
```

This is how Python divides.

## Try it yourself

Now try a few small experiments in [__main__.py](__main__.py).

### Challenge 1
Create two number variables and add them together.

Print the result.

### Challenge 2
Create a `score` variable and a `bonus` variable.

Add them together into a `total_score` variable.

### Challenge 3
Print one multiplication example.

### Challenge 4
Try this:

```python
print("5" + "5")
print(5 + 5)
```

Notice the difference.

### Challenge 5
Use parentheses in one math expression.

## Wrap up

That is it for this module.

You learned that Python can work with numbers and do math.

You also saw that numbers and strings are different:

- `5` is a number
- `"5"` is text

That difference matters a lot as your programs get bigger.
