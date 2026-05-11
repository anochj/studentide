#include <stdio.h>

int main(void) {
    int scores[] = {10, 20, 30};
    int *current = scores;

    for (int i = 0; i < 3; i++) {
        printf("Score %d: %d\n", i + 1, *(current + i));
    }

    return 0;
}
