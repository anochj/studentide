#include <stdio.h>

int main(void) {
    int score = 10;
    double temperature = 21.5;
    char grade = 'A';

    printf("Score: %d\n", score);
    printf("Temperature: %.1f\n", temperature);
    printf("Grade: %c\n", grade);
    printf("An int uses %zu bytes here.\n", sizeof(score));
    return 0;
}
