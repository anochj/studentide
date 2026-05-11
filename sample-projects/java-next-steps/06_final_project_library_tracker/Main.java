import java.util.ArrayList;

class Book {
    String title;
    String author;
    boolean checkedOut;

    Book(String title, String author, boolean checkedOut) {
        this.title = title;
        this.author = author;
        this.checkedOut = checkedOut;
    }

    String status() {
        if (checkedOut) {
            return "checked out";
        }
        return "available";
    }
}

public class Main {
    static void printBook(Book book) {
        System.out.println(book.title + " by " + book.author + " - " + book.status());
    }

    public static void main(String[] args) {
        ArrayList<Book> books = new ArrayList<>();
        books.add(new Book("Learning Java", "Student IDE", false));
        books.add(new Book("Small Projects", "Alex Lee", true));
        books.add(new Book("Console Apps", "Sam Rivera", false));

        System.out.println("Library Checkout Tracker");
        System.out.println();

        for (Book book : books) {
            printBook(book);
        }

        System.out.println();
        System.out.println("Available books:");
        for (Book book : books) {
            if (!book.checkedOut) {
                printBook(book);
            }
        }
    }
}
