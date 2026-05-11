#include <stdio.h>

int main(void) {
    int scores[3] = {10, 20, 30};
    char name[] = "Alex";

    printf("Name: %s\n", name);
    printf("Scores:\n");

    for (int i = 0; i < 3; i++) {
        printf("- %d\n", scores[i]);
    }

    return 0;
}
