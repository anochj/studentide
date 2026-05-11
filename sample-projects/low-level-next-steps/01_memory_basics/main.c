#include <stdio.h>

int main(void) {
    int score = 42;
    printf("Value: %d\n", score);
    printf("Address: %p\n", (void *)&score);
    return 0;
}
