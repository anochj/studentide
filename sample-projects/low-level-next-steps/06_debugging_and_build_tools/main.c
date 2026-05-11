#include <stdio.h>

int add_scores(int first, int second) {
    return first + second;
}

int main(void) {
    int total = add_scores(10, 15);
    printf("Total: %d\n", total);
    printf("Compile with -Wall -Wextra to let the compiler help you.\n");
    return 0;
}
