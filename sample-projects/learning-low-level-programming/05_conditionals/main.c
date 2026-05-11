#include <stdio.h>

int main(void) {
    int energy = 7;

    if (energy >= 8) {
        printf("You are ready for a big challenge.\n");
    } else if (energy >= 5) {
        printf("You can take a steady step.\n");
    } else {
        printf("Start small today.\n");
    }

    return 0;
}
