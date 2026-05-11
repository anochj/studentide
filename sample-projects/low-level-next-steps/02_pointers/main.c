#include <stdio.h>

int main(void) {
    int score = 10;
    int *score_pointer = &score;

    printf("Score: %d\n", score);
    printf("Score through pointer: %d\n", *score_pointer);

    *score_pointer = 15;
    printf("Updated score: %d\n", score);
    return 0;
}
