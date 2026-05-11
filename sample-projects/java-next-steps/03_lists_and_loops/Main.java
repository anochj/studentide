import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> books = new ArrayList<>();
        books.add("Learning Java");
        books.add("Clean Code Notes");
        books.add("Small Projects");

        for (String book : books) {
            System.out.println("- " + book);
        }
    }
}
