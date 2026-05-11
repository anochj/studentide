import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> books = new ArrayList<>();
        books.add("Learning Java");
        books.add("Java Projects");
        books.add("Python Notes");

        String search = "Java";
        System.out.println("Books that include " + search + ":");

        for (String book : books) {
            if (book.contains(search)) {
                System.out.println("- " + book);
            }
        }
    }
}
