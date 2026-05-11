#include <stdio.h>

typedef struct {
    char title[40];
    int minutes;
} StudyRecord;

int main(void) {
    StudyRecord record = {"C pointers", 25};
    FILE *file = fopen("records.txt", "w");

    if (file == NULL) {
        printf("Could not open file.\n");
        return 1;
    }

    fprintf(file, "%s,%d\n", record.title, record.minutes);
    fclose(file);

    printf("Saved one record to records.txt.\n");
    remove("records.txt");
    return 0;
}
