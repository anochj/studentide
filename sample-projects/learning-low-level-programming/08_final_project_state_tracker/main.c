#include <stdio.h>

int main(void) {
    int energy;
    int focus;
    int tasks[3];
    int total = 0;

    printf("State Tracker\n");
    printf("Energy from 1 to 10: ");
    scanf("%d", &energy);
    printf("Focus from 1 to 10: ");
    scanf("%d", &focus);

    for (int i = 0; i < 3; i++) {
        printf("Tasks finished in block %d: ", i + 1);
        scanf("%d", &tasks[i]);
        total += tasks[i];
    }

    printf("\nSummary\n");
    printf("Energy: %d\n", energy);
    printf("Focus: %d\n", focus);
    printf("Tasks finished: %d\n", total);

    if (energy >= 7 && focus >= 7) {
        printf("You had a strong work session.\n");
    } else {
        printf("You made progress. Keep the next step small.\n");
    }

    return 0;
}
