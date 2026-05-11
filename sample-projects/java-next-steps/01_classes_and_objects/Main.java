class Book {
    String title;
    String author;

    Book(String title, String author) {
        this.title = title;
        this.author = author;
    }
}

public class Main {
    public static void main(String[] args) {
        Book book = new Book("A Small Start", "Alex Lee");
        System.out.println(book.title + " by " + book.author);
    }
}
