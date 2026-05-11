#include <stdio.h>

void print_step(int number) {
    printf("Step %d complete.\n", number);
}

int main(void) {
    for (int i = 1; i <= 3; i++) {
        print_step(i);
    }

    int countdown = 3;
    while (countdown > 0) {
        printf("Countdown: %d\n", countdown);
        countdown--;
    }

    return 0;
}
