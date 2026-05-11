#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int count = 3;
    int *scores = malloc((size_t)count * sizeof(int));

    if (scores == NULL) {
        printf("Memory allocation failed.\n");
        return 1;
    }

    scores[0] = 10;
    scores[1] = 20;
    scores[2] = 30;

    for (int i = 0; i < count; i++) {
        printf("Score: %d\n", scores[i]);
    }

    free(scores);
    return 0;
}
