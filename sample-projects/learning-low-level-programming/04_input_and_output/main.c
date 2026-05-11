#include <stdio.h>

int main(void) {
    char name[40];
    int age;

    printf("What is your first name? ");
    scanf("%39s", name);

    printf("How old are you? ");
    scanf("%d", &age);

    printf("Hello, %s. You are %d years old.\n", name, age);
    return 0;
}
