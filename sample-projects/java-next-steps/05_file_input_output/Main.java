import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class Main {
    public static void main(String[] args) throws IOException {
        Path file = Path.of("library-notes.txt");
        Files.writeString(file, "Learning Java\nSmall Projects\n");

        List<String> lines = Files.readAllLines(file);
        System.out.println("Saved books:");
        for (String line : lines) {
            System.out.println("- " + line);
        }

        Files.deleteIfExists(file);
    }
}
