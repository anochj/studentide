#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char title[40];
    int minutes;
} Record;

void print_record(const Record *record) {
    printf("- %s: %d minutes\n", record->title, record->minutes);
}

int main(void) {
    int count = 3;
    Record *records = malloc((size_t)count * sizeof(Record));

    if (records == NULL) {
        printf("Could not allocate records.\n");
        return 1;
    }

    strcpy(records[0].title, "Pointers");
    records[0].minutes = 20;
    strcpy(records[1].title, "Structs");
    records[1].minutes = 25;
    strcpy(records[2].title, "Files");
    records[2].minutes = 15;

    printf("CLI Records Tool\n");
    for (int i = 0; i < count; i++) {
        print_record(&records[i]);
    }

    free(records);
    return 0;
}
